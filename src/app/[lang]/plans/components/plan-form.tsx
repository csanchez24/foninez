'use client';

import type { Plan, PlanFormValues } from './@types';

import { PlanCreateBodySchema } from '@/schemas/plan';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { useCreatePlan, useUpdatePlan } from '@/hooks/queries/use-plan-queries';
import { useGetPrograms } from '@/hooks/queries/use-program-queries';
import { usePermissions } from '@/hooks/use-permissions';
import { useStoreContext } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';

export function PlanFormSheet({
  plan,
  opened,
  onOpened,
}: {
  plan: Plan | undefined;
  opened: boolean;
  onOpened(opened: boolean): void;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.plan.form);

  const { data: programs } = useGetPrograms({ limit: 100 });

  const { getPermission } = usePermissions({ include: ['manage:plan'] });

  const { toast } = useToast();

  const { onSubmitError } = useFormErrors();

  const [openedUnsavedChangesDialog, setOpenedUnsavedChangesDialog] = React.useState(false);

  // Ref allows to dynamically submit form within alert dialog when there're unsaved changes.
  const formRef = React.useRef<HTMLFormElement>(null);

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(PlanCreateBodySchema.shape.data),
    values: React.useMemo(() => {
      return {
        year: plan?.year ?? new Date().getFullYear(),
        longTermObjective: plan?.longTermObjective ?? '',
        shortTermObjective: plan?.shortTermObjective ?? '',
        justification: plan?.justification ?? '',
        description: plan?.description ?? '',
        status: plan?.status ?? 'draft',
        programId: plan?.programId,
        schools: [],
        resources: [],
      };
    }, [plan]),
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

  const { mutateAsync: create, isLoading: isCreatingPlan } = useCreatePlan({
    onSuccess: () => {
      form.reset();
      onOpened(false);
    },
  });

  const { mutateAsync: update, isLoading: isUpadingPlan } = useUpdatePlan({
    onSuccess: () => {
      form.reset();
      setOpenedUnsavedChangesDialog(false);
      onOpened(false);
    },
    // Close alert dialog, but don't reset form as we might want the plan
    // to preserve the data, fix issue and re-submit.
    onError: () => {
      setOpenedUnsavedChangesDialog(false);
    },
  });

  const isLoading = useMemo(() => isCreatingPlan || isUpadingPlan, [isCreatingPlan, isUpadingPlan]);

  const isUpdate = useMemo(() => !!plan, [plan]);

  const onSubmit = useCallback(
    async (data: PlanFormValues) => {
      if (!getPermission(['create:plan', 'update:plan']).granted) {
        return toast({
          variant: 'destructive',
          description: 'You do not have permission to create/update plan.',
        });
      }

      if (plan && isUpdate) {
        return update({ params: { id: plan.id }, body: { data } });
      }

      if (!data.programId) {
        return toast({
          variant: 'destructive',
          description: '`program id` is required when creating a new plan.',
        });
      }

      return create({ body: { data: data as Required<typeof data> } });
    },
    [plan, isUpdate, getPermission, toast, create, update]
  );

  return (
    <>
      <Sheet open={opened} onOpenChange={handleOnOpenChange}>
        <SheetContent className="w-full overflow-y-scroll sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>
              {plan ? (
                <div>
                  {dictionary.headings.update}{' '}
                  <span className="text-muted-foreground">[ Id:{plan?.id} ]</span>
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
                  control={form.control}
                  name="programId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.info.programField.label}</FormLabel>
                      <Select
                        defaultValue={field.value?.toString()}
                        onValueChange={(v) => {
                          form.setValue('programId', parseInt(v));
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={dictionary.info.programField.placeholder} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {programs?.body?.data.map((program) => (
                            <SelectItem key={program.id} value={program.id.toString()}>
                              {program.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>{dictionary.info.programField.description}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="year"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.info.yearField.label}</FormLabel>
                      <FormControl>
                        <Input placeholder={dictionary.info.yearField.placeholder} {...field} />
                      </FormControl>
                      <FormDescription>{dictionary.info.yearField.description}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="longTermObjective"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.info.longTermObjectiveField.label}</FormLabel>
                      <FormControl>
                        <Textarea
                          className="resize-none"
                          placeholder={dictionary.info.longTermObjectiveField.placeholder}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {dictionary.info.longTermObjectiveField.description}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="shortTermObjective"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.info.shortTermObjectiveField.label}</FormLabel>
                      <FormControl>
                        <Textarea
                          className="resize-none"
                          placeholder={dictionary.info.shortTermObjectiveField.placeholder}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {dictionary.info.shortTermObjectiveField.description}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="justification"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.info.justificationField.label}</FormLabel>
                      <FormControl>
                        <Textarea
                          className="resize-none"
                          placeholder={dictionary.info.justificationField.placeholder}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {dictionary.info.justificationField.description}
                      </FormDescription>
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
                  name="rejectionNote"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.info.rejectionNoteField.label}</FormLabel>
                      <FormControl>
                        <Textarea
                          className="resize-none"
                          placeholder={dictionary.info.rejectionNoteField.placeholder}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {dictionary.info.rejectionNoteField.description}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {getPermission(['create:plan', 'update:plan']).granted && (
                <Button type="submit" disabled={isLoading} className="ml-auto flex">
                  {isLoading && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
                  {dictionary.buttons.save}
                </Button>
              )}
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
            <AlertDialogAction disabled={isUpadingPlan} onClick={handleSaveChanges}>
              {isUpadingPlan && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
              {dictionary.dialogs.unsaved.buttons.save}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
