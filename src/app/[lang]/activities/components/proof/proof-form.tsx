'use client';

import type { Activity, ActivityProofFormValues } from '../@types';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import * as React from 'react';

import { useStoreContext } from '@/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import dynamic from 'next/dynamic';
import { FormSkeleton } from '../skeleton';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormErrors } from '@/hooks';
import { useToast } from '@/components/ui/use-toast';
import { useCreatePlanModalityActivitySchoolProof } from '@/hooks/queries/use-plan-modality-activity-school-proofs-queries';
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
import { Icons } from '@/components/icons';
import { PlanModalityActivitySchoolProofCreateBodySchema } from '@/schemas/plan-modality-activity-school-proof';
import { Button } from '@/components/ui/button';

const FormFiles = dynamic(() => import('./proof-form-files'));
const FormChildren = dynamic(() => import('./proof-form-children'), {
  loading: FormSkeleton,
});

export function ProofFormSheet({
  activity,
  opened,
  onOpened,
}: {
  activity: Activity | undefined;
  opened: boolean;
  onOpened(opened: boolean): void;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.activity.proof);

  const { toast } = useToast();

  const { onSubmitError } = useFormErrors();

  const [openedUnsavedChangesDialog, setOpenedUnsavedChangesDialog] = React.useState(false);

  const formRef = React.useRef<HTMLFormElement>(null);

  const form = useForm<ActivityProofFormValues>({
    resolver: zodResolver(PlanModalityActivitySchoolProofCreateBodySchema.shape.data),
    values: React.useMemo(() => {
      return {
        note: '',
        planModalityActivitySchoolId: activity?.id ?? 0,
        planModalityActivitySchoolProofChildAttendance: [],
        planModalityActivitySchoolProofFiles: [],
        planModalityActivitySchoolProofFilesId:
          activity?.planModalityActivity?.planModalityActivityProofFiles?.map(
            (file) => file.proofFileClassificationId
          ) ?? [],
      };
    }, [activity]),
  });

  const handleOnOpenChange = React.useCallback(
    (opened: boolean) => {
      if (!opened && form.formState.isDirty) {
        return setOpenedUnsavedChangesDialog(true);
      }
      onOpened(opened);
    },
    [onOpened, form.formState.isDirty]
  );

  const handleDiscardChanges = React.useCallback(() => {
    form.reset();
    setOpenedUnsavedChangesDialog(false);
    onOpened(false);
  }, [form, onOpened, setOpenedUnsavedChangesDialog]);

  const handleSaveChanges = React.useCallback(() => {
    formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  }, []);

  const { mutateAsync: create, isLoading: isCreating } = useCreatePlanModalityActivitySchoolProof({
    onSuccess: () => {
      form.reset();
      onOpened(false);
    },
  });

  const isLoading = React.useMemo(() => isCreating, [isCreating]);

  const onSubmit = React.useCallback(
    async (data: ActivityProofFormValues) => {
      if (data.planModalityActivitySchoolProofChildAttendance?.length === 0) {
        return toast({
          variant: 'destructive',
          description: 'adicione la lista de asistencia.',
        });
      }
      await create({ body: { ...data } });
    },
    [create, toast]
  );

  const tabNames = React.useMemo(
    () => Object.values(dictionary.tabs) as [string, string, string],
    [dictionary.tabs]
  );
  const tabs = React.useMemo(
    () =>
      new Map<
        string,
        { component: React.ComponentType<{ activity?: Activity; onOpened(opened: boolean): void }> }
      >([
        [tabNames[0], { component: FormFiles }],
        [tabNames[1], { component: FormChildren }],
      ]),
    [tabNames]
  );
  const [tab, setTab] = React.useState<string>(tabNames[0]);
  const renderTabContent = React.useCallback(() => {
    const Component = tabs.get(tab)?.component ?? FormSkeleton;
    return <Component activity={activity} onOpened={onOpened} />;
  }, [tab, tabs, activity, onOpened]);

  return (
    <>
      <Sheet open={opened} onOpenChange={handleOnOpenChange}>
        <SheetContent className="w-full overflow-y-scroll sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>
              <div>{dictionary.headings}</div>
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
                <TabsList className="grid w-fit grid-cols-2">
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
                </TabsContent>
              </Tabs>
              <Button type="submit" disabled={isLoading} className="ml-auto flex">
                {isLoading && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
                {dictionary.buttons.save}
              </Button>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
      {/* Alert inventoryTransaction of unsaved changes */}
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
            <AlertDialogAction disabled={isLoading} onClick={handleSaveChanges}>
              {isLoading && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
              {dictionary.dialogs.unsaved.buttons.save}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
