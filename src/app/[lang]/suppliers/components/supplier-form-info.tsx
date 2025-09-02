import type { SupplierFormValues } from './@types';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

import { useStoreContext } from '@/store';
import { useFormContext } from 'react-hook-form';

export function SupplierFormInfo() {
  const dictionary = useStoreContext((state) => state.dictionary.supplier.form.info);

  const form = useFormContext<SupplierFormValues>();

  return (
    <div className="my-6 space-y-2">
      <div>
        <h3 className="text-lg font-medium">{dictionary.heading}</h3>
        <p className="text-sm text-muted-foreground">{dictionary.description}</p>
      </div>
      <Separator />
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
    </div>
  );
}
