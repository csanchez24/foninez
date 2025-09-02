import type { PlanModalityActivityFormValues } from './@types';

import { Icons } from '@/components/icons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import * as React from 'react';

import { useGetProofFileClassifications } from '@/hooks/queries/use-proof-file-classification-queries';
import { useStoreContext } from '@/store';
import { cn } from '@/utils/cn';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useDebounce } from 'use-debounce';

export default function PlanModalityActivityFormProofFiles() {
  const dictionary = useStoreContext(
    (state) => state.dictionary.planModalityActivity.form.proofFiles
  );

  // Since there can be hundreds of proofFiles we search in the server instead
  const [search, setSearch] = React.useState<string>();
  const [deboucedSearchText] = useDebounce(search?.trim(), 500);
  const { data: proofFileClassifications } = useGetProofFileClassifications({ deboucedSearchText });

  // We need to to make the dialog controllable since we trigger it from several places
  const [opened, setOpened] = React.useState(false);

  // Make select controllable so that we can autoclose on user selection
  const [openedSelect, setOpenedSelect] = React.useState(false);

  // Distinguish between adding new and editing existing record
  const [isNew, setIsNew] = React.useState(false);

  const form = useFormContext<PlanModalityActivityFormValues>();
  const { fields, append, remove } = useFieldArray({
    name: 'proofFiles',
    control: form.control,
  });
  const watchedFields = form.watch('proofFiles');

  // Track current field's index as we'll need it for edit/delete purposes
  const [entryIndex, setEntryIndex] = React.useState<number>(() => {
    return (fields?.length ?? 1) - 1;
  });

  const entry = React.useMemo(() => {
    return watchedFields?.[entryIndex];
  }, [watchedFields, entryIndex]);

  /** Unset entry index and remove newest unfinished entry from proofFiles array */
  const handleCancelDialogAction = React.useCallback(() => {
    // This means the user did not finish the process of adding new
    // entry to the proofFiles array. We can just remove it.
    if (isNew) {
      remove(Math.max(0, fields.length - 1));
      setIsNew(false);
    }
    setEntryIndex(-1);
  }, [fields.length, isNew, setIsNew, setEntryIndex, remove]);

  /** Reset everything once we save/close dialog */
  const handleAddDialogAction = React.useCallback(() => {
    setIsNew(false);
    setOpened(false);
    setEntryIndex(-1);
  }, [setIsNew, setOpened]);

  /** Set `entryIndex` for existing record needed to run updates */
  const handleEditTableAction = React.useCallback(
    (entryIndex: number) => {
      setEntryIndex(entryIndex);
      setOpened(true);
    },
    [setEntryIndex, setOpened]
  );

  /** Remove entry from array */
  const handleDeleteTableAction = React.useCallback(
    (index: number) => {
      remove(index);
    },
    [remove]
  );

  /** Add entry to array with dummy data and open dialog */
  const handleAddNew = React.useCallback(() => {
    append({ proofFileClassification: { id: -1 } });
    setEntryIndex(fields?.length ?? 1);
    setIsNew(true);
  }, [fields, append, setEntryIndex, setIsNew]);

  return (
    <div className="my-6 space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium">{dictionary.heading}</h3>
          <p className="text-sm text-muted-foreground">{dictionary.description}</p>
        </div>

        <div className="flex items-center space-x-4">
          <AlertDialog open={opened} onOpenChange={setOpened}>
            <AlertDialogTrigger asChild>
              <Button onClick={handleAddNew}>
                <Icons.PlusCircled className="mr-2 h-4 w-4" />
                {dictionary.dialog.trigger}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-xl" onEscapeKeyDown={(e) => e.preventDefault()}>
              <AlertDialogHeader>
                <AlertDialogTitle>{dictionary.dialog.title}</AlertDialogTitle>
                <AlertDialogDescription>{dictionary.dialog.description}</AlertDialogDescription>
              </AlertDialogHeader>
              {entryIndex >= 0 && (
                <>
                  <FormField
                    name={`proofFiles.${entryIndex}.proofFileClassification`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dictionary.proofFileClassificationField.label}</FormLabel>
                        <Popover open={openedSelect} onOpenChange={setOpenedSelect} modal={true}>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              role="combobox"
                              aria-expanded={openedSelect}
                              className={cn(
                                'w-full justify-between capitalize',
                                field.value.id < 0 && 'text-muted-foreground'
                              )}
                            >
                              {field.value.id >= 0
                                ? proofFileClassifications?.body.data.find(
                                    ({ id }) => id === field.value.id
                                  )?.name
                                : dictionary.proofFileClassificationField.placeholder}
                              <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                            <Command shouldFilter={false}>
                              <CommandInput
                                placeholder={
                                  dictionary.proofFileClassificationField.commandPlaceholder
                                }
                                value={search}
                                onValueChange={setSearch}
                              />
                              <CommandList>
                                <CommandEmpty>
                                  {dictionary.proofFileClassificationField.commandEmpty}
                                </CommandEmpty>
                                <CommandGroup>
                                  {proofFileClassifications?.body.data.map(
                                    (proofFileClassification) => (
                                      <CommandItem
                                        key={proofFileClassification.id}
                                        value={proofFileClassification.id.toString()}
                                        disabled={fields.some(
                                          (f) =>
                                            f.proofFileClassification.id ===
                                            proofFileClassification.id
                                        )}
                                        onSelect={() => {
                                          form.setValue(
                                            `proofFiles.${entryIndex}.proofFileClassification`,
                                            proofFileClassification
                                          );
                                          setOpenedSelect(false);
                                        }}
                                      >
                                        <div className="flex items-start">
                                          <Icons.Check
                                            className={cn(
                                              'mr-2 h-4 w-4',
                                              field.value.id === proofFileClassification.id
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                            )}
                                          />
                                          <div className="flex-1">
                                            <div className="capitalize">
                                              {proofFileClassification.name}
                                            </div>
                                          </div>
                                        </div>
                                      </CommandItem>
                                    )
                                  )}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          {dictionary.proofFileClassificationField.description}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <AlertDialogFooter className="mt-6">
                <AlertDialogCancel className="min-w-24" onClick={handleCancelDialogAction}>
                  {dictionary.dialog.cancelButton}
                </AlertDialogCancel>
                <AlertDialogAction
                  className="min-w-24"
                  disabled={!(entry && entry.proofFileClassification.id >= 0)}
                  onClick={handleAddDialogAction}
                >
                  {isNew ? dictionary.dialog.addButton : dictionary.dialog.updateButton}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <Separator />
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>{dictionary.table.columns.proofFileClassification}</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {watchedFields?.length ? (
            watchedFields.map((field, i) => (
              <TableRow key={`${field.proofFileClassification.id}-${i}`}>
                <TableCell className="max-w-[300px] truncate">
                  {field.proofFileClassification.name}
                </TableCell>
                <TableCell className="w-4">
                  <div className="flex items-center space-x-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                        >
                          <Icons.DotsHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open actions menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem onClick={() => handleEditTableAction(i)}>
                          {dictionary.table.columns.actions.edit}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteTableAction(i)}>
                          {dictionary.table.columns.actions.delete}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={4}>
                <div className="py-4 text-center font-medium text-muted-foreground">
                  {dictionary.table.empty}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
