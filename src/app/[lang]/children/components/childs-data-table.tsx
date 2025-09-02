import type { DataTableProps, UseDataTableUtilsReturn } from '@/components/data-table';
import type { Dictionary } from '@/i18n/get-dictionary';
import type { ColumnDef, RowData, Table, TableMeta } from '@tanstack/react-table';
import type { Child, ChildPaginated } from './@types';

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
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';

declare module '@tanstack/table-core' {
  interface TableMeta<TData extends RowData> {
    onRowOpen?(rowData: TData): void;
    onRowEdit?(rowData: TData): void;
    onRowDelete?(rowData: TData): void;
  }
}

function ChildDataTableToolbar({
  table,
  dictionary,
}: {
  table: Table<Child>;
  dictionary: Dictionary;
}) {
  return (
    <div className="flex items-center justify-between">
      {/* prettier-ignore */}
      <DataTableSearchFilter table={table} dictionary={dictionary.child.table.toolbar.searchFilter} />
      <DataTableViewOptions table={table} dictionary={dictionary.child.table.toolbar.view} />
    </div>
  );
}

export function ChildrenDataTable({
  data,
  sort,
  pagination,
  isLoading,
  isInitialLoading,
  onRowEdit,
  onRowDelete,
  onSearch,
  onPagination,
  onSorting,
  onRowOpen,
}: Pick<
  TableMeta<Child>,
  'onRowEdit' | 'onRowDelete' | 'onSearch' | 'onSorting' | 'onPagination' | 'onRowOpen'
> &
  Pick<DataTableProps<Child>, 'isInitialLoading' | 'isLoading'> &
  Pick<UseDataTableUtilsReturn, 'pagination' | 'sort'> & {
    data?: ChildPaginated;
  }) {
  const dictionary = useStoreContext((state) => state.dictionary);

  const { getPermission } = usePermissions({ include: ['manage:child'] });

  const columns: ColumnDef<Child>[] = React.useMemo(
    () => [
      {
        accessorKey: 'identificationId',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.child.table.columns.identification}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.identification?.name ?? ''}
          </span>
        ),
      },
      {
        accessorKey: 'identification',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting title={dictionary.child.table.columns.idNum} {...props} />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">{row.original.idNum ?? ''}</span>
        ),
      },
      {
        accessorKey: 'firstName',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting title={dictionary.child.table.columns.firstName} {...props} />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">{row.getValue('firstName')}</span>
        ),
      },
      {
        accessorKey: 'middleName',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting title={dictionary.child.table.columns.middleName} {...props} />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">{row.getValue('middleName')}</span>
        ),
      },
      {
        accessorKey: 'lastName',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting title={dictionary.child.table.columns.lastName} {...props} />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">{row.getValue('lastName')}</span>
        ),
      },
      {
        accessorKey: 'secondLastName',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.child.table.columns.secondLastName}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.getValue('secondLastName')}
          </span>
        ),
      },
      {
        accessorKey: 'guardianId',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting title={dictionary.child.table.columns.guardian} {...props} />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.guardian?.firstName ?? ''} {row.original.guardian?.lastName}
          </span>
        ),
      },
      {
        accessorKey: 'activities',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting title={dictionary.child.table.columns.activities} {...props} />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.planModalityActivitySchoolChildren?.length ?? 0}
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
                  {dictionary.professional.table.columns.actions.info}
                </DropdownMenuItem>
                {getPermission('update:child').granted && (
                  <DropdownMenuItem onClick={() => table.options.meta?.onRowEdit?.(row.original)}>
                    {dictionary.child.table.columns.actions.edit}
                  </DropdownMenuItem>
                )}
                {getPermission('delete:child').granted && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => table.options.meta?.onRowDelete?.(row.original)}
                    >
                      {dictionary.child.table.columns.actions.delete}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [dictionary, getPermission]
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
      onRowEdit,
      onRowDelete,
      onPagination,
      onSorting,
      onSearch,
      onRowOpen,
    },
  });

  return (
    <DataTable
      table={table}
      withPagination
      isLoading={isLoading}
      isInitialLoading={isInitialLoading}
      dictionary={dictionary.misc.table}
      toolbar={<ChildDataTableToolbar table={table} dictionary={dictionary} />}
    />
  );
}
