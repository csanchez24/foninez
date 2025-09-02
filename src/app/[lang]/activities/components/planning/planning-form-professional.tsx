import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';

import { useStoreContext } from '@/store';
import { useForm } from 'react-hook-form';
import type { Activity, PlanModalityActivitySchoolProfessionalFormValues } from '../@types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo, useState } from 'react';
import { PlanModalityActivitySchoolProfessionalCreateBodySchema } from '@/schemas/plan-modality-activity-school-professional';
import {
  useCreatePlanModalityActivitySchoolProfessional,
  useDeletePlanModalityActivitySchoolProfessional,
  useGetPlanModalityActivitySchoolProfessionals,
} from '@/hooks/queries/use-plan-modality-activity-school-professional-queries';
import { useFormErrors, usePermissions } from '@/hooks';
import { useToast } from '@/components/ui/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { useGetProfessionals } from '@/hooks/queries/use-professional-queries';
import { useDebounce } from 'use-debounce';
import { Icons } from '@/components/icons';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function FormProfessional({
  activity,
  onOpened: _,
}: {
  activity?: Activity;
  onOpened(opened: boolean): void;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.activity.planning);

  const [search, setSearch] = useState<string>();
  const [deboucedSearchText] = useDebounce(search?.trim(), 500);
  const { data: professionals } = useGetProfessionals({ deboucedSearchText });
  const { data: activityProfessionals } = useGetPlanModalityActivitySchoolProfessionals({
    where: {
      planModalityActivitySchoolId: activity?.id,
    },
  });

  const { getPermission } = usePermissions({
    include: ['manage:planModalityActivitySchoolProfessional'],
  });

  const { toast } = useToast();

  const { onSubmitError } = useFormErrors();

  const form = useForm<PlanModalityActivitySchoolProfessionalFormValues>({
    resolver: zodResolver(PlanModalityActivitySchoolProfessionalCreateBodySchema.shape.data),
    values: useMemo(() => {
      return {
        professionalId: 0,
        planModalityActivitySchoolId: activity?.id ?? 0,
      };
    }, [activity]),
  });

  const { mutateAsync: create, isLoading: isCreating } =
    useCreatePlanModalityActivitySchoolProfessional({
      onSuccess: () => {
        form.reset();
        //onOpened(false);
      },
    });

  const { mutateAsync: deleteProfessional, isLoading: isDeleting } =
    useDeletePlanModalityActivitySchoolProfessional();

  const isLoading = useMemo(() => isCreating || isDeleting, [isCreating, isDeleting]);

  const onSubmit = useCallback(
    async (data: PlanModalityActivitySchoolProfessionalFormValues) => {
      if (
        !getPermission([
          'create:planModalityActivitySchoolProfessional',
          'update:planModalityActivitySchoolProfessional',
        ]).granted
      ) {
        return toast({
          variant: 'destructive',
          description: 'You do not have permission to create/update inventoryTransaction.',
        });
      }

      await create({ body: { data } });
    },
    [create, getPermission, toast]
  );

  const [openedSelect, setOpenedSelect] = useState(false);

  return (
    <div className="my-6 space-y-2">
      <div>
        <h3 className="text-lg font-medium">{dictionary.headings}</h3>
        <p className="text-sm text-muted-foreground">{dictionary.description}</p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onSubmitError)} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <FormField
                name={`professionalId`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.professional.professionalField.label}</FormLabel>
                    <Popover open={openedSelect} onOpenChange={setOpenedSelect} modal={true}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          role="combobox"
                          aria-expanded={openedSelect}
                          className={cn(
                            'w-full justify-between capitalize',
                            field.value < 0 && 'text-muted-foreground'
                          )}
                        >
                          {field.value > 0
                            ? `${
                                professionals?.body.data.find(({ id }) => id === field.value)
                                  ?.firstName
                              } ${
                                professionals?.body.data.find(({ id }) => id === field.value)
                                  ?.lastName
                              }`
                            : dictionary.professional.professionalField.placeholder}
                          <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                        <Command shouldFilter={false}>
                          <CommandInput
                            placeholder={dictionary.professional.professionalField.placeholder}
                            value={search}
                            onValueChange={setSearch}
                          />
                          <CommandList>
                            <CommandEmpty>
                              {dictionary.professional.professionalField.empty}
                            </CommandEmpty>
                            <CommandGroup>
                              {professionals?.body.data.map((professional) => (
                                <CommandItem
                                  key={professional.id}
                                  value={professional.id.toString()}
                                  disabled={activityProfessionals?.body.data?.some(
                                    (p) => p.professional?.id === professional.id
                                  )}
                                  onSelect={() => {
                                    form.setValue(`professionalId`, professional.id);
                                    setOpenedSelect(false);
                                  }}
                                >
                                  <div className="flex items-start">
                                    <Icons.Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        field.value === professional.id
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                    <div className="flex-1">
                                      <div className="capitalize">
                                        {`${professional?.firstName} ${professional?.lastName}`}
                                      </div>
                                    </div>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      {dictionary.professional.professionalField.description}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {getPermission('create:planModalityActivitySchoolProfessional').granted && (
              <Button type="submit" disabled={isLoading} className="ml-auto flex">
                {isLoading && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
                {dictionary.buttons.save}
              </Button>
            )}
          </div>
        </form>
      </Form>
      <Table className="mt-8">
        <TableHeader>
          <TableRow>
            <TableHead>{dictionary.professional.table.columns.professional}</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {activityProfessionals?.body.data.length ? (
            activityProfessionals?.body.data?.map((field, i) => (
              <TableRow key={`${field.id}-${i}`}>
                <TableCell className="max-w-[300px] truncate">
                  {`${field.professional?.firstName} ${field.professional?.lastName}`}
                </TableCell>
                <TableCell className="w-4">
                  {getPermission(['delete:planModalityActivitySchoolProfessional']) && (
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
                          <DropdownMenuItem
                            onClick={() => deleteProfessional({ params: { id: field.id } })}
                          >
                            {dictionary.professional.table.columns.actions.delete}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={4}>
                <div className="py-4 text-center font-medium text-muted-foreground">
                  {dictionary.professional.table.empty}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
