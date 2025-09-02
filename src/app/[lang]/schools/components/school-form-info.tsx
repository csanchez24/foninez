import type { SchoolFormValues } from './@types';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
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

import { useGetCities } from '@/hooks/queries/use-city-queries';
import { useStoreContext } from '@/store';
import { cn } from '@/utils/cn';
import { useFormContext } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function SchoolFormInfo() {
  const dictionary = useStoreContext((state) => state.dictionary.school.form.info);

  const { data: cities } = useGetCities();

  const form = useFormContext<SchoolFormValues>();

  const [opened, setOpened] = React.useState(false);

  const dictionaryTypes = useStoreContext(
    (state) => state.dictionary.school.table.columns.areaType.values
  );

  const dictionarySectorTypes = useStoreContext(
    (state) => state.dictionary.school.table.columns.sectorType.values
  );

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
        name="infrastructureCode"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dictionary.infrastructureCode.label}</FormLabel>
            <FormControl>
              <Input placeholder={dictionary.infrastructureCode.placeholder} {...field} />
            </FormControl>
            <FormDescription>{dictionary.infrastructureCode.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="daneCode"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dictionary.daneCode.label}</FormLabel>
            <FormControl>
              <Input placeholder={dictionary.daneCode.placeholder} {...field} />
            </FormControl>
            <FormDescription>{dictionary.daneCode.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="branchCode"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dictionary.branchCode.label}</FormLabel>
            <FormControl>
              <Input placeholder={dictionary.branchCode.placeholder} {...field} />
            </FormControl>
            <FormDescription>{dictionary.branchCode.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="areaType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dictionary.areaType.label}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={dictionary.areaType.placeholder} />
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
            <FormDescription>{dictionary.areaType.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="sectorType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dictionary.sectorType.label}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={dictionary.sectorType.placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {dictionarySectorTypes.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>{dictionary.sectorType.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="cityId"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Popover open={opened} onOpenChange={setOpened} modal={true}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={opened}
                    className={cn(
                      '!my-4 w-full justify-between capitalize',
                      !field.value && 'text-muted-foreground'
                    )}
                  >
                    {field.value
                      ? cities?.body.data.find(({ id }) => id === field.value)?.name
                      : dictionary.cities.label}
                    <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                  <Command>
                    <CommandInput placeholder={dictionary.cities.placeholder} />
                    <CommandList>
                      <CommandEmpty>{dictionary.cities.empty}</CommandEmpty>
                      <CommandGroup>
                        {cities?.body.data.map((city) => (
                          <CommandItem
                            key={city.id}
                            value={city.id.toString()}
                            keywords={[city.name]}
                            onSelect={() => {
                              form.setValue('cityId', city.id);
                              setOpened(false);
                            }}
                          >
                            <div className="flex items-start">
                              <Icons.Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  field.value === city.id ? 'opacity-100' : 'opacity-0'
                                )}
                              />
                              <div className="flex-1">
                                <div className="capitalize">{city.name}</div>
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
    </div>
  );
}
