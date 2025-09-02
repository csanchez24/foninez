import type { DataTableProps } from '@/components/data-table';
import type { Dictionary } from '@/i18n/get-dictionary';
import type { ColumnDef, Table } from '@tanstack/react-table';
import type { Child, Children, Guardian } from './@types';

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
  table: Table<Child>;
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
          placeholder={
            dictionary.guardian.info.tableChildren.toolbar.searchFilter.input.placeholder
          }
          value={(table.getState().globalFilter as string) ?? ''}
          onChange={onChange}
          className="h-9 w-[150px] lg:w-[250px]"
        />
      </div>
    </div>
  );
}

function GuardiansTabsChildrenTable({
  data,
  isInitialLoading,
}: Pick<DataTableProps<Child>, 'isInitialLoading'> & {
  data?: Children;
}) {
  const dictionary = useStoreContext((state) => state.dictionary);

  const columns: ColumnDef<Child>[] = React.useMemo(
    () => [
      {
        accessorKey: 'idNum',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.guardian.info.tableChildren.columns.idNum}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">{row.original.idNum ?? ''}</span>
        ),
      },
      {
        accessorKey: 'firstName',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.guardian.info.tableChildren.columns.firstName}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.firstName ?? ''}
          </span>
        ),
      },
      {
        accessorKey: 'middleName',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.guardian.info.tableChildren.columns.middleName}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.middleName ?? ''}
          </span>
        ),
      },
      {
        accessorKey: 'lastName',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.guardian.info.tableChildren.columns.lastName}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">{row.original.lastName ?? ''}</span>
        ),
      },
      {
        accessorKey: 'secondLastName',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.guardian.info.tableChildren.columns.secondLastName}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.secondLastName ?? ''}
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

export default function GuardiansTabsActivities({ guardian }: { guardian: Guardian | undefined }) {
  return (
    <div>
      <div className="py-4">
        <GuardiansTabsChildrenTable data={guardian?.children ?? []} />
      </div>
    </div>
  );
}
