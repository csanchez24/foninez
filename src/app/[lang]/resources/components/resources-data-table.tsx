import type { DataTableProps, UseDataTableUtilsReturn } from '@/components/data-table';
import type { Dictionary } from '@/i18n/get-dictionary';
import type { ColumnDef, RowData, Table, TableMeta } from '@tanstack/react-table';
import type { Resource, ResourcePaginated } from './@types';

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
import { toCOPCurrency } from '@/utils/currency-formatters';

declare module '@tanstack/table-core' {
  interface TableMeta<TData extends RowData> {
    onRowOpen?(rowData: TData): void;
    onRowEdit?(rowData: TData): void;
    onRowDelete?(rowData: TData): void;
  }
}

function ResourceDataTableToolbar({
  table,
  dictionary,
}: {
  table: Table<Resource>;
  dictionary: Dictionary;
}) {
  return (
    <div className="flex items-center justify-between">
      {/* prettier-ignore */}
      <DataTableSearchFilter table={table} dictionary={dictionary.resource.table.toolbar.searchFilter} />
      <DataTableViewOptions table={table} dictionary={dictionary.resource.table.toolbar.view} />
    </div>
  );
}

export function ResourcesDataTable({
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
  TableMeta<Resource>,
  'onRowEdit' | 'onRowDelete' | 'onSearch' | 'onSorting' | 'onPagination' | 'onRowOpen'
> &
  Pick<DataTableProps<Resource>, 'isInitialLoading' | 'isLoading'> &
  Pick<UseDataTableUtilsReturn, 'pagination' | 'sort'> & {
    data?: ResourcePaginated;
  }) {
  const dictionary = useStoreContext((state) => state.dictionary);

  const { getPermission } = usePermissions({ include: ['manage:resource'] });

  const columns: ColumnDef<Resource>[] = React.useMemo(
    () => [
      {
        accessorKey: 'name',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting title={dictionary.resource.table.columns.name} {...props} />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">{row.getValue('name')}</span>
        ),
      },
      {
        accessorKey: 'resourceClassificationId',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.resource.table.columns.classification}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.resourceClassification?.name ?? ''}
          </span>
        ),
      },
      {
        accessorKey: 'price',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting title={dictionary.resource.table.columns.price} {...props} />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            ${toCOPCurrency(row.original.price ?? 0)}
          </span>
        ),
      },
      {
        accessorKey: 'type',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting title={dictionary.resource.table.columns.type} {...props} />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">{row.original.type ?? ''}</span>
        ),
      },
      {
        accessorKey: 'usageType',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.resource.table.columns.usageType}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.usageType ?? ''}
          </span>
        ),
      },
      {
        accessorKey: 'inventory',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.resource.table.columns.inventory}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.inventory?.qty ?? 0}
          </span>
        ),
      },
      {
        accessorKey: 'suppliers',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting title={dictionary.resource.table.columns.supplier} {...props} />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.resourcesToSuppliers?.length ?? 0}
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
                {getPermission('update:resource').granted && (
                  <DropdownMenuItem onClick={() => table.options.meta?.onRowEdit?.(row.original)}>
                    {dictionary.resource.table.columns.actions.edit}
                  </DropdownMenuItem>
                )}
                {getPermission('delete:resource').granted && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => table.options.meta?.onRowDelete?.(row.original)}
                    >
                      {dictionary.resource.table.columns.actions.delete}
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
      toolbar={<ResourceDataTableToolbar table={table} dictionary={dictionary} />}
    />
  );
}
