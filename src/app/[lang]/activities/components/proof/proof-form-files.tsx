import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';

import { useStoreContext } from '@/store';
import { useFormContext } from 'react-hook-form';
import type { Activity, ActivityProofFormValues } from '../@types';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function FormFiles({
  activity,
  onOpened: __,
}: {
  activity?: Activity;
  onOpened(opened: boolean): void;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.activity.proof.files);

  const form = useFormContext<ActivityProofFormValues>();

  return (
    <div className="my-6 space-y-2">
      <div>
        <h3 className="text-lg font-medium">{dictionary.heading}</h3>
        <p className="text-sm text-muted-foreground">{dictionary.description}</p>
      </div>
      <Separator />
      <FormField
        control={form.control}
        name="note"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dictionary.noteField.label}</FormLabel>
            <FormControl>
              <Textarea placeholder={dictionary.noteField.placeholder} {...field} />
            </FormControl>
            <FormDescription>{dictionary.noteField.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <p className="my-3 text-lg text-muted-foreground">{dictionary.descriptionFile}</p>
      {activity?.planModalityActivity?.planModalityActivityProofFiles?.map((file, index) => (
        <FormField
          control={form.control}
          key={`files-${file.proofFileClassificationId}`}
          name={`planModalityActivitySchoolProofFiles.${index}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{file.proofFileClassification?.name}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="file"
                  value={undefined}
                  accept="application/pdf"
                  onChange={(event) => field.onChange(event.target.files?.[0])}
                />
              </FormControl>
              <FormDescription>{dictionary.fileField.description}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  );
}
