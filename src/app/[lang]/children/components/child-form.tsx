'use client';

import type { Child, ChildFormValues } from './@types';

import { ChildCreateBodySchema } from '@/schemas/child';

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
import { ChildFormInfo } from './child-form-info';

import { useToast } from '@/components/ui/use-toast';
import { useFormErrors } from '@/hooks';
import { useCreateChild, useUpdateChild } from '@/hooks/queries/use-child-queries';
import { usePermissions } from '@/hooks/use-permissions';
import { useStoreContext } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';

export function ChildFormSheet({
  child,
  opened,
  onOpened,
}: {
  child: Child | undefined;
  opened: boolean;
  onOpened(opened: boolean): void;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.child.form);

  const { getPermission } = usePermissions({ include: ['manage:child'] });

  const { toast } = useToast();

  const { onSubmitError } = useFormErrors();

  const [openedUnsavedChangesDialog, setOpenedUnsavedChangesDialog] = React.useState(false);

  // Ref allows to dynamically submit form within alert dialog when there're unsaved changes.
  const formRef = React.useRef<HTMLFormElement>(null);

  const form = useForm<ChildFormValues>({
    resolver: zodResolver(ChildCreateBodySchema.shape.data),
    values: React.useMemo(() => {
      return {
        idNum: child?.idNum ?? '',
        firstName: child?.firstName ?? '',
        middleName: child?.middleName ?? '',
        lastName: child?.lastName ?? '',
        secondLastName: child?.secondLastName ?? '',
        guardianId: child?.guardianId,
        identificationId: child?.identificationId,
        address: child?.address ?? '',
        shiftId: child?.shiftId ?? 0,
        areaType: child?.areaType ?? 'urban',
        genderId: child?.genderId ?? 0,
        birthDate: child?.birthDate ?? new Date(),
        countryId: child?.countryId ?? 0,
        birthCityId: child?.birthCityId ?? 0,
        birthStateId: child?.birthStateId ?? 0,
        cityId: child?.birthCityId ?? 0,
        stateId: child?.birthStateId ?? 0,
        ethnicityId: child?.ethnicityId ?? 0,
        populationId: child?.populationId ?? 0,
        schoolGradeId: child?.schoolGradeId ?? 0,
        educationLevelId: child?.educationLevelId ?? 0,
        beneficiaryTypeId: child?.beneficiaryTypeId ?? 0,
        indigenousReserveId: child?.indigenousReserveId ?? 0,
        deactivationReason: child?.deactivationReason ?? '',
        deactivationDate: child?.deactivationDate ?? null,
        indigenousCommunityId: child?.indigenousCommunityId ?? 0,
        vulnerabilityFactorId: child?.vulnerabilityFactorId ?? 0,
        affiliationDate: child?.affiliationDate ?? new Date(),
        kinshipId: child?.kinshipId ?? 0,
      };
    }, [child]),
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

  const { mutateAsync: create, isLoading: isCreatingChild } = useCreateChild({
    onSuccess: () => {
      form.reset();
      onOpened(false);
    },
  });

  const { mutateAsync: update, isLoading: isUpadingChild } = useUpdateChild({
    onSuccess: () => {
      form.reset();
      setOpenedUnsavedChangesDialog(false);
      onOpened(false);
    },
    // Close alert dialog, but don't reset form as we might want the child
    // to preserve the data, fix issue and re-submit.
    onError: () => {
      setOpenedUnsavedChangesDialog(false);
    },
  });

  const isLoading = useMemo(
    () => isCreatingChild || isUpadingChild,
    [isCreatingChild, isUpadingChild]
  );

  const isUpdate = useMemo(() => !!child, [child]);

  const onSubmit = useCallback(
    async (data: ChildFormValues) => {
      if (!getPermission(['create:child', 'update:child']).granted) {
        return toast({
          variant: 'destructive',
          description: 'You do not have permission to create/update child.',
        });
      }

      if (child && isUpdate) {
        return update({ params: { id: child.id }, body: { data } });
      }

      if (!(data.guardianId && data.identificationId)) {
        return toast({
          variant: 'destructive',
          description: '`guardianId` and `identificationId` are required when creating a new child',
        });
      }

      create({ body: { data: data as Required<typeof data> } });
    },
    [child, create, update, isUpdate, getPermission, toast]
  );

  return (
    <>
      <Sheet open={opened} onOpenChange={handleOnOpenChange}>
        <SheetContent className="w-full overflow-y-scroll sm:max-w-5xl">
          <SheetHeader>
            <SheetTitle>
              {child ? (
                <div>
                  {dictionary.headings.update}{' '}
                  <span className="text-muted-foreground">[ Id:{child?.id} ]</span>
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
              <ChildFormInfo />
              {getPermission(['create:child', 'update:child']).granted && (
                <Button type="submit" disabled={isLoading} className="ml-auto flex">
                  {isLoading && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
                  {dictionary.buttons.save}
                </Button>
              )}
            </form>
          </Form>
        </SheetContent>
      </Sheet>

      {/* Alert child of unsaved changes */}
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
            <AlertDialogAction disabled={isUpadingChild} onClick={handleSaveChanges}>
              {isUpadingChild && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
              {dictionary.dialogs.unsaved.buttons.save}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
