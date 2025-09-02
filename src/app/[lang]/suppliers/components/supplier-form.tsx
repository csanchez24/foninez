'use client';

import type { Supplier, SupplierFormValues } from './@types';

import { SupplierCreateBodySchema } from '@/schemas/supplier';

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
import { SupplierFormInfo } from './supplier-form-info';

import { useToast } from '@/components/ui/use-toast';
import { useFormErrors } from '@/hooks';
import { useCreateSupplier, useUpdateSupplier } from '@/hooks/queries/use-supplier-queries';
import { usePermissions } from '@/hooks/use-permissions';
import { useStoreContext } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';

export function SupplierFormSheet({
  supplier,
  opened,
  onOpened,
}: {
  supplier: Supplier | undefined;
  opened: boolean;
  onOpened(opened: boolean): void;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.supplier.form);

  const { getPermission } = usePermissions({ include: ['manage:supplier'] });

  const { toast } = useToast();

  const { onSubmitError } = useFormErrors();

  const [openedUnsavedChangesDialog, setOpenedUnsavedChangesDialog] = React.useState(false);

  // Ref allows to dynamically submit form within alert dialog when there're unsaved changes.
  const formRef = React.useRef<HTMLFormElement>(null);

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(SupplierCreateBodySchema.shape.data),
    values: React.useMemo(() => {
      return {
        name: supplier?.name ?? '',
      };
    }, [supplier]),
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

  const { mutateAsync: create, isLoading: isCreatingSupplier } = useCreateSupplier({
    onSuccess: () => {
      form.reset();
      onOpened(false);
    },
  });

  const { mutateAsync: update, isLoading: isUpadingSupplier } = useUpdateSupplier({
    onSuccess: () => {
      form.reset();
      setOpenedUnsavedChangesDialog(false);
      onOpened(false);
    },
    // Close alert dialog, but don't reset form as we might want the Supplier
    // to preserve the data, fix issue and re-submit.
    onError: () => {
      setOpenedUnsavedChangesDialog(false);
    },
  });

  const isLoading = useMemo(
    () => isCreatingSupplier || isUpadingSupplier,
    [isCreatingSupplier, isUpadingSupplier]
  );

  const isUpdate = useMemo(() => !!supplier, [supplier]);

  const onSubmit = useCallback(
    async (data: SupplierFormValues) => {
      if (!getPermission(['create:supplier', 'update:supplier']).granted) {
        return toast({
          variant: 'destructive',
          description: 'You do not have permission to create/update supplier.',
        });
      }

      if (supplier && isUpdate) {
        return update({ params: { id: supplier.id }, body: { data } });
      }

      create({ body: { data: data as Required<typeof data> } });
    },
    [supplier, create, update, isUpdate, getPermission, toast]
  );

  return (
    <>
      <Sheet open={opened} onOpenChange={handleOnOpenChange}>
        <SheetContent className="w-full overflow-y-scroll sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>
              {supplier ? (
                <div>
                  {dictionary.headings.update}{' '}
                  <span className="text-muted-foreground">[ Id:{supplier?.id} ]</span>
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
              <SupplierFormInfo />
              {getPermission(['create:supplier', 'update:supplier']).granted && (
                <Button type="submit" disabled={isLoading} className="ml-auto flex">
                  {isLoading && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
                  {dictionary.buttons.save}
                </Button>
              )}
            </form>
          </Form>
        </SheetContent>
      </Sheet>

      {/* Alert supplier of unsaved changes */}
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
            <AlertDialogAction disabled={isUpadingSupplier} onClick={handleSaveChanges}>
              {isUpadingSupplier && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
              {dictionary.dialogs.unsaved.buttons.save}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
