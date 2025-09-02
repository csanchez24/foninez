'use client';

import type { Locale } from '@/i18n/config';
import type { Plan } from './@types';

import { Icons } from '@/components/icons';
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
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PlanFormSheet } from './plan-form';
import { PlanInfoSheet } from './plan-info';
import { PlansDataTable } from './plans-data-table';

import { useDataTableUtils } from '@/components/data-table';
import { useDeletePlan, useGetPlans } from '@/hooks/queries/use-plan-queries';
import { usePermissions } from '@/hooks/use-permissions';
import { useStoreContext } from '@/store';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

export const Plans = ({ lang }: { lang: Locale }) => {
  const dictionary = useStoreContext((state) => state.dictionary.plan);
  const dictionaryMisc = useStoreContext((state) => state.dictionary.misc);

  const router = useRouter();

  const { getPermission } = usePermissions({ include: ['manage:plan', 'manage:program'] });

  const { deboucedSearchText, sort, pagination, onSearch, onSorting, onPagination } =
    useDataTableUtils({ sort: { createdAt: 'desc' } });

  // Hooks for getting, updating, and deleting plans
  const { data, isInitialLoading, isFetching } = useGetPlans({
    ...pagination,
    deboucedSearchText,
    sort,
  });
  const { mutateAsync: deletePlan, isLoading: isDeleting } = useDeletePlan();

  // Track selected row/plan in order to view/edit/remove
  const [plan, setPlan] = useState<Plan>();

  // State and handlers related to show/hide plan info side drawer
  const [openedPlanInfoSheet, setOpenedPlanInfoSheet] = useState(false);
  const handlePlanFormInfoChange = useCallback(
    (open: boolean) => {
      if (!open) setPlan(undefined);
      setOpenedPlanInfoSheet(open);
    },
    [setPlan, setOpenedPlanInfoSheet]
  );

  // State and handlers related to show/hide plan form side drawer
  const [openedPlanFormSheet, setOpenedPlanFormSheet] = useState(false);
  const handlePlanFormSheetChange = useCallback(
    (open: boolean) => {
      if (!open) setPlan(undefined);
      setOpenedPlanFormSheet(open);
    },
    [setPlan, setOpenedPlanFormSheet]
  );

  // State and handlers to show/hide dialog needed to confirm plan deletion
  const [openedDeletePlanDialog, setOpenedDeletePlanDialog] = useState(false);
  const handleDeletePlan = useCallback(async () => {
    if (!plan?.id) return;
    await deletePlan({ params: { id: plan.id } });
    setPlan(undefined);
    setOpenedDeletePlanDialog(false);
  }, [plan?.id, setPlan, setOpenedDeletePlanDialog, deletePlan]);

  // Handle click on `open` action from the data table
  const handleRowOpenPlan = (row: Plan) => {
    setPlan(row);
    setOpenedPlanInfoSheet(true);
  };

  // Handle click on `edit` action from the data table
  const handleRowEditPlan = (row: Plan) => {
    setPlan(row);
    setOpenedPlanFormSheet(true);
  };

  // Handle click on `delete` action from the data table
  const handleRowDelete = (row: Plan) => {
    setPlan(row);
    setOpenedDeletePlanDialog(true);
  };

  // Handle click on `create an activity` action from the data table
  const handleRowCreateActivity = (row: Plan) => {
    setPlan(row);
    router.push(`/${lang}/plans/${row.id}/activities?faction=create`);
  };

  // Take customers to /plan/{id}/activities for better UI experience
  const handleRowViewActivities = (row: Plan) => {
    router.push(`/${lang}/plans/${row.id}/activities`);
  };

  return (
    <Layout.Root>
      <Layout.Header>
        <div className="flex items-center justify-between gap-8">
          <Layout.Heading>{dictionary.layout.title}</Layout.Heading>

          <div className="flex gap-5">
            {getPermission('read:program').granted && (
              <Button onClick={() => router.push(`/${lang}/programs`)}>
                {dictionary.buttons.goToPrograms}
                <Icons.ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Icons.DotsHorizontal className="mr-2 h-4 w-4" />
                  {dictionary.buttons.actions}
                  <Icons.ChevronDown className="ml-6 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                {getPermission('create:plan').granted && (
                  <DropdownMenuItem onClick={() => handlePlanFormSheetChange(true)}>
                    {dictionary.buttons.newPlan}
                  </DropdownMenuItem>
                )}
                {getPermission('create:program').granted && (
                  <DropdownMenuItem onClick={() => router.push(`/${lang}/programs?faction=create`)}>
                    {dictionary.buttons.newProgram}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Layout.Header>
      <Layout.Main>
        {/* Plans data table */}
        <PlansDataTable
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
          onRowCreateActivity={handleRowCreateActivity}
          onRowViewActivities={handleRowViewActivities}
        />

        {/* Plan info side drawer/sheet */}
        <PlanInfoSheet
          plan={plan}
          opened={openedPlanInfoSheet}
          onOpened={handlePlanFormInfoChange}
        />

        {/* Plan form side drawer/sheet */}
        <PlanFormSheet
          plan={plan}
          opened={openedPlanFormSheet}
          onOpened={handlePlanFormSheetChange}
        />

        {/* Alert plan before deleting */}
        <AlertDialog open={openedDeletePlanDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{dictionaryMisc.dialogs.delete.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {dictionaryMisc.dialogs.delete.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpenedDeletePlanDialog(false)}>
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
