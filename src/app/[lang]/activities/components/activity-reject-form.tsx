import type { Activity } from './@types';

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
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { useFormErrors } from '@/hooks';
import { useStoreContext } from '@/store';
import { useUpdatePlanModalityActivitySchool } from '@/hooks/queries/use-plan-modality-activity-school-queries';

const formSchema = z.object({
  response: z.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;

const FormDeny = () => {
  const dictionary = useStoreContext((state) => state.dictionary.activity.formDeny);

  const form = useFormContext<FormValues>();

  return (
    <div className="my-6 space-y-2">
      <div>
        <h3 className="text-lg font-medium">{dictionary.title}</h3>
        <p className="text-base">{dictionary.content}</p>
      </div>
      <Separator />
      <FormField
        name="response"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dictionary.note}</FormLabel>
            <FormControl>
              <Textarea className="resize-none" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export function ActivityRejectForm({
  planModalityActivitySchool,
  onSuccess,
}: {
  planModalityActivitySchool: Activity | undefined;
  onSuccess?(): void;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.activity.formDeny);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    values: useMemo(() => {
      return {
        response: '',
      };
    }, []),
  });

  const { mutateAsync: update, isLoading } = useUpdatePlanModalityActivitySchool({
    onSuccess: () => {
      form.reset();
      onSuccess?.();
    },
  });

  const onSubmit = useCallback(
    async (data: FormValues) => {
      await update({
        params: { id: planModalityActivitySchool!.id },
        body: {
          data: {
            rejectionNote: data.response,
            status: 'rejected',
          },
          options: {
            updateStatuses: true,
          },
        },
      });
    },
    [planModalityActivitySchool, update]
  );

  const { onSubmitError } = useFormErrors();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onSubmitError)} className="space-y-4">
        <FormDeny />
        <Button disabled={isLoading} className="ml-auto flex">
          {isLoading && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
          {dictionary.button}
        </Button>
      </form>
    </Form>
  );
}
