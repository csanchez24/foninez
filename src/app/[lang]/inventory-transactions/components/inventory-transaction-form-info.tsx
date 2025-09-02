import type { InventoryTransaction, InventoryTransactionFormValues } from './@types';

import {
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
import { Textarea } from '@/components/ui/textarea';

import { useStoreContext } from '@/store';
import { useFormContext } from 'react-hook-form';

export default function InventoryTransactionFormInfo({
  inventoryTransaction: _,
}: {
  inventoryTransaction?: InventoryTransaction;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.inventoryTransaction.form.info);
  const dictionaryStatuses = useStoreContext(
    (state) => state.dictionary.inventoryTransaction.table.columns.status.values
  );
  const dictionaryTypes = useStoreContext(
    (state) => state.dictionary.inventoryTransaction.table.columns.type.values
  );
  const form = useFormContext<InventoryTransactionFormValues>();

  return (
    <div className="my-6 space-y-2">
      <div>
        <h3 className="text-lg font-medium">{dictionary.heading}</h3>
        <p className="text-sm text-muted-foreground">{dictionary.description}</p>
      </div>
      <Separator />
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dictionary.type.label}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={dictionary.type.placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {dictionaryTypes.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>{dictionary.type.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="orderNumber"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dictionary.orderNumber.label}</FormLabel>
            <FormControl>
              <Input placeholder={dictionary.orderNumber.placeholder} {...field} />
            </FormControl>
            <FormDescription>{dictionary.orderNumber.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="supplierInvoiceNumber"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dictionary.supplierInvoiceNumber.label}</FormLabel>
            <FormControl>
              <Input
                placeholder={dictionary.supplierInvoiceNumber.placeholder}
                {...field}
                disabled
              />
            </FormControl>
            <FormDescription>{dictionary.supplierInvoiceNumber.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="note"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dictionary.note.label}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={dictionary.note.placeholder}
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormDescription>{dictionary.note.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dictionary.status.label}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={dictionary.status.placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {dictionaryStatuses.map((status) => (
                  <SelectItem
                    key={status.value}
                    value={status.value}
                    disabled={status.value !== 'pending'}
                  >
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>{dictionary.status.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
