'use client';

import type { SchoolActivity, SchoolChild, SchoolChildFormValues } from './@types';

import { PlanModalityActivitySchoolChildCreateBodySchema } from '@/schemas/plan-modality-activity-school-child';

import { Icons } from '@/components/icons';
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
import * as React from 'react';
import { RegisterFormInfo } from './register-form-info';

import { useToast } from '@/components/ui/use-toast';
import { useFormErrors } from '@/hooks';
import {
  useCreatePlanModalityActivitySchoolChild,
  useUpdatePlanModalityActivitySchoolChild,
} from '@/hooks/queries/use-plan-modality-activity-school-children-queries';
import { usePermissions } from '@/hooks/use-permissions';
import { useStoreContext } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';

export function RegisterFormSheet({
  activity,
  schoolChild,
  opened,
  onOpened,
}: {
  activity: SchoolActivity | undefined;
  schoolChild: SchoolChild | undefined;
  opened: boolean;
  onOpened(opened: boolean): void;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.register.form);

  const { getPermission } = usePermissions({ include: ['manage:planModalityActivitySchoolChild'] });

  const { toast } = useToast();

  const { onSubmitError } = useFormErrors();

  const [openedUnsavedChangesDialog, setOpenedUnsavedChangesDialog] = React.useState(false);

  // Ref allows to dynamically submit form within alert dialog when there're unsaved changes.
  const formRef = React.useRef<HTMLFormElement>(null);

  const form = useForm<SchoolChildFormValues>({
    resolver: zodResolver(PlanModalityActivitySchoolChildCreateBodySchema.shape.data),
    values: React.useMemo(() => {
      return {
        status: schoolChild?.status ?? 'pending',
        rejectionNote: schoolChild?.rejectionNote ?? '',
        childId: schoolChild?.childId ?? 0,
        planModalityActivitySchoolId: activity?.id ?? 0,
        child: {
          identificationId: schoolChild?.child?.identificationId ?? 1,
          idNum: schoolChild?.child?.idNum ?? '',
          firstName: schoolChild?.child?.firstName ?? '',
          middleName: schoolChild?.child?.middleName ?? '',
          lastName: schoolChild?.child?.lastName ?? '',
          secondLastName: schoolChild?.child?.secondLastName ?? '',
          guardianId: schoolChild?.child?.guardianId ?? 1,
          address: schoolChild?.child?.address ?? '',
          shiftId: schoolChild?.child?.shiftId ?? 1,
          areaType: schoolChild?.child?.areaType ?? 'urban',
          genderId: schoolChild?.child?.genderId ?? 1,
          birthDate: schoolChild?.child?.birthDate ?? new Date(),
          countryId: schoolChild?.child?.countryId ?? 1,
          ethnicityId: schoolChild?.child?.ethnicityId ?? 1,
          birthCityId: schoolChild?.child?.birthCityId ?? 1,
          birthStateId: schoolChild?.child?.birthStateId ?? 1,
          cityId: schoolChild?.child?.cityId ?? 1,
          stateId: schoolChild?.child?.stateId ?? 1,
          populationId: schoolChild?.child?.populationId ?? 1,
          schoolGradeId: schoolChild?.child?.schoolGradeId ?? 1,
          educationLevelId: schoolChild?.child?.educationLevelId ?? 1,
          beneficiaryTypeId: schoolChild?.child?.beneficiaryTypeId ?? 1,
          indigenousReserveId: schoolChild?.child?.indigenousReserveId ?? 1,
          deactivationReason: schoolChild?.child?.deactivationReason ?? '',
          deactivationDate: schoolChild?.child?.deactivationDate ?? null,
          indigenousCommunityId: schoolChild?.child?.indigenousCommunityId ?? 1,
          vulnerabilityFactorId: schoolChild?.child?.vulnerabilityFactorId ?? 1,
          affiliationDate: schoolChild?.child?.affiliationDate ?? new Date(),
          kinshipId: schoolChild?.child?.kinshipId ?? 1,
        },
        guardian: {
          identificationId: schoolChild?.child?.guardian?.identificationId ?? 1,
          idNum: schoolChild?.child?.guardian?.idNum ?? '',
          firstName: schoolChild?.child?.guardian?.firstName ?? '',
          middleName: schoolChild?.child?.guardian?.middleName ?? '',
          lastName: schoolChild?.child?.guardian?.lastName ?? '',
          secondLastName: schoolChild?.child?.guardian?.secondLastName ?? '',
        },
      };
    }, [schoolChild, activity]),
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

  const { mutateAsync: create, isLoading: isCreatingSchool } =
    useCreatePlanModalityActivitySchoolChild({
      onSuccess: () => {
        form.reset();
        onOpened(false);
      },
    });

  const { mutateAsync: update, isLoading: isUpdatingSchool } =
    useUpdatePlanModalityActivitySchoolChild({
      onSuccess: () => {
        form.reset();
        setOpenedUnsavedChangesDialog(false);
        onOpened(false);
      },
      // Close alert dialog, but don't reset form as we might want the school
      // to preserve the data, fix issue and re-submit.
      onError: () => {
        setOpenedUnsavedChangesDialog(false);
      },
    });

  const isLoading = useMemo(
    () => isCreatingSchool || isUpdatingSchool,
    [isCreatingSchool, isUpdatingSchool]
  );

  const isUpdate = useMemo(() => !!schoolChild, [schoolChild]);

  const onSubmit = useCallback(
    async (data: SchoolChildFormValues) => {
      if (
        !getPermission([
          'create:planModalityActivitySchoolChild',
          'update:planModalityActivitySchoolChild',
        ]).granted
      ) {
        return toast({
          variant: 'destructive',
          description: 'You do not have permission to create/update school.',
        });
      }

      if (schoolChild && isUpdate) {
        return update({ params: { id: schoolChild.id }, body: { data } });
      }

      return create({ body: { data: data as Required<typeof data> } });
    },
    [schoolChild, create, update, isUpdate, getPermission, toast]
  );

  return (
    <>
      <Sheet open={opened} onOpenChange={handleOnOpenChange}>
        <SheetContent className="w-full overflow-y-scroll sm:max-w-5xl">
          <SheetHeader>
            <SheetTitle>
              {schoolChild ? (
                <div>
                  {dictionary.headings.update}{' '}
                  <span className="text-muted-foreground">[ Id:{schoolChild?.id} ]</span>
                </div>
              ) : (
                <div>{dictionary.headings.new}</div>
              )}
            </SheetTitle>
            <SheetDescription>{dictionary.description}</SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form
              ref={formRef}
              onSubmit={form.handleSubmit(onSubmit, onSubmitError)}
              className="space-y-4"
            >
              <RegisterFormInfo />
              {getPermission([
                'create:planModalityActivitySchoolChild',
                'update:planModalityActivitySchoolChild',
              ]).granted && (
                <Button type="submit" disabled={isLoading} className="ml-auto flex">
                  {isLoading && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
                  {dictionary.buttons.save}
                </Button>
              )}
            </form>
          </Form>
        </SheetContent>
      </Sheet>

      {/* Alert school of unsaved changes */}
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
            <AlertDialogAction disabled={isUpdatingSchool} onClick={handleSaveChanges}>
              {isUpdatingSchool && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
              {dictionary.dialogs.unsaved.buttons.save}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
