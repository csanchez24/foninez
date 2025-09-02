import type { ResourceClassification, ResourceClassificationFormValues } from './@types';

import { ResourceClassificationCreateBodySchema } from '@/schemas/resource-classification';

import { Icons } from '@/components/icons';
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
import * as React from 'react';

import { useFormErrors } from '@/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  useCreateResourceClassification,
  useUpdateResourceClassification,
} from '@/hooks/queries/use-resource-classification-queries';
import { useStoreContext } from '@/store';

/**
 * This is the form that gets triggered when clicking the `add more` button under the
 * resourceClassifications select dropdown found in the form-info component. I moved it out
 * here as the goal is to trigger it from within the root component instead of the
 * form-info component in order to avoid nesting form within form.
 */
export function ResourceClassificationsForm({
  resourceClassification,
  onSucces,
  onError,
  onCancel,
}: {
  resourceClassification?: ResourceClassification;
  onSucces?(): void;
  onError?(): void;
  onCancel?(): void;
}) {
  const dictionary = useStoreContext(
    (state) => state.dictionary.resource.form.resourceClassification
  );

  const { onSubmitError } = useFormErrors();

  const form = useForm<ResourceClassificationFormValues>({
    resolver: zodResolver(ResourceClassificationCreateBodySchema.shape.data),
    values: React.useMemo(() => {
      return {
        name: resourceClassification?.name ?? '',
      };
    }, [resourceClassification]),
  });

  const { mutateAsync: create, isLoading: isCreatingResourceClassification } =
    useCreateResourceClassification({
      onSuccess: () => {
        form.reset();
        onSucces?.();
      },
    });

  const { mutateAsync: update, isLoading: isUpadingResourceClassification } =
    useUpdateResourceClassification({
      onSuccess: () => {
        form.reset();
        onSucces?.();
      },
      onError: () => {
        onError?.();
      },
    });

  const isLoading = React.useMemo(
    () => isCreatingResourceClassification || isUpadingResourceClassification,
    [isCreatingResourceClassification, isUpadingResourceClassification]
  );

  const isUpdate = React.useMemo(() => !!resourceClassification, [resourceClassification]);

  const onSubmit = React.useCallback(
    async (data: ResourceClassificationFormValues) => {
      if (resourceClassification && isUpdate) {
        await update({ params: { id: resourceClassification.id }, body: { data } });
      } else {
        await create({ body: { data } });
      }
    },
    [resourceClassification, create, update, isUpdate]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onSubmitError)} className="space-y-4">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.name.label}</FormLabel>
              <FormControl>
                <Input placeholder={dictionary.name.placeholder} {...field} />
              </FormControl>
              <FormDescription>{dictionary.name.description}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            className="min-w-24"
            onClick={() => {
              form.reset();
              onCancel?.();
            }}
          >
            {dictionary.buttons.cancel}
          </Button>
          <Button type="submit" className="min-w-24">
            {isLoading && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
            {dictionary.buttons.save}
          </Button>
        </div>
      </form>
    </Form>
  );
}
