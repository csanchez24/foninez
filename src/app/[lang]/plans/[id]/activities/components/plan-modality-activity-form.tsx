'use client';

import type {
  Plan,
  PlanModalityActivity,
  PlanModalityActivityFormValues,
} from '../components/@types';

import { PlanModalityActivityCreateBodySchema } from '@/schemas/plan-modality-activity';

import { Icons } from '@/components/icons';
import { FormSkeleton } from '@/components/skeletons';
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
import { Form } from '@/components/ui/form';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as React from 'react';

import { useToast } from '@/components/ui/use-toast';
import { useFormErrors } from '@/hooks';
import {
  useCreatePlanModalityActivity,
  useUpdatePlanModalityActivity,
} from '@/hooks/queries/use-plan-modality-activity-queries';
import { usePermissions } from '@/hooks/use-permissions';
import { useStoreContext } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import dynamic from 'next/dynamic';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';

// Dynamic form components
const PlanModalityActivityInfoForm = dynamic(() => import('./plan-modality-activity-form-info'));
const PlanModalityActivitySchoolsForm = dynamic(
  () => import('./plan-modality-activity-form-schools'),
  { loading: FormSkeleton }
);
const PlanModalityActivityResourcesForm = dynamic(
  () => import('./plan-modality-activity-form-resources'),
  { loading: FormSkeleton }
);
const PlanModalityActivityProofFilesForm = dynamic(
  () => import('./plan-modality-activity-form-proof-files'),
  { loading: FormSkeleton }
);

type PlanModalityActivityFormSheetProps = {
  plan?: Plan;
  planModalityActivity?: PlanModalityActivity;
  opened: boolean;
  onOpened(opened: boolean): void;
};

export function PlanModalityActivityFormSheet({
  plan,
  planModalityActivity,
  opened,
  onOpened,
}: PlanModalityActivityFormSheetProps) {
  const dictionary = useStoreContext((state) => state.dictionary.planModalityActivity.form);

  const { getPermission } = usePermissions({ include: ['manage:planModalityActivity'] });

  const { toast } = useToast();

  const { onSubmitError } = useFormErrors();

  const [openedUnsavedChangesDialog, setOpenedUnsavedChangesDialog] = React.useState(false);

  // Ref allows to dynamically submit form within alert dialog when there're unsaved changes.
  const formRef = React.useRef<HTMLFormElement>(null);

  const form = useForm<PlanModalityActivityFormValues>({
    resolver: zodResolver(PlanModalityActivityCreateBodySchema.shape.data),
    values: React.useMemo(() => {
      return {
        name: planModalityActivity?.name ?? '',
        description: planModalityActivity?.description ?? '',
        startDate: planModalityActivity?.startDate ?? new Date(),
        endDate: planModalityActivity?.endDate ?? new Date(),
        requiredProofOfCompletionCount: planModalityActivity?.requiredProofOfCompletionCount ?? 0,
        planModalityId: planModalityActivity?.planModality?.modalityId,
        planId: plan?.id,
        serviceAipiId: planModalityActivity?.serviceAipiId ?? 0,
        schools: planModalityActivity?.planModalityActivitySchools?.filter(
          ({ school }) => !!school
        ) as PlanModalityActivityFormValues['schools'],
        resources: planModalityActivity?.planModalityActivityResources?.filter(
          ({ resource }) => !!resource
        ) as PlanModalityActivityFormValues['resources'],
        proofFiles: planModalityActivity?.planModalityActivityProofFiles?.filter(
          ({ proofFileClassification }) => !!proofFileClassification
        ) as PlanModalityActivityFormValues['proofFiles'],
      };
    }, [planModalityActivity, plan]),
  });

  const handleOnOpenChange = React.useCallback(
    (opened: boolean) => {
      if (!opened && form.formState.isDirty) {
        return setOpenedUnsavedChangesDialog(true);
      }
      if (!opened) {
        form.reset();
      }
      onOpened(opened);
    },
    [onOpened, form]
  );

  const handleDiscardChanges = React.useCallback(() => {
    form.reset();
    setOpenedUnsavedChangesDialog(false);
    onOpened(false);
  }, [form, onOpened, setOpenedUnsavedChangesDialog]);

  const handleSaveChanges = React.useCallback(() => {
    formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  }, []);

  const { mutateAsync: create, isLoading: isLoadingCreate } = useCreatePlanModalityActivity({
    onSuccess: () => {
      form.reset();
      onOpened(false);
    },
  });

  const { mutateAsync: update, isLoading: isLoadingUpdate } = useUpdatePlanModalityActivity({
    onSuccess: () => {
      form.reset();
      onOpened(false);
    },
  });

  const onSubmit = useCallback(
    async (data: PlanModalityActivityFormValues) => {
      if (!getPermission(['create:planModalityActivity', 'update:planModalityActivity']).granted) {
        return toast({
          variant: 'destructive',
          description: 'You do not have permission to create/update plan modality activity.',
        });
      }
      if (!data.planId) {
        return toast({
          variant: 'destructive',
          description: '`plan id` is required when creating a new plan modality activity.',
        });
      }
      if (!data.planModalityId) {
        return toast({
          variant: 'destructive',
          description: '`plan modality id` is required when creating a new plan modality activity.',
        });
      }

      return typeof planModalityActivity === 'undefined'
        ? create({ body: { data: data as Required<typeof data> } })
        : update({
            params: { id: planModalityActivity.id },
            body: { data: data as Required<typeof data> },
          });
    },
    [create, update, getPermission, toast, planModalityActivity]
  );

  const tabNames = React.useMemo(
    () => Object.values(dictionary.tabs) as [string, string, string, string],
    [dictionary.tabs]
  );

  const tabs = React.useMemo(
    () =>
      new Map<
        string,
        {
          component: React.ComponentType<{
            plan?: Plan;
          }>;
        }
      >([
        [tabNames[0], { component: PlanModalityActivityInfoForm }],
        [tabNames[1], { component: PlanModalityActivitySchoolsForm }],
        [tabNames[2], { component: PlanModalityActivityResourcesForm }],
        [tabNames[3], { component: PlanModalityActivityProofFilesForm }],
      ]),
    [tabNames]
  );
  const [tab, setTab] = React.useState<string>(tabNames[0]);
  const renderTabContent = React.useCallback(() => {
    const Component = tabs.get(tab)?.component ?? FormSkeleton;
    return <Component plan={plan} />;
  }, [tab, tabs, plan]);

  return (
    <>
      <Sheet open={opened} onOpenChange={handleOnOpenChange}>
        <SheetContent className="w-full overflow-y-scroll sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>
              <div>{dictionary.headings.new}</div>
            </SheetTitle>
            <SheetDescription>{dictionary.description}</SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form
              ref={formRef}
              onSubmit={form.handleSubmit(onSubmit, onSubmitError)}
              className="space-y-4"
            >
              <Tabs value={tab} onValueChange={(tab) => setTab(tab)} className="mt-4">
                <TabsList className="grid w-fit grid-cols-4">
                  {tabNames.map((tabName) => (
                    <TabsTrigger
                      key={`tab-${tabName}`}
                      value={tabName}
                      className="text-xs capitalize sm:text-sm"
                    >
                      {tabName}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value={tab} className="space-y-2">
                  {renderTabContent()}
                  {getPermission('create:planModalityActivity').granted && (
                    <Button
                      type="submit"
                      disabled={isLoadingCreate || isLoadingUpdate}
                      className="ml-auto flex"
                    >
                      {isLoadingCreate ||
                        (isLoadingUpdate && (
                          <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
                        ))}
                      {dictionary.buttons.save}
                    </Button>
                  )}
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </SheetContent>
      </Sheet>

      {/* Alert plan of unsaved changes */}
      <AlertDialog open={openedUnsavedChangesDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dictionary.dialogs.unsaved.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {dictionary.dialogs.unsaved.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDiscardChanges}>
              {dictionary.dialogs.unsaved.buttons.discard}
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isLoadingCreate || isLoadingUpdate}
              onClick={handleSaveChanges}
            >
              {isLoadingCreate ||
                (isLoadingUpdate && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />)}
              {dictionary.dialogs.unsaved.buttons.save}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
