import { Button } from '@/components/ui/button';
import type { GuardianFormValues } from './@types';

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
import { useGetIdentifications } from '@/hooks/queries/use-identification-queries';

import { useStoreContext } from '@/store';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Icons } from '@/components/icons';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/utils/cn';

export function GuardianFormInfo() {
  const dictionary = useStoreContext((state) => state.dictionary.guardian.form.info);

  const form = useFormContext<GuardianFormValues>();

  const { data: identifications } = useGetIdentifications();

  const [opened, setOpened] = useState(false);

  return (
    <div className="my-6 space-y-2">
      <div>
        <h3 className="text-lg font-medium">{dictionary.heading}</h3>
        <p className="text-sm text-muted-foreground">{dictionary.description}</p>
      </div>
      <Separator />
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
    </div>
  );
}
