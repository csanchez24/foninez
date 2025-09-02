import type { DataTableProps } from '@/components/data-table';
import type { Dictionary } from '@/i18n/get-dictionary';
import type { ColumnDef, Table } from '@tanstack/react-table';
import type { ActivitySchoolResources, ActivitySchoolResource, Activity } from './@types';

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
  table: Table<ActivitySchoolResource>;
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
            dictionary.activity.info.tableResource.toolbar.searchFilter.input.placeholder
          }
          value={(table.getState().globalFilter as string) ?? ''}
          onChange={onChange}
          className="h-9 w-[150px] lg:w-[250px]"
        />
      </div>
    </div>
  );
}

function ResourcesTable({
  data,
  isInitialLoading,
}: Pick<DataTableProps<ActivitySchoolResource>, 'isInitialLoading'> & {
  data?: ActivitySchoolResources;
}) {
  const dictionary = useStoreContext((state) => state.dictionary);

  const columns: ColumnDef<ActivitySchoolResource>[] = React.useMemo(
    () => [
      {
        accessorKey: 'planModalityActivityResource.resource.name',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.activity.info.tableResource.columns.name}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.planModalityActivityResource?.resource?.name ?? ''}
          </span>
        ),
      },
      {
        accessorKey: 'resourcesQty',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.activity.info.tableResource.columns.qty}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.resourcesQty ?? ''}
          </span>
        ),
      },
      {
        accessorKey: 'resourcesReceivedQty',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.activity.info.tableResource.columns.qtyReceive}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.resourcesReceivedQty ?? ''}
          </span>
        ),
      },
      {
        accessorKey: 'resourcesUsedQty',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.activity.info.tableResource.columns.qtyUsed}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.resourcesUsedQty ?? ''}
          </span>
        ),
      },
      {
        accessorKey: 'note',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.activity.info.tableResource.columns.note}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">{row.original.note ?? ''}</span>
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

export default function ActivityInfoTabsResources({
  activity,
}: {
  activity: Activity | undefined;
}) {
  return (
    <div>
      <div className="py-4">
        <ResourcesTable data={activity?.planModalityActivitySchoolsResources ?? []} />
      </div>
    </div>
  );
}
