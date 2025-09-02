import type { DataTableProps } from '@/components/data-table';
import type { Dictionary } from '@/i18n/get-dictionary';
import type { ColumnDef, Table } from '@tanstack/react-table';
import type { ActivitySchoolProfessionals, ActivitySchoolProfessional, Activity } from './@types';

import { DataTable, DataTableHeadWithSorting } from '@/components/data-table';
import { Input } from '@/components/ui/input';
import * as React from 'react';

import { useStoreContext } from '@/store';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

function DataTableToolbar({
  table,
  dictionary,
  setFilter,
}: {
  table: Table<ActivitySchoolProfessional>;
  setFilter: React.Dispatch<React.SetStateAction<string | undefined>>;
  dictionary: Dictionary;
}) {
  const onChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilter(event.target.value);
    },
    [setFilter]
  );

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={dictionary.activity.info.tableResource.toolbar.searchFilter.input.placeholder}
          value={(table.getState().globalFilter as string) ?? ''}
          onChange={onChange}
          className="h-9 w-[150px] lg:w-[250px]"
        />
      </div>
    </div>
  );
}

function ProfessionalsTable({
  data,
  isInitialLoading,
}: Pick<DataTableProps<ActivitySchoolProfessional>, 'isInitialLoading'> & {
  data?: ActivitySchoolProfessionals;
}) {
  const dictionary = useStoreContext((state) => state.dictionary);

  const columns: ColumnDef<ActivitySchoolProfessional>[] = React.useMemo(
    () => [
      {
        accessorKey: 'professional.firstName',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.activity.info.tableProfessional.columns.firstName}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.professional?.firstName ?? ''}
          </span>
        ),
      },
      {
        accessorKey: 'professional.lastName',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.activity.info.tableProfessional.columns.lastName}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.professional?.lastName ?? ''}
          </span>
        ),
      },
      {
        accessorKey: 'professional.email',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.activity.info.tableProfessional.columns.email}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original?.professional?.email ?? ''}
          </span>
        ),
      },
    ],
    [dictionary]
  );

  const defaultData = React.useMemo(() => [], []);
  const [globalFilter, setGlobalFilter] = React.useState<string>();

  const table = useReactTable({
    columns,
    data: data ?? defaultData,
    enableFilters: true,
    enableSorting: true,
    enableRowSelection: false,
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    enableGlobalFilter: true,
    globalFilterFn: 'auto',
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <DataTable
      table={table}
      isInitialLoading={isInitialLoading}
      dictionary={dictionary.misc.table}
      withPagination={true}
      toolbar={
        <DataTableToolbar table={table} setFilter={setGlobalFilter} dictionary={dictionary} />
      }
    />
  );
}

export default function ActivityInfoTabsProfessionals({
  activity,
}: {
  activity: Activity | undefined;
}) {
  return (
    <div>
      <div className="py-4">
        <ProfessionalsTable data={activity?.planModalityActivitySchoolProfessionals ?? []} />
      </div>
    </div>
  );
}
