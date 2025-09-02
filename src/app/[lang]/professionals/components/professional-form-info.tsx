import { Button } from '@/components/ui/button';
import type { ProfessionalFormValues } from './@types';

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

import { useStoreContext } from '@/store';
import { useFormContext } from 'react-hook-form';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Icons } from '@/components/icons';
import { cn } from '@/utils/cn';
import { useState } from 'react';
import { useGetIdentifications } from '@/hooks/queries/use-identification-queries';
import { Switch } from '@/components/ui/switch';

export function ProfessionalFormInfo() {
  const dictionary = useStoreContext((state) => state.dictionary.professional.form.info);

  const { data: identifications } = useGetIdentifications();
  const form = useFormContext<ProfessionalFormValues>();

  const [opened, setOpened] = useState(false);

  return (
    <div className="my-6 space-y-2">
      <div>
        <h3 className="text-lg font-medium">{dictionary.heading}</h3>
        <p className="text-sm text-muted-foreground">{dictionary.description}</p>
      </div>
      <Separator />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <FormField
          name="identificationId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.identification.label}</FormLabel>
              <FormControl>
                <Popover open={opened} onOpenChange={setOpened} modal={true}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={opened}
                      className={cn(
                        'w-full justify-between capitalize',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value
                        ? identifications?.body.data.find(({ id }) => id === field.value)?.name
                        : dictionary.identification.label}
                      <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command>
                      <CommandInput placeholder={dictionary.identification.placeholder} />
                      <CommandList>
                        <CommandEmpty>{dictionary.identification.empty}</CommandEmpty>
                        <CommandGroup>
                          {identifications?.body.data.map((identification) => (
                            <CommandItem
                              key={identification.id}
                              value={identification.id.toString()}
                              keywords={[identification.name]}
                              onSelect={() => {
                                form.setValue('identificationId', identification.id);
                                setOpened(false);
                              }}
                            >
                              <div className="flex items-start">
                                <Icons.Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    field.value === identification.id ? 'opacity-100' : 'opacity-0'
                                  )}
                                />
                                <div className="flex-1">
                                  <div className="capitalize">{identification.name}</div>
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="idNum"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.idNum.label}</FormLabel>
              <FormControl>
                <Input placeholder={dictionary.idNum.placeholder} {...field} />
              </FormControl>
              <FormDescription>{dictionary.idNum.description}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <FormField
          name="firstName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.firstName.label}</FormLabel>
              <FormControl>
                <Input placeholder={dictionary.firstName.placeholder} {...field} />
              </FormControl>
              <FormDescription>{dictionary.firstName.description}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="middleName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.middleName.label}</FormLabel>
              <FormControl>
                <Input placeholder={dictionary.middleName.placeholder} {...field} />
              </FormControl>
              <FormDescription>{dictionary.middleName.description}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="lastName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.lastName.label}</FormLabel>
              <FormControl>
                <Input placeholder={dictionary.lastName.placeholder} {...field} />
              </FormControl>
              <FormDescription>{dictionary.lastName.description}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="secondLastName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.secondLastName.label}</FormLabel>
              <FormControl>
                <Input placeholder={dictionary.secondLastName.placeholder} {...field} />
              </FormControl>
              <FormDescription>{dictionary.secondLastName.description}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        name="email"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dictionary.email.label}</FormLabel>
            <FormControl>
              <Input placeholder={dictionary.email.placeholder} {...field} />
            </FormControl>
            <FormDescription>{dictionary.email.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="address"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dictionary.address.label}</FormLabel>
            <FormControl>
              <Input placeholder={dictionary.address.placeholder} {...field} />
            </FormControl>
            <FormDescription>{dictionary.address.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="phone"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dictionary.phone.label}</FormLabel>
            <FormControl>
              <Input placeholder={dictionary.phone.placeholder} {...field} />
            </FormControl>
            <FormDescription>{dictionary.phone.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="isActive"
        control={form.control}
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">{dictionary.isActive.label}</FormLabel>
              <FormDescription>{dictionary.isActive.description}</FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
