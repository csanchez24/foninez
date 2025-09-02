import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';

import { useStoreContext } from '@/store';
import { useForm } from 'react-hook-form';
import type { Activity, PlanModalityActivitySchoolFormValues } from '../@types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo } from 'react';
import { useFormErrors, usePermissions } from '@/hooks';
import { useToast } from '@/components/ui/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { Icons } from '@/components/icons';

import { PlanModalityActivitySchoolCreateBodySchema } from '@/schemas/plan-modality-activity-school';
import { useUpdatePlanModalityActivitySchool } from '@/hooks/queries/use-plan-modality-activity-school-queries';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';

export default function FormMain({
  activity,
  onOpened: _,
}: {
  activity?: Activity;
  onOpened(opened: boolean): void;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.activity.planning);

  const { getPermission } = usePermissions({
    include: ['manage:planModalityActivitySchool'],
  });

  const { toast } = useToast();

  const { onSubmitError } = useFormErrors();

  const form = useForm<PlanModalityActivitySchoolFormValues>({
    resolver: zodResolver(PlanModalityActivitySchoolCreateBodySchema.shape.data),
    values: useMemo(() => {
      return {
        startDate: activity?.startDate ?? new Date(),
        endDate: activity?.endDate ?? new Date(),
        status: activity?.status ?? 'planning',
        schoolId: activity?.schoolId ?? 0,
        participantsQty: activity?.participantsQty ?? 0,
        planModalityActivityId: activity?.planModalityActivityId ?? 0,
      };
    }, [activity]),
  });

  const { mutateAsync: update, isLoading } = useUpdatePlanModalityActivitySchool({
    onSuccess: () => {
      form.reset();
      //onOpened(false);
    },
  });

  const onSubmit = useCallback(
    async (data: PlanModalityActivitySchoolFormValues) => {
      if (!activity) return;
      if (
        !getPermission(['create:planModalityActivitySchool', 'update:planModalityActivitySchool'])
          .granted
      ) {
        return toast({
          variant: 'destructive',
          description: 'You do not have permission to create/update.',
        });
      }

      await update({ params: { id: activity.id }, body: { data } });
    },
    [update, getPermission, toast, activity]
  );

  return (
    <div className="my-6 space-y-2">
      <div>
        <h3 className="text-lg font-medium">{dictionary.headings}</h3>
        <p className="text-sm text-muted-foreground">{dictionary.description}</p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onSubmitError)} className="space-y-4">
          <div className="">
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{dictionary.main.startDateField.label}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(!field.value && 'text-muted-foreground')}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>{dictionary.main.startDateField.placeholder}</span>
                            )}
                            <Icons.Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>{dictionary.main.startDateField.description}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{dictionary.main.endDateField.label}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(!field.value && 'text-muted-foreground')}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>{dictionary.main.endDateField.placeholder}</span>
                            )}
                            <Icons.Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>{dictionary.main.endDateField.description}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {getPermission('create:planModalityActivitySchool').granted && (
              <Button type="submit" disabled={isLoading} className="ml-auto flex">
                {isLoading && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
                {dictionary.main.buttons.save}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
