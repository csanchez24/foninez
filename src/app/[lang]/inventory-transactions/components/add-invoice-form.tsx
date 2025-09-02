import type { InventoryTransaction } from './@types';

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
import { useUpdateInventoryTransaction } from '@/hooks/queries/use-inventory-transaction-queries';
import { useFormErrors } from '@/hooks';
import { useStoreContext } from '@/store';

const formSchema = z.object({
  invoiceNumber: z.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;

const FormInvoice = () => {
  const dictionary = useStoreContext((state) => state.dictionary.inventoryTransaction.addInvoice);

  const form = useFormContext<FormValues>();

  return (
    <div className="my-6 space-y-2">
      <div>
        <h3 className="text-lg font-medium">{dictionary.title}</h3>
        <p className="text-base">{dictionary.content}</p>
      </div>
      <Separator />
      <FormField
        name="invoiceNumber"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dictionary.invoiceNumber}</FormLabel>
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

export function InvoiceForm({
  inventoryTransaction,
  onSuccess,
}: {
  inventoryTransaction: InventoryTransaction | undefined;
  onSuccess?(): void;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.inventoryTransaction.addInvoice);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    values: useMemo(() => {
      return {
        invoiceNumber: inventoryTransaction?.supplierInvoiceNumber ?? '',
      };
    }, [inventoryTransaction]),
  });

  const { mutateAsync: update, isLoading } = useUpdateInventoryTransaction({
    onSuccess: () => {
      form.reset();
      onSuccess?.();
    },
  });

  const onSubmit = useCallback(
    async (data: FormValues) => {
      await update({
        params: { id: inventoryTransaction!.id },
        body: {
          data: {
            supplierInvoiceNumber: data.invoiceNumber,
          },
        },
      });
    },
    [inventoryTransaction, update]
  );

  const { onSubmitError } = useFormErrors();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onSubmitError)} className="space-y-4">
        <FormInvoice />
        <Button disabled={isLoading} className="ml-auto flex">
          {isLoading && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
          {dictionary.button}
        </Button>
      </form>
    </Form>
  );
}
