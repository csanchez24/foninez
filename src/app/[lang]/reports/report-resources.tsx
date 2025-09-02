'use client';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo, useState } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/utils/cn';
import { api } from '@/clients/api';
import { Input } from '@/components/ui/input';
import { useGetPrograms } from '@/hooks/queries/use-program-queries';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useFormErrors } from '@/hooks';
import { useStoreContext } from '@/store';

const formSchema = z.object({
  year: z.number(),
  programId: z.number(),
});

type FormValues = z.infer<typeof formSchema>;

const FormFields = () => {
  const form = useFormContext<FormValues>();
  const { data: programs } = useGetPrograms();
  const [opened, setOpened] = useState(false);
  const dictionary = useStoreContext((state) => state.dictionary.reports);

  return (
    <div className="my-6 space-y-2">
      <h2 className="mb-8 text-xl font-bold">{dictionary.tabs.resources.title}</h2>
      <FormField
        name="programId"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dictionary.form.fields.program.label}</FormLabel>
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
                      ? programs?.body.data.find(({ id }) => id === field.value)?.name
                      : dictionary.form.fields.program.placeholder}
                    <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                  <Command>
                    <CommandInput placeholder="select" />
                    <CommandList>
                      <CommandEmpty>{dictionary.form.fields.program.empty}</CommandEmpty>
                      <CommandGroup>
                        {programs?.body.data.map((program) => (
                          <CommandItem
                            key={program.id}
                            value={program.id.toString()}
                            keywords={[program.name]}
                            onSelect={() => {
                              form.setValue('programId', program.id);
                              setOpened(false);
                            }}
                          >
                            <div className="flex items-start">
                              <Icons.Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  field.value === program.id ? 'opacity-100' : 'opacity-0'
                                )}
                              />
                              <div className="flex-1">
                                <div className="capitalize">{program.name}</div>
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
        name="year"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dictionary.form.fields.year.label}</FormLabel>
            <FormControl>
              <Input placeholder={dictionary.form.fields.year.placeholder} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export function ReportResources() {
  const { onSubmitError } = useFormErrors();
  const dictionary = useStoreContext((state) => state.dictionary.reports);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    values: useMemo(() => {
      return {
        year: new Date().getFullYear(),
        programId: 0,
      };
    }, []),
  });

  const onSubmit = useCallback(async (data: FormValues) => {
    const response = await api.report.resources.query({
      query: {
        year: data.year,
        programId: data.programId,
      },
    });
    if (response.status != 200) return;

    const worksheet = XLSX.utils.json_to_sheet(response.body);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' }) as BlobPart;

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    saveAs(blob, 'resources.xlsx');
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onSubmitError)} className="space-y-4">
        <FormFields />
        <Button className="flex">{dictionary.buttons.report}</Button>
      </form>
    </Form>
  );
}
