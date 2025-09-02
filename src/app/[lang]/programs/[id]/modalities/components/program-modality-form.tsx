'use client';

import type { Modality, Program, ProgramModalityFormValues } from './@types';

import { ModalityCreateBodySchema } from '@/schemas/modality';

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
import { Textarea } from '@/components/ui/textarea';
import * as React from 'react';

import { useToast } from '@/components/ui/use-toast';
import { useFormErrors } from '@/hooks';
import { useCreateModality, useUpdateModality } from '@/hooks/queries/use-modality-queries';
import { usePermissions } from '@/hooks/use-permissions';
import { useStoreContext } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useGetModalityTypes } from '@/hooks/queries/use-modality-type-queries';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/utils/cn';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

export function ProgramModalityFormSheet({
  program,
  modality,
  opened,
  onOpened,
}: {
  program?: Program;
  modality?: Modality;
  opened: boolean;
  onOpened(opened: boolean): void;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.modality.form);

  const { getPermission } = usePermissions({ include: ['manage:modality'] });

  const { toast } = useToast();

  const { onSubmitError } = useFormErrors();

  const [openedUnsavedChangesDialog, setOpenedUnsavedChangesDialog] = React.useState(false);

  const { data: modalityTypes } = useGetModalityTypes();
  const [openedModalityType, setOpenedModalityType] = React.useState(false);

  // Ref allows to dynamically submit form within alert dialog when there're unsaved changes.
  const formRef = React.useRef<HTMLFormElement>(null);

  const form = useForm<ProgramModalityFormValues>({
    resolver: zodResolver(ModalityCreateBodySchema.shape.data),
    values: React.useMemo(() => {
      return {
        name: modality?.name ?? '',
        description: modality?.description ?? '',
        programId: program?.id,
        modalityTypeId: modality?.modalityTypeId ?? 0,
      };
    }, [program, modality]),
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

  const { mutateAsync: create, isLoading: isCreatingModality } = useCreateModality({
    onSuccess: () => {
      form.reset();
      onOpened(false);
    },
  });

  const { mutateAsync: update, isLoading: isUpdatingModality } = useUpdateModality({
    onSuccess: () => {
      form.reset();
      setOpenedUnsavedChangesDialog(false);
      onOpened(false);
    },
    // Close alert dialog, but don't reset form as we might want the modality
    // to preserve the data, fix issue and re-submit.
    onError: () => {
      setOpenedUnsavedChangesDialog(false);
    },
  });

  const isLoading = useMemo(
    () => isCreatingModality || isUpdatingModality,
    [isCreatingModality, isUpdatingModality]
  );

  const isUpdate = useMemo(() => !!modality, [modality]);

  const onSubmit = useCallback(
    async (data: ProgramModalityFormValues) => {
      if (!getPermission(['create:modality', 'update:modality']).granted) {
        return toast({
          variant: 'destructive',
          description: 'You do not have permission to create/update modality.',
        });
      }

      if (!data.programId) {
        return toast({
          variant: 'destructive',
          description: '`program id` is required when creating a new modality.',
        });
      }

      if (modality && isUpdate) {
        return update({ params: { id: modality.id }, body: { data } });
      }

      return create({ body: { data: data as Required<typeof data> } });
    },
    [modality, isUpdate, getPermission, toast, create, update]
  );

  return (
    <>
      <Sheet open={opened} onOpenChange={handleOnOpenChange}>
        <SheetContent className="w-full overflow-y-scroll sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>
              {modality ? (
                <div>
                  {dictionary.headings.update}{' '}
                  <span className="text-muted-foreground">[ Id: {modality?.id} ]</span>
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
                <FormField
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.info.descriptionField.label}</FormLabel>
                      <FormControl>
                        <Textarea
                          className="resize-none"
                          placeholder={dictionary.info.descriptionField.placeholder}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {dictionary.info.descriptionField.description}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="modalityTypeId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.info.modalityType.label}</FormLabel>
                      <FormControl>
                        <Popover
                          open={openedModalityType}
                          onOpenChange={setOpenedModalityType}
                          modal={true}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              role="combobox"
                              aria-expanded={openedModalityType}
                              className={cn(
                                'w-full justify-between capitalize',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value
                                ? modalityTypes?.body.data.find(({ id }) => id === field.value)
                                    ?.name
                                : dictionary.info.modalityType.label}
                              <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                            <Command>
                              <CommandInput
                                placeholder={dictionary.info.modalityType.placeholder}
                              />
                              <CommandList>
                                <CommandEmpty>{dictionary.info.modalityType.empty}</CommandEmpty>
                                <CommandGroup>
                                  {modalityTypes?.body.data.map((modalityType) => (
                                    <CommandItem
                                      key={modalityType.id}
                                      value={modalityType.id.toString()}
                                      keywords={[modalityType.name]}
                                      onSelect={() => {
                                        form.setValue('modalityTypeId', modalityType.id);
                                        setOpenedModalityType(false);
                                      }}
                                    >
                                      <div className="flex items-start">
                                        <Icons.Check
                                          className={cn(
                                            'mr-2 h-4 w-4',
                                            field.value === modalityType.id
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        <div className="flex-1">
                                          <div className="capitalize">{modalityType.name}</div>
                                        </div>
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {getPermission(['create:modality', 'update:modality']).granted && (
                <Button type="submit" disabled={isLoading} className="ml-auto flex">
                  {isLoading && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
                  {dictionary.buttons.save}
                </Button>
              )}
            </form>
          </Form>
        </SheetContent>
      </Sheet>

      {/* Alert modality of unsaved changes */}
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
            <AlertDialogAction disabled={isUpdatingModality} onClick={handleSaveChanges}>
              {isUpdatingModality && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
              {dictionary.dialogs.unsaved.buttons.save}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
