'use client';

import type { ProofFileClassification, ProofFileClassificationFormValues } from './@types';

import { ProofFileClassificationCreateBodySchema } from '@/schemas/proof-file-classification';

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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import * as React from 'react';

import { useToast } from '@/components/ui/use-toast';
import { useFormErrors } from '@/hooks';
import {
  useCreateProofFileClassification,
  useUpdateProofFileClassification,
} from '@/hooks/queries/use-proof-file-classification-queries';
import { usePermissions } from '@/hooks/use-permissions';
import { useStoreContext } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';

export function ProofFileClassificationFormSheet({
  proofFileClassification,
  opened,
  onOpened,
}: {
  proofFileClassification: ProofFileClassification | undefined;
  opened: boolean;
  onOpened(opened: boolean): void;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.proofFileClassification.form);

  const { getPermission } = usePermissions({ include: ['manage:proofFileClassification'] });

  const { toast } = useToast();

  const { onSubmitError } = useFormErrors();

  const [openedUnsavedChangesDialog, setOpenedUnsavedChangesDialog] = React.useState(false);

  // Ref allows to dynamically submit form within alert dialog when there're unsaved changes.
  const formRef = React.useRef<HTMLFormElement>(null);

  const form = useForm<ProofFileClassificationFormValues>({
    resolver: zodResolver(ProofFileClassificationCreateBodySchema.shape.data),
    values: React.useMemo(() => {
      return {
        name: proofFileClassification?.name ?? '',
      };
    }, [proofFileClassification]),
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

  const { mutateAsync: create, isLoading: isCreatingProofFileClassification } =
    useCreateProofFileClassification({
      onSuccess: () => {
        form.reset();
        onOpened(false);
      },
    });

  const { mutateAsync: update, isLoading: isUpadingProofFileClassification } =
    useUpdateProofFileClassification({
      onSuccess: () => {
        form.reset();
        setOpenedUnsavedChangesDialog(false);
        onOpened(false);
      },
      // Close alert dialog, but don't reset form as we might want the classification
      // to preserve the data, fix issue and re-submit.
      onError: () => {
        setOpenedUnsavedChangesDialog(false);
      },
    });

  const isLoading = useMemo(
    () => isCreatingProofFileClassification || isUpadingProofFileClassification,
    [isCreatingProofFileClassification, isUpadingProofFileClassification]
  );

  const isUpdate = useMemo(() => !!proofFileClassification, [proofFileClassification]);

  const onSubmit = useCallback(
    async (data: ProofFileClassificationFormValues) => {
      if (
        !getPermission(['create:proofFileClassification', 'update:proofFileClassification']).granted
      ) {
        return toast({
          variant: 'destructive',
          description: 'You do not have permission to create/update classification.',
        });
      }

      if (proofFileClassification && isUpdate) {
        return update({ params: { id: proofFileClassification.id }, body: { data } });
      }

      return create({ body: { data: data as Required<typeof data> } });
    },
    [proofFileClassification, isUpdate, getPermission, toast, create, update]
  );

  return (
    <>
      <Sheet open={opened} onOpenChange={handleOnOpenChange}>
        <SheetContent className="w-full overflow-y-scroll sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>
              {proofFileClassification ? (
                <div>
                  {dictionary.headings.update}{' '}
                  <span className="text-muted-foreground">
                    [ Id:{proofFileClassification?.id} ]
                  </span>
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
              <div className="my-2 space-y-2">
                <div className="py-4">
                  <h3 className="text-lg font-medium">{dictionary.info.heading}</h3>
                  <p className="text-sm text-muted-foreground">{dictionary.info.description}</p>
                </div>
                <Separator />
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.info.nameField.label}</FormLabel>
                      <FormControl>
                        <Input placeholder={dictionary.info.nameField.placeholder} {...field} />
                      </FormControl>
                      <FormDescription>{dictionary.info.nameField.description}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {getPermission(['create:proofFileClassification', 'update:proofFileClassification'])
                .granted && (
                <Button type="submit" disabled={isLoading} className="ml-auto flex">
                  {isLoading && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
                  {dictionary.buttons.save}
                </Button>
              )}
            </form>
          </Form>
        </SheetContent>
      </Sheet>

      {/* Alert classification of unsaved changes */}
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
              disabled={isUpadingProofFileClassification}
              onClick={handleSaveChanges}
            >
              {isUpadingProofFileClassification && (
                <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {dictionary.dialogs.unsaved.buttons.save}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
