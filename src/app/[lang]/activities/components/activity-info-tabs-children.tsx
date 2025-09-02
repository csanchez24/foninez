import type { DataTableProps } from '@/components/data-table';
import type { Dictionary } from '@/i18n/get-dictionary';
import type { ColumnDef, RowData, Table, TableMeta } from '@tanstack/react-table';
import type { ActivitySchoolChildren, ActivitySchoolChild, Activity } from './@types';

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
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useReSyncPlanModalityActivitySchoolChild } from '@/hooks/queries/use-plan-modality-activity-school-children-queries';

declare module '@tanstack/table-core' {
  interface TableMeta<TData extends RowData> {
    onResync?(rowData: TData): void;
  }
}

function DataTableToolbar({
  table,
  dictionary,
  setFilter,
}: {
  table: Table<ActivitySchoolChild>;
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

function ChildrenTable({
  data,
  isInitialLoading,
  isLoading,
  onResync,
}: Pick<TableMeta<ActivitySchoolChild>, 'onResync'> &
  Pick<DataTableProps<ActivitySchoolChild>, 'isInitialLoading' | 'isLoading'> & {
    data?: ActivitySchoolChildren;
  }) {
  const dictionary = useStoreContext((state) => state.dictionary);
  const dictionaryStatuses = useStoreContext(
    (state) => state.dictionary.activity.info.tableChildren.columns.statuses.values
  );

  const columns: ColumnDef<ActivitySchoolChild>[] = React.useMemo(
    () => [
      {
        accessorKey: 'child.firstName',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.activity.info.tableChildren.columns.firstName}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.child?.firstName ?? ''}
          </span>
        ),
      },
      {
        accessorKey: 'child.lastName',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.activity.info.tableChildren.columns.lastName}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.child?.lastName ?? ''}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.activity.info.tableChildren.columns.statuses.label}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {dictionaryStatuses.find((s) => s.value === row.original.status)?.label ?? ''}
          </span>
        ),
      },
      {
        accessorKey: 'rejectionNote',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.activity.info.tableChildren.columns.note}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.rejectionNote ?? ''}
          </span>
        ),
      },
      {
        accessorKey: 'createdAt',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.activity.info.tableChildren.columns.createdAt}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {formatDate(row.original?.createdAt ?? '', 'y-MM-dd')}
          </span>
        ),
      },
      {
        id: 'actions',
        cell: ({ table, row }) => (
          <div>
            {row.original.status !== 'confirmed' && (
              <Button
                onClick={() => {
                  table.options.meta?.onResync?.(row.original);
                }}
                variant="outline"
                size="icon"
                disabled={isLoading}
              >
                <Icons.RefreshCcw className="h-4 w-4" />
              </Button>
            )}
          </div>
        ),
      },
    ],
    [dictionary, dictionaryStatuses, isLoading]
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
    meta: {
      onResync,
    },
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

export default function ActivityInfoTabsChildren({ activity }: { activity: Activity | undefined }) {
  const { mutateAsync: resync } = useReSyncPlanModalityActivitySchoolChild();

  return (
    <div>
      <div className="py-4">
        <ChildrenTable
          data={activity?.planModalityActivitySchoolChildren ?? []}
          onResync={(rowData) => resync({ params: { id: rowData.id } })}
        />
      </div>
    </div>
  );
}
