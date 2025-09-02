import type { DataTableProps, UseDataTableUtilsReturn } from '@/components/data-table';
import type { Dictionary } from '@/i18n/get-dictionary';
import type { ColumnDef, RowData, Table, TableMeta } from '@tanstack/react-table';
import type { SchoolChild, SchoolChildPaginated } from './@types';

import {
  DataTable,
  DataTableHeadWithSorting,
  DataTableSearchFilter,
  DataTableViewOptions,
  getInitialDatatableState,
  getPageCountFromApi,
} from '@/components/data-table';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import * as React from 'react';

import { usePermissions } from '@/hooks/use-permissions';
import { useStoreContext } from '@/store';
import { formatDate } from '@/utils/format-date';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';

declare module '@tanstack/table-core' {
  interface TableMeta<TData extends RowData> {
    onRowOpen?(rowData: TData): void;
    onRowEdit?(rowData: TData): void;
    onRowDelete?(rowData: TData): void;
    onResync?(rowData: TData): void;
  }
}

function DataTableToolbar({
  table,
  dictionary,
}: {
  table: Table<SchoolChild>;
  dictionary: Dictionary;
}) {
  return (
    <div className="flex items-center justify-between">
      {/* prettier-ignore */}
      <DataTableSearchFilter table={table} dictionary={dictionary.register.table.toolbar.searchFilter} />
      <DataTableViewOptions table={table} dictionary={dictionary.register.table.toolbar.view} />
    </div>
  );
}

export function RegisterDataTable({
  data,
  sort,
  pagination,
  isLoading,
  isInitialLoading,
  onRowEdit,
  onRowOpen,
  onRowDelete,
  onSearch,
  onPagination,
  onSorting,
  onResync,
}: Pick<
  TableMeta<SchoolChild>,
  'onRowOpen' | 'onRowEdit' | 'onRowDelete' | 'onResync' | 'onSearch' | 'onSorting' | 'onPagination'
> &
  Pick<DataTableProps<SchoolChild>, 'isInitialLoading' | 'isLoading'> &
  Pick<UseDataTableUtilsReturn, 'pagination' | 'sort'> & {
    data?: SchoolChildPaginated;
  }) {
  const dictionary = useStoreContext((state) => state.dictionary);
  const dictionaryStatus = useStoreContext(
    (state) => state.dictionary.activity.info.tableChildren.columns.statuses.values
  );

  const { getPermission } = usePermissions({ include: ['manage:planModalityActivitySchoolChild'] });

  const columns: ColumnDef<SchoolChild>[] = React.useMemo(
    () => [
      {
        id: 'child.idNum',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting title={dictionary.register.table.columns.idNum} {...props} />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">{`${row.original.child?.idNum}`}</span>
        ),
      },
      {
        accessorKey: 'child.firstName',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.register.table.columns.firstName}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.child?.firstName}
          </span>
        ),
      },
      {
        accessorKey: 'child.lastName',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting title={dictionary.register.table.columns.lastName} {...props} />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.child?.lastName}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting title={dictionary.register.table.columns.status} {...props} />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {dictionaryStatus.find((s) => s.value === row.original.status)?.label}
          </span>
        ),
      },
      {
        accessorKey: 'rejectionNote',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting title={dictionary.register.table.columns.note} {...props} />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.rejectionNote ?? ''}
          </span>
        ),
      },
      {
        id: 'createdAt',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.register.table.columns.createdAt}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {formatDate(row.original.createdAt, 'y-MM-dd')}
          </span>
        ),
      },
      {
        id: 'actions',
        cell: ({ table, row }) => (
          <div className="flex items-center justify-end space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                  <Icons.DotsHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open actions menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem onClick={() => table.options.meta?.onRowOpen?.(row.original)}>
                  {dictionary.register.table.columns.actions.info}
                </DropdownMenuItem>
                {getPermission('update:planModalityActivitySchoolChild').granted &&
                  row.original.status !== 'confirmed' && (
                    <>
                      <DropdownMenuItem
                        onClick={() => table.options.meta?.onRowEdit?.(row.original)}
                      >
                        {dictionary.register.table.columns.actions.edit}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => table.options.meta?.onResync?.(row.original)}
                      >
                        {dictionary.register.table.columns.actions.resync}
                      </DropdownMenuItem>
                    </>
                  )}

                {getPermission('delete:planModalityActivitySchoolChild').granted && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => table.options.meta?.onRowDelete?.(row.original)}
                    >
                      {dictionary.register.table.columns.actions.delete}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [dictionary, dictionaryStatus, getPermission]
  );

  const defaultData = React.useMemo(() => [], []);

  const table = useReactTable({
    columns,
    data: data?.data ?? defaultData,
    enableRowSelection: false,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
    pageCount: getPageCountFromApi(data?.meta?.total, pagination.limit),
    initialState: getInitialDatatableState({ pagination, sort }),
    meta: {
      onRowOpen,
      onRowEdit,
      onRowDelete,
      onPagination,
      onSorting,
      onSearch,
      onResync,
    },
  });

  return (
    <DataTable
      table={table}
      withPagination
      isLoading={isLoading}
      isInitialLoading={isInitialLoading}
      dictionary={dictionary.misc.table}
      toolbar={<DataTableToolbar table={table} dictionary={dictionary} />}
    />
  );
}
