import type { DataTableProps } from '@/components/data-table';
import type { Dictionary } from '@/i18n/get-dictionary';
import type { ColumnDef, Table } from '@tanstack/react-table';
import type { InventoryTransactionLine, InventoryTransactionLines, Resource } from './@types';

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
  table: Table<InventoryTransactionLine>;
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
            dictionary.resource.info.tableInventory.toolbar.searchFilter.input.placeholder
          }
          value={(table.getState().globalFilter as string) ?? ''}
          onChange={onChange}
          className="h-9 w-[150px] lg:w-[250px]"
        />
      </div>
    </div>
  );
}

function ResourcesTabsInventoryTable({
  data,
  isInitialLoading,
}: Pick<DataTableProps<InventoryTransactionLine>, 'isInitialLoading'> & {
  data?: InventoryTransactionLines;
}) {
  const dictionary = useStoreContext((state) => state.dictionary);

  const columns: ColumnDef<InventoryTransactionLine>[] = React.useMemo(
    () => [
      {
        accessorKey: 'inventoryTransaction.type',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.resource.info.tableInventory.columns.type}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.inventoryTransaction?.type ?? ''}
          </span>
        ),
      },
      {
        accessorKey: 'inventoryTransaction.orderNumber',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.resource.info.tableInventory.columns.orderNumber}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.inventoryTransaction?.orderNumber ?? ''}
          </span>
        ),
      },
      {
        accessorKey: 'inventoryTransaction.planModalityActivitySchool.planModalityActivity.name',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.resource.info.tableInventory.columns.activity}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.inventoryTransaction?.planModalityActivitySchool?.planModalityActivity
              ?.name ?? ''}
          </span>
        ),
      },
      {
        accessorKey: 'qty',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.resource.info.tableInventory.columns.qty}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">{row.original.qty ?? ''}</span>
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

export default function ResourcesTabsActivities({ resource }: { resource: Resource | undefined }) {
  return (
    <div>
      <div className="py-4">
        <ResourcesTabsInventoryTable data={resource?.inventoryTransactionLines ?? []} />
      </div>
    </div>
  );
}
