'use client';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { es } from 'date-fns/locale';

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
import { useCallback, useMemo } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';
import { api } from '@/clients/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useFormErrors } from '@/hooks';
import { useStoreContext } from '@/store';

const formSchema = z.object({
  startDate: z.date({
    message: 'Digite Fecha Inicial',
  }),
  endDate: z.date({
    message: 'Digite Fecha Final',
  }),
});

type FormValues = z.infer<typeof formSchema>;

const FormFields = () => {
  const form = useFormContext<FormValues>();
  const dictionaryMisc = useStoreContext((state) => state.dictionary.misc);

  return (
    <div className="mb-6 space-y-2">
      <FormField
        control={form.control}
        name="startDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>{dictionaryMisc.dialogs.report.fields.startDate.label}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-[240px] pl-3 text-left font-normal',
                      !field.value && 'text-muted-foreground'
                    )}
                  >
                    {field.value ? (
                      format(field.value, 'PPP', { locale: es })
                    ) : (
                      <span>{dictionaryMisc.dialogs.report.fields.startDate.text}</span>
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
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="endDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>{dictionaryMisc.dialogs.report.fields.endDate.label}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-[240px] pl-3 text-left font-normal',
                      !field.value && 'text-muted-foreground'
                    )}
                  >
                    {field.value ? (
                      format(field.value, 'PPP', { locale: es })
                    ) : (
                      <span>{dictionaryMisc.dialogs.report.fields.endDate.text}</span>
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
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export function InventoryTransactionsReport() {
  const { onSubmitError } = useFormErrors();

  const dictionaryMisc = useStoreContext((state) => state.dictionary.misc);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    values: useMemo(() => {
      return {
        startDate: new Date(),
        endDate: new Date(),
      };
    }, []),
  });

  const onSubmit = useCallback(async (data: FormValues) => {
    const response = await api.inventoryTransaction.report.mutation({
      body: {
        startDate: data.startDate,
        endDate: data.endDate,
      },
    });
    if (response.status != 200) return;

    const worksheet = XLSX.utils.json_to_sheet(response.body);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' }) as BlobPart;

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    saveAs(blob, 'inventory-transaction.xlsx');
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Icons.File className="mr-2 h-4 w-4" />
          {dictionaryMisc.buttons.report}
        </Button>
      </DialogTrigger>
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{dictionaryMisc.dialogs.report.title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onSubmitError)} className="space-y-4">
            <FormFields />
            <Button className="flex">{dictionaryMisc.dialogs.report.buttons.report}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
