'use client';

import type { Plan, PlanModalityActivityFormValues } from './@types';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

import { useGetModalities } from '@/hooks/queries/use-modality-queries';
import { useGetServicesAipi } from '@/hooks/queries/use-service-aipi-queries';
import { useStoreContext } from '@/store';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';
import { useFormContext } from 'react-hook-form';

export default function PlanModalityActivityFormInfo({ plan }: { plan?: Plan }) {
  const dictionary = useStoreContext((state) => state.dictionary.planModalityActivity.form);

  // skip if there's not plan
  const { data: modalities } = useGetModalities({
    where: { programId: plan?.programId },
    limit: 100,
  });

  const { data: servicesAipi } = useGetServicesAipi();

  const form = useFormContext<PlanModalityActivityFormValues>();

  return (
    <div className="my-2 space-y-2">
      <div className="py-4">
        <h3 className="text-lg font-medium">{dictionary.info.heading}</h3>
        <p className="text-sm text-muted-foreground">{dictionary.info.description}</p>
      </div>
      <Separator />
      <FormField
        control={form.control}
        name="planModalityId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dictionary.info.planModalityField.label}</FormLabel>
            <FormDescription className="!mt-0">
              {dictionary.info.planModalityField.description}
            </FormDescription>
            <Select
              defaultValue={field.value?.toString()}
              onValueChange={(v) => {
                form.setValue('planModalityId', parseInt(v));
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={dictionary.info.planModalityField.placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {modalities?.body.data.map((modality) => (
                  <SelectItem key={modality.id} value={modality.id.toString()}>
                    {modality?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="name"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dictionary.info.nameField.label}</FormLabel>
            <FormControl>
              <Input placeholder={dictionary.info.nameField.placeholder} {...field} />
            </FormControl>
            <FormDescription>{dictionary.info.nameField.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="description"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dictionary.info.descriptionField.label}</FormLabel>
            <FormControl>
              <Textarea
                className="resize-none"
                placeholder={dictionary.info.descriptionField.placeholder}
                {...field}
              />
            </FormControl>
            <FormDescription>{dictionary.info.descriptionField.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="requiredProofOfCompletionCount"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dictionary.info.requiredProofOfCompletionCountField.label}</FormLabel>
            <FormControl>
              <Input
                placeholder={dictionary.info.requiredProofOfCompletionCountField.placeholder}
                {...field}
              />
            </FormControl>
            <FormDescription>
              {dictionary.info.requiredProofOfCompletionCountField.description}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="serviceAipiId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dictionary.info.serviceAipiField.label}</FormLabel>
            <FormDescription className="!mt-0">
              {dictionary.info.serviceAipiField.description}
            </FormDescription>
            <Select
              defaultValue={field.value?.toString()}
              onValueChange={(v) => {
                form.setValue('serviceAipiId', parseInt(v));
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={dictionary.info.serviceAipiField.placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {servicesAipi?.body.data.map((service) => (
                  <SelectItem key={service.id} value={service.id.toString()}>
                    {service?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="startDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>{dictionary.info.startDateField.label}</FormLabel>
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
                      <span>{dictionary.info.startDateField.placeholder}</span>
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
            <FormDescription>{dictionary.info.startDateField.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="endDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>{dictionary.info.endDateField.label}</FormLabel>
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
                      <span>{dictionary.info.endDateField.placeholder}</span>
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
            <FormDescription>{dictionary.info.endDateField.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
