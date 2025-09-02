'use client';

import type { Activity, ConfirmResourcesFormValues } from './@types';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import * as React from 'react';

import { useFormErrors } from '@/hooks';
import { useStoreContext } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useUpdateMassPlanModalityActivitySchoolResource } from '@/hooks/queries/use-plan-modality-activity-school-resources-queries';
import { PlanModalityActivitySchoolResourceUpdateMassBodySchema } from '@/schemas/plan-modality-activity-school-resource';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  getPlanModalityActivitySchoolsQueryKey,
  useUpdatePlanModalityActivitySchool,
} from '@/hooks/queries/use-plan-modality-activity-school-queries';
import { useQueryClient } from '@tanstack/react-query';

export function ActivityCompleteFormSheet({
  activity,
  opened,
  onOpened,
}: {
  activity: Activity | undefined;
  opened: boolean;
  onOpened(opened: boolean): void;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.activity.formComplete);
  const queryClient = useQueryClient();

  const { onSubmitError } = useFormErrors();

  const form = useForm<ConfirmResourcesFormValues>({
    resolver: zodResolver(PlanModalityActivitySchoolResourceUpdateMassBodySchema),
    values: React.useMemo(() => {
      return {
        data: activity?.planModalityActivitySchoolsResources ?? [],
      };
    }, [activity]),
  });

  const { fields, replace } = useFieldArray({
    name: 'data',
    control: form.control,
  });

  const handleOnOpenChange = React.useCallback(
    (opened: boolean) => {
      onOpened(opened);
    },
    [onOpened]
  );

  const { mutateAsync: updateActivity } = useUpdatePlanModalityActivitySchool();

  const { mutateAsync: update, isLoading: isUpdating } =
    useUpdateMassPlanModalityActivitySchoolResource({
      onSuccess: () => {
        form.reset();
        const q = getPlanModalityActivitySchoolsQueryKey();
        queryClient.invalidateQueries({
          queryKey: [q[0], q[1]],
        });
        onOpened(false);
      },
    });

  const isLoading = useMemo(() => isUpdating, [isUpdating]);

  const onSubmit = useCallback(
    async (data: ConfirmResourcesFormValues) => {
      await update({
        body: {
          data: data.data,
        },
      });
      await updateActivity({
        params: {
          id: activity?.id ?? 0,
        },
        body: {
          data: {
            status: 'completed',
          },
          options: {
            updateStatuses: true,
          },
        },
      });
    },
    [update, updateActivity, activity]
  );

  const usedAllResources = () => {
    replace(
      activity?.planModalityActivitySchoolsResources?.map((p) => {
        return {
          ...p,
          note: p.note ?? undefined,
          resourcesUsedQty: p.resourcesReceivedQty,
        };
      }) ?? []
    );
  };

  return (
    <>
      <Sheet open={opened} onOpenChange={handleOnOpenChange}>
        <SheetContent className="w-full overflow-y-scroll sm:max-w-2xl">
          <SheetHeader className="mb-4">
            <SheetTitle>
              <div>{dictionary.headings}</div>
            </SheetTitle>
            <div className="flex items-center justify-between">
              <SheetDescription>{dictionary.description}</SheetDescription>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="default" disabled={isLoading}>
                    {isLoading && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
                    {dictionary.confirmModal.buttons.action}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{dictionary.confirmModal.title}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {dictionary.confirmModal.description}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{dictionary.confirmModal.buttons.cancel}</AlertDialogCancel>
                    <AlertDialogAction onClick={usedAllResources}>
                      {dictionary.confirmModal.buttons.confirm}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </SheetHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onSubmitError)} className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="rounded-lg border px-3 py-2">
                  <div className="flex items-center justify-between">
                    <div>
                      {activity?.planModalityActivitySchoolsResources?.find(
                        (sp) =>
                          sp.planModalityActivityResourceId === field.planModalityActivityResourceId
                      )?.planModalityActivityResource?.resource?.name ?? ''}
                      <p>
                        {dictionary.info.qtyReceived}: {field.resourcesReceivedQty}
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name={`data.${index}.resourcesUsedQty`}
                      render={({ field: mfield }) => (
                        <FormItem className="w-24">
                          <FormLabel>{dictionary.info.qtyField.label}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              max={field.resourcesReceivedQty}
                              {...mfield}
                              onChange={(e) => {
                                if (
                                  e.target.value &&
                                  parseInt(e.target.value) > field.resourcesReceivedQty
                                )
                                  return;
                                mfield.onChange(parseInt(e.target.value));
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name={`data.${index}.note`}
                      render={({ field: mfield }) => (
                        <FormItem className="">
                          <FormLabel>{dictionary.info.noteField.label}</FormLabel>
                          <FormControl>
                            <Input {...mfield} value={mfield.value ?? ''} className="w-full" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
              <Button type="submit" disabled={isLoading} className="ml-auto flex">
                {isLoading && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
                {dictionary.buttons.confirm}
              </Button>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
}
