'use client';

import type { PLAN_STATUSES } from '@/app/[lang]/plans/components/constants';
import type { Locale } from '@/i18n/config';
import type { PlanModalityActivity, PlanUpdateStatusFormValues } from './@types';

import { PlanUpdateStatusBodySchema } from '@/schemas/plan';

import { Icons } from '@/components/icons';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import * as Layout from '@/components/layout';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { PlanModalityActivitiesDataTable } from './plan-modality-activities-data-table';
import { PlanModalityActivityFormSheet } from './plan-modality-activity-form';
import { PlanModalityActivityInfoSheet } from './plan-modality-activity-info';
import { Textarea } from '@/components/ui/textarea';

import { useFormErrors } from '@/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDataTableUtils } from '@/components/data-table';
import { useToast } from '@/components/ui/use-toast';
import {
  useDeletePlanModalityActivity,
  useGetPlanModalityActivities,
} from '@/hooks/queries/use-plan-modality-activity-queries';
import { useGetPlan, useUpdatePlanStatus } from '@/hooks/queries/use-plan-queries';
import { usePermissions } from '@/hooks/use-permissions';
import { useStoreContext } from '@/store';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

export const PlanModalityActivities = ({ lang, planId }: { lang: Locale; planId: number }) => {
  const dictionary = useStoreContext((state) => state.dictionary.planModalityActivity);
  const dictionaryPlanForm = useStoreContext((state) => state.dictionary.plan.form);
  const dictionaryMisc = useStoreContext((state) => state.dictionary.misc);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const { toast } = useToast();

  const { getPermission } = usePermissions({ include: ['manage:planModalityActivity'] });

  // This is prefetched before hand in the server call
  const planResp = useGetPlan(planId);

  const planStatus = useMemo(
    () => planResp?.data?.body.status as (typeof PLAN_STATUSES)[number] | undefined,
    [planResp]
  );

  const { onSubmitError } = useFormErrors();

  const { deboucedSearchText, sort, pagination, onSearch, onSorting, onPagination } =
    useDataTableUtils({ sort: { createdAt: 'desc' } });

  // Hooks for getting, updating, and deleting
  const { data, isInitialLoading, isFetching } = useGetPlanModalityActivities({
    ...pagination,
    deboucedSearchText,
    sort,
    planId,
  });

  // Delete one activity
  const { mutateAsync: deletePlanModalityActivity, isLoading: isDeleting } =
    useDeletePlanModalityActivity();

  // Track selected row in order to view/edit/remove
  const [planModalityActivity, setPlanModalityActivity] = useState<PlanModalityActivity>();

  // State and handlers related to show/hide plan's modality activity form side drawer
  const [openedPlanModalityActivityFormSheet, setOpenedPlanModalityActivityFormSheet] = useState(
    () => {
      const faction = searchParams.get('faction');
      return faction === 'create' || faction === 'update';
    }
  );
  const handlePlanModalityActivityFormSheetChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setPlanModalityActivity(undefined);
        // Remove 'faction' search param on closing of sheet to avoid re-showing it to
        // user on page reload
        if (searchParams.has('faction')) {
          router.replace(pathname);
        }
      }
      setOpenedPlanModalityActivityFormSheet(open);
    },
    [setOpenedPlanModalityActivityFormSheet, searchParams, pathname, router]
  );

  // State and handlers related to show/hide plan's modality activity info side drawer
  const [openedPlanModalityActivityInfoSheet, setOpenedPlanModalityActivityInfoSheet] =
    useState(false);
  const handlePlanModalityActivityInfoSheetChange = useCallback(
    (open: boolean) => {
      if (!open) setPlanModalityActivity(undefined);
      setOpenedPlanModalityActivityInfoSheet(open);
    },
    [setOpenedPlanModalityActivityInfoSheet]
  );

  // Just handle updating statuses
  const planUpdateStatusForm = useForm<PlanUpdateStatusFormValues>({
    resolver: zodResolver(PlanUpdateStatusBodySchema.shape.data),
    values: useMemo(() => {
      return {
        status: planResp?.data?.body?.status ?? 'draft',
        description: planResp?.data?.body?.rejectionNote ?? '',
      };
    }, [planResp?.data?.body]),
  });

  // Ref allows to dynamically submit form within alert dialog when there're unsaved changes.
  const planUpdateStatusformRef = useRef<HTMLFormElement>(null);

  const [openedStatusDialog, setOpenedStatusDialog] = useState(false);
  const handleUpdatePlanStatus = useCallback(
    (status: (typeof PLAN_STATUSES)[number]) => () => {
      planUpdateStatusForm.setValue('status', status);
      setOpenedStatusDialog(true);
    },
    [setOpenedStatusDialog, planUpdateStatusForm]
  );

  const { mutateAsync: updateStatus, isLoading: isUpdatingStatus } = useUpdatePlanStatus();

  const onSubmitUpdateStatus = useCallback(
    async (data: PlanUpdateStatusFormValues) => {
      if (!getPermission('update:plan').granted) {
        return toast({
          variant: 'destructive',
          description: 'You do not have permission to update plan status.',
        });
      }
      if (!planId) {
        return toast({
          variant: 'destructive',
          description: '`plan id` is required when creating a new plan modality activity.',
        });
      }
      updateStatus({
        params: { id: planId },
        body: { data: data as Required<typeof data> },
      });
      setOpenedStatusDialog(false);
    },
    [updateStatus, getPermission, toast, planId]
  );

  const handleSaveUpdateStatus = useCallback(() => {
    planUpdateStatusformRef.current?.dispatchEvent(
      new Event('submit', { cancelable: true, bubbles: true })
    );
  }, []);

  // State and handlers to show/hide dialog needed to confirm plan deletion
  const [openedDeletePlanModalityActivityDialog, setOpenedDeletePlanModalityActivityDialog] =
    useState(false);
  const handleDeletePlan = useCallback(async () => {
    if (!planModalityActivity?.id) return;
    await deletePlanModalityActivity({ params: { id: planModalityActivity.id } });
    setPlanModalityActivity(undefined);
    setOpenedDeletePlanModalityActivityDialog(false);
  }, [
    planModalityActivity?.id,
    setPlanModalityActivity,
    setOpenedDeletePlanModalityActivityDialog,
    deletePlanModalityActivity,
  ]);

  // Handle click on `open` action from the data table
  const handleRowOpenPlan = (row: PlanModalityActivity) => {
    setPlanModalityActivity(row);
    setOpenedPlanModalityActivityInfoSheet(true);
  };

  // Handle click on `edit` action from the data table
  const handleRowEditPlan = (row: PlanModalityActivity) => {
    setPlanModalityActivity(row);
    setOpenedPlanModalityActivityFormSheet(true);
  };

  // Handle click on `delete` action from the data table
  const handleRowDelete = (row: PlanModalityActivity) => {
    setPlanModalityActivity(row);
    setOpenedDeletePlanModalityActivityDialog(true);
  };

  return (
    <Layout.Root>
      <Layout.Header>
        <div className="flex items-center justify-between gap-8">
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/${lang}/plans`}>
                    {dictionary.layout.breadCrumbList.plans}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="block max-w-44 truncate overflow-ellipsis">
                  {planResp.data?.body.year ?? ''} - {planResp.data?.body.description ?? ''}
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>{dictionary.layout.breadCrumbList.plans}</BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Layout.Heading className="flex items-center space-x-2">
              <span>{dictionary.layout.title}</span>{' '}
              {planStatus && (
                <Badge className="capitalize">{dictionary.statuses[planStatus]}</Badge>
              )}
            </Layout.Heading>
            {planResp.data?.body.status === 'rejected' && (
              <div className="text-sm font-medium">{planResp.data.body.rejectionNote}</div>
            )}
          </div>

          <div className="flex gap-5">
            {getPermission('reject:plan').granted &&
              planStatus !== 'draft' &&
              planStatus !== 'approved' &&
              planStatus !== 'rejected' && (
                <Button onClick={handleUpdatePlanStatus('rejected')} variant="secondary">
                  <Icons.Close className="mr-2 h-4 w-4" />
                  {dictionary.buttons.reject}
                </Button>
              )}
            {(planStatus === 'draft' || planStatus === 'rejected') &&
              getPermission('publish:plan').granted && (
                <Button onClick={handleUpdatePlanStatus('pending review')}>
                  <Icons.Check className="mr-2 h-4 w-4" />
                  {dictionary.buttons.sendToReview}
                </Button>
              )}
            {planStatus === 'pending review' && getPermission('review:plan').granted && (
              <Button onClick={handleUpdatePlanStatus('reviewed')}>
                <Icons.Check className="mr-2 h-4 w-4" />
                {dictionary.buttons.review}
              </Button>
            )}
            {planStatus === 'reviewed' && getPermission('approved:plan').granted && (
              <Button onClick={handleUpdatePlanStatus('approved')}>
                <Icons.Check className="mr-2 h-4 w-4" />
                {dictionary.buttons.approve}
              </Button>
            )}
            {getPermission('read:plan').granted && (
              <Button onClick={() => router.push(`/${lang}/plans`)}>
                <Icons.ArrowLeft className="mr-2 h-4 w-4" />
                {dictionary.buttons.goToPlans}
              </Button>
            )}
            {getPermission('create:planModalityActivity').granted &&
              (planResp.data?.body.status === 'draft' ||
                planResp.data?.body.status === 'rejected') && (
                <Button onClick={() => handlePlanModalityActivityFormSheetChange(true)}>
                  <Icons.PlusCircled className="mr-2 h-4 w-4" />
                  {dictionary.buttons.new}
                </Button>
              )}
          </div>
        </div>
      </Layout.Header>
      <Layout.Main>
        {/* PlanModalityActivities data table */}
        <PlanModalityActivitiesDataTable
          data={data?.body}
          isLoading={!isInitialLoading && isFetching}
          isInitialLoading={isInitialLoading}
          sort={sort}
          pagination={pagination}
          onSorting={onSorting}
          onPagination={onPagination}
          onSearch={onSearch}
          onRowOpen={handleRowOpenPlan}
          onRowEdit={handleRowEditPlan}
          onRowDelete={handleRowDelete}
        />

        {/* View/Open Plan Modality Activity form side drawer/sheet */}
        <PlanModalityActivityInfoSheet
          planModalityActivity={planModalityActivity}
          opened={openedPlanModalityActivityInfoSheet}
          onOpened={handlePlanModalityActivityInfoSheetChange}
        />

        {/* Plan Modality Activity form side drawer/sheet */}
        <PlanModalityActivityFormSheet
          plan={planResp.data?.body}
          planModalityActivity={planModalityActivity}
          opened={openedPlanModalityActivityFormSheet}
          onOpened={handlePlanModalityActivityFormSheetChange}
        />

        {/* Alert user before changing the status */}
        <AlertDialog open={openedStatusDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{dictionary.misc.dialogs.updateStatus.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {dictionary.misc.dialogs.updateStatus.description}
              </AlertDialogDescription>
            </AlertDialogHeader>

            {/* ONLY show on when reject button is click */}
            <Form {...planUpdateStatusForm}>
              <form
                ref={planUpdateStatusformRef}
                onSubmit={planUpdateStatusForm.handleSubmit(onSubmitUpdateStatus, onSubmitError)}
                className="space-y-4"
              >
                {planUpdateStatusForm.getValues('status') === 'rejected' && (
                  <FormField
                    name="rejectionNote"
                    control={planUpdateStatusForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dictionaryPlanForm.info.rejectionNoteField.label}</FormLabel>
                        <FormControl>
                          <Textarea
                            className="resize-none"
                            placeholder={dictionaryPlanForm.info.rejectionNoteField.placeholder}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {dictionaryPlanForm.info.rejectionNoteField.description}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </form>
            </Form>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpenedStatusDialog(false)}>
                {dictionary.misc.dialogs.updateStatus.buttons.cancel}
              </AlertDialogCancel>
              <AlertDialogAction disabled={isUpdatingStatus} onClick={handleSaveUpdateStatus}>
                {isUpdatingStatus && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
                {dictionary.misc.dialogs.updateStatus.buttons.continue}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Alert plan before deleting */}
        <AlertDialog open={openedDeletePlanModalityActivityDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{dictionaryMisc.dialogs.delete.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {dictionaryMisc.dialogs.delete.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpenedDeletePlanModalityActivityDialog(false)}>
                {dictionaryMisc.dialogs.delete.buttons.cancel}
              </AlertDialogCancel>
              <AlertDialogAction disabled={isDeleting} onClick={handleDeletePlan}>
                {isDeleting && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
                {dictionaryMisc.dialogs.delete.buttons.continue}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Layout.Main>
    </Layout.Root>
  );
};
