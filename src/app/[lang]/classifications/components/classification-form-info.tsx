import type { ProofFileClassificationFormValues } from './@types';

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

export default function ProofFileClassificationFormInfo() {
  const dictionary = useStoreContext((state) => state.dictionary.proofFileClassification.form.info);

  const form = useFormContext<ProofFileClassificationFormValues>();

  return (
    <div className="my-2 space-y-2">
      <div className="py-4">
        <h3 className="text-lg font-medium">{dictionary.heading}</h3>
        <p className="text-sm text-muted-foreground">{dictionary.description}</p>
      </div>
      <Separator />
      <FormField
        name="name"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dictionary.nameField.label}</FormLabel>
            <FormControl>
              <Input placeholder={dictionary.nameField.placeholder} {...field} />
            </FormControl>
            <FormDescription>{dictionary.nameField.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
