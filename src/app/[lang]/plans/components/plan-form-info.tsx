import type { PlanFormValues } from './@types';

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

export default function PlanFormInfo() {
  const dictionary = useStoreContext((state) => state.dictionary.plan.form.info);
  const dictionaryStatuses = useStoreContext(
    (state) => state.dictionary.plan.table.columns.status.values
  );

  const form = useFormContext<PlanFormValues>();

  return (
    <div className="my-2 space-y-2">
      <div className="py-4">
        <h3 className="text-lg font-medium">{dictionary.heading}</h3>
        <p className="text-sm text-muted-foreground">{dictionary.description}</p>
      </div>
      <Separator />
      <FormField
        name="year"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dictionary.yearField.label}</FormLabel>
            <FormControl>
              <Input placeholder={dictionary.yearField.placeholder} {...field} />
            </FormControl>
            <FormDescription>{dictionary.yearField.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dictionary.statusField.label}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={dictionary.statusField.placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {dictionaryStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>{dictionary.statusField.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="longTermObjective"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dictionary.longTermObjectiveField.label}</FormLabel>
            <FormControl>
              <Textarea
                className="resize-none"
                placeholder={dictionary.longTermObjectiveField.placeholder}
                {...field}
              />
            </FormControl>
            <FormDescription>{dictionary.longTermObjectiveField.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="shortTermObjective"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dictionary.shortTermObjectiveField.label}</FormLabel>
            <FormControl>
              <Textarea
                className="resize-none"
                placeholder={dictionary.shortTermObjectiveField.placeholder}
                {...field}
              />
            </FormControl>
            <FormDescription>{dictionary.shortTermObjectiveField.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="justification"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dictionary.justificationField.label}</FormLabel>
            <FormControl>
              <Textarea
                className="resize-none"
                placeholder={dictionary.justificationField.placeholder}
                {...field}
              />
            </FormControl>
            <FormDescription>{dictionary.justificationField.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="description"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dictionary.descriptionField.label}</FormLabel>
            <FormControl>
              <Textarea
                className="resize-none"
                placeholder={dictionary.descriptionField.placeholder}
                {...field}
              />
            </FormControl>
            <FormDescription>{dictionary.descriptionField.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="rejectionNote"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dictionary.rejectionNoteField.label}</FormLabel>
            <FormControl>
              <Textarea
                className="resize-none"
                placeholder={dictionary.rejectionNoteField.placeholder}
                {...field}
              />
            </FormControl>
            <FormDescription>{dictionary.rejectionNoteField.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
