import type { DataTableProps } from '@/components/data-table';
import type { Dictionary } from '@/i18n/get-dictionary';
import type { ColumnDef, Table } from '@tanstack/react-table';
import type { ResourcesToSuppliers, ResourceToSupplier, Supplier } from './@types';

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
import { formatDate } from '@/utils/format-date';
import { toCOPCurrency } from '@/utils/currency-formatters';

function DataTableToolbar({
  table,
  dictionary,
  setFilter,
}: {
  table: Table<ResourceToSupplier>;
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
            dictionary.supplier.info.tableResources.toolbar.searchFilter.input.placeholder
          }
          value={(table.getState().globalFilter as string) ?? ''}
          onChange={onChange}
          className="h-9 w-[150px] lg:w-[250px]"
        />
      </div>
    </div>
  );
}

function SuppliersTabsResourcesTable({
  data,
  isInitialLoading,
}: Pick<DataTableProps<ResourceToSupplier>, 'isInitialLoading'> & {
  data?: ResourcesToSuppliers;
}) {
  const dictionary = useStoreContext((state) => state.dictionary);

  const columns: ColumnDef<ResourceToSupplier>[] = React.useMemo(
    () => [
      {
        accessorKey: 'resource.name',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.supplier.info.tableResources.columns.name}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.resource?.name ?? ''}
          </span>
        ),
      },
      {
        accessorKey: 'resource.price',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.supplier.info.tableResources.columns.price}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            ${toCOPCurrency(row.original.resource?.price ?? 0)}
          </span>
        ),
      },
      {
        accessorKey: 'createdAt',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.supplier.info.tableResources.columns.createdAt}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {formatDate(row.original.createdAt ?? '', 'y-MM-dd')}
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

export default function SuppliersTabsActivities({ supplier }: { supplier: Supplier | undefined }) {
  return (
    <div>
      <div className="py-4">
        <SuppliersTabsResourcesTable data={supplier?.resourcesToSuppliers ?? []} />
      </div>
    </div>
  );
}
