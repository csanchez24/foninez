import type { ResourceClassification, ResourceFormValues } from './@types';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
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
import { Separator } from '@/components/ui/separator';
import * as React from 'react';

import { useGetResourceClassifications } from '@/hooks/queries/use-resource-classification-queries';
import { useStoreContext } from '@/store';
import { cn } from '@/utils/cn';
import { useFormContext } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export function ResourceFormInfo({
  onCreateResourceClassification,
  onEditResourceClassification,
  onDeleteResourceClassification,
}: {
  onCreateResourceClassification?(): void;
  onEditResourceClassification?(category: ResourceClassification): void;
  onDeleteResourceClassification?(category: ResourceClassification): void;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.resource.form.info);

  const form = useFormContext<ResourceFormValues>();

  const { data: resourceClassifications } = useGetResourceClassifications({ limit: 1000 });
  const [openedResourceClassifications, setOpenedResourceClassifications] = React.useState(false);

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
      <FormField
        name="price"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dictionary.price.label}</FormLabel>
            <FormControl>
              <Input placeholder={dictionary.price.placeholder} {...field} />
            </FormControl>
            <FormDescription>{dictionary.price.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>{dictionary.type.label}</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="internal" />
                  </FormControl>
                  <FormLabel className="font-normal">{dictionary.type.value.internal}</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="external" />
                  </FormControl>
                  <FormLabel className="font-normal">{dictionary.type.value.external}</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="usageType"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>{dictionary.usageType.label}</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="general" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    {dictionary.usageType.value.general}
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="individual" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    {dictionary.usageType.value.individual}
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="resourceClassificationId"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dictionary.classifications.label}</FormLabel>
            <FormControl>
              <Popover
                open={openedResourceClassifications}
                onOpenChange={setOpenedResourceClassifications}
                modal={true}
              >
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={openedResourceClassifications}
                    className={cn(
                      'w-full justify-between capitalize',
                      !field.value && 'text-muted-foreground'
                    )}
                  >
                    {field.value
                      ? resourceClassifications?.body.data.find(({ id }) => id === field.value)
                          ?.name
                      : dictionary.classifications.label}
                    <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                  <Command>
                    <CommandInput placeholder={dictionary.classifications.placeholder} />
                    <CommandList>
                      <CommandEmpty>{dictionary.classifications.empty}</CommandEmpty>
                      <CommandGroup>
                        {resourceClassifications?.body.data.map((resourceClassification) => (
                          <CommandItem
                            key={resourceClassification.id}
                            value={resourceClassification.id.toString()}
                            keywords={[resourceClassification.name]}
                            onSelect={() => {
                              form.setValue('resourceClassificationId', resourceClassification.id);
                              setOpenedResourceClassifications(false);
                            }}
                          >
                            <Icons.Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                field.value === resourceClassification.id
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            <span className="capitalize">{resourceClassification.name}</span>
                            <div className="ml-auto">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  onEditResourceClassification?.(resourceClassification);
                                }}
                              >
                                <Icons.Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  onDeleteResourceClassification?.(resourceClassification);
                                }}
                              >
                                <Icons.Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      <>
                        <CommandSeparator />
                        <CommandGroup>
                          <CommandItem
                            onSelect={() => onCreateResourceClassification?.()}
                            className="text-center"
                          >
                            <Icons.Add className="mr-2 h-4 w-4" />
                            {dictionary.classifications.createNew}
                          </CommandItem>
                        </CommandGroup>
                      </>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormDescription>{dictionary.classifications.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
