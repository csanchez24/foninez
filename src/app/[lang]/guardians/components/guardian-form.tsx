'use client';

import type { Guardian, GuardianFormValues } from './@types';

import { GuardianCreateBodySchema } from '@/schemas/guardian';

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
import { GuardianFormInfo } from './guardian-form-info';

import { useToast } from '@/components/ui/use-toast';
import { useFormErrors } from '@/hooks';
import { useCreateGuardian, useUpdateGuardian } from '@/hooks/queries/use-guardian-queries';
import { usePermissions } from '@/hooks/use-permissions';
import { useStoreContext } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';

export function GuardianFormSheet({
  guardian,
  opened,
  onOpened,
}: {
  guardian: Guardian | undefined;
  opened: boolean;
  onOpened(opened: boolean): void;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.guardian.form);

  const { getPermission } = usePermissions({ include: ['manage:guardian'] });

  const { toast } = useToast();

  const { onSubmitError } = useFormErrors();

  const [openedUnsavedChangesDialog, setOpenedUnsavedChangesDialog] = React.useState(false);

  // Ref allows to dynamically submit form within alert dialog when there're unsaved changes.
  const formRef = React.useRef<HTMLFormElement>(null);

  const form = useForm<GuardianFormValues>({
    resolver: zodResolver(GuardianCreateBodySchema.shape.data),
    values: React.useMemo(() => {
      return {
        idNum: guardian?.idNum ?? '',
        firstName: guardian?.firstName ?? '',
        middleName: guardian?.middleName ?? '',
        lastName: guardian?.lastName ?? '',
        secondLastName: guardian?.secondLastName ?? '',
        identificationId: guardian?.identificationId ?? 0,
        phone: guardian?.phone ?? '',
      };
    }, [guardian]),
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

  const { mutateAsync: create, isLoading: isCreatingGuardian } = useCreateGuardian({
    onSuccess: () => {
      form.reset();
      onOpened(false);
    },
  });

  const { mutateAsync: update, isLoading: isUpadingGuardian } = useUpdateGuardian({
    onSuccess: () => {
      form.reset();
      setOpenedUnsavedChangesDialog(false);
      onOpened(false);
    },
    // Close alert dialog, but don't reset form as we might want the Guardian
    // to preserve the data, fix issue and re-submit.
    onError: () => {
      setOpenedUnsavedChangesDialog(false);
    },
  });

  const isLoading = useMemo(
    () => isCreatingGuardian || isUpadingGuardian,
    [isCreatingGuardian, isUpadingGuardian]
  );

  const isUpdate = useMemo(() => !!guardian, [guardian]);

  const onSubmit = useCallback(
    async (data: GuardianFormValues) => {
      if (!getPermission(['create:guardian', 'update:guardian']).granted) {
        return toast({
          variant: 'destructive',
          description: 'You do not have permission to create/update guardian.',
        });
      }

      if (guardian && isUpdate) {
        return update({ params: { id: guardian.id }, body: { data } });
      }

      if (!data.identificationId) {
        return toast({
          variant: 'destructive',
          description: '`identificationId` are required when creating a new guardian',
        });
      }

      create({ body: { data: data as Required<typeof data> } });
    },
    [guardian, create, update, isUpdate, getPermission, toast]
  );

  return (
    <>
      <Sheet open={opened} onOpenChange={handleOnOpenChange}>
        <SheetContent className="w-full overflow-y-scroll sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>
              {guardian ? (
                <div>
                  {dictionary.headings.update}{' '}
                  <span className="text-muted-foreground">[ Id:{guardian?.id} ]</span>
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
              <GuardianFormInfo />
              {getPermission(['create:guardian', 'update:guardian']).granted && (
                <Button type="submit" disabled={isLoading} className="ml-auto flex">
                  {isLoading && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
                  {dictionary.buttons.save}
                </Button>
              )}
            </form>
          </Form>
        </SheetContent>
      </Sheet>

      {/* Alert guardian of unsaved changes */}
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
            <AlertDialogAction disabled={isUpadingGuardian} onClick={handleSaveChanges}>
              {isUpadingGuardian && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
              {dictionary.dialogs.unsaved.buttons.save}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
