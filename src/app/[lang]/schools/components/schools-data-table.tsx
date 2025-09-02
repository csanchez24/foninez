import type { DataTableProps, UseDataTableUtilsReturn } from '@/components/data-table';
import type { Dictionary } from '@/i18n/get-dictionary';
import type { ColumnDef, RowData, Table, TableMeta } from '@tanstack/react-table';
import type { School, SchoolPaginated } from './@types';

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

function SchoolDataTableToolbar({
  table,
  dictionary,
}: {
  table: Table<School>;
  dictionary: Dictionary;
}) {
  return (
    <div className="flex items-center justify-between">
      {/* prettier-ignore */}
      <DataTableSearchFilter table={table} dictionary={dictionary.school.table.toolbar.searchFilter} />
      <DataTableViewOptions table={table} dictionary={dictionary.school.table.toolbar.view} />
    </div>
  );
}

export function SchoolsDataTable({
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
  TableMeta<School>,
  'onRowEdit' | 'onRowDelete' | 'onSearch' | 'onSorting' | 'onPagination' | 'onRowOpen'
> &
  Pick<DataTableProps<School>, 'isInitialLoading' | 'isLoading'> &
  Pick<UseDataTableUtilsReturn, 'pagination' | 'sort'> & {
    data?: SchoolPaginated;
  }) {
  const dictionary = useStoreContext((state) => state.dictionary);

  const { getPermission } = usePermissions({ include: ['manage:school'] });

  const columns: ColumnDef<School>[] = React.useMemo(
    () => [
      {
        accessorKey: 'name',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting title={dictionary.school.table.columns.name} {...props} />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">{row.getValue('name')}</span>
        ),
      },
      {
        accessorKey: 'infrastructureCode',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.school.table.columns.infrastructureCode}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.getValue('infrastructureCode')}
          </span>
        ),
      },
      {
        accessorKey: 'daneCode',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting title={dictionary.school.table.columns.daneCode} {...props} />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">{row.getValue('daneCode')}</span>
        ),
      },
      {
        accessorKey: 'branchCode',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting title={dictionary.school.table.columns.branchCode} {...props} />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">{row.getValue('branchCode')}</span>
        ),
      },
      {
        accessorKey: 'areaType',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.school.table.columns.areaType.label}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">{row.getValue('areaType')}</span>
        ),
      },
      {
        accessorKey: 'sectorType',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.school.table.columns.sectorType.label}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">{row.getValue('sectorType')}</span>
        ),
      },
      {
        accessorKey: 'cityId',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting title={dictionary.school.table.columns.city} {...props} />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.city?.name ?? '-'}
          </span>
        ),
      },
      {
        accessorKey: 'planModalityActivitySchools',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting title={dictionary.school.table.columns.activities} {...props} />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.planModalityActivitySchools?.length ?? '0'}
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
                  {dictionary.school.table.columns.actions.info}
                </DropdownMenuItem>
                {getPermission('update:school').granted && (
                  <DropdownMenuItem onClick={() => table.options.meta?.onRowEdit?.(row.original)}>
                    {dictionary.school.table.columns.actions.edit}
                  </DropdownMenuItem>
                )}
                {getPermission('delete:school').granted && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => table.options.meta?.onRowDelete?.(row.original)}
                    >
                      {dictionary.school.table.columns.actions.delete}
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
      onRowOpen,
      onRowEdit,
      onRowDelete,
      onPagination,
      onSorting,
      onSearch,
    },
  });

  return (
    <DataTable
      table={table}
      withPagination
      isLoading={isLoading}
      isInitialLoading={isInitialLoading}
      dictionary={dictionary.misc.table}
      toolbar={<SchoolDataTableToolbar table={table} dictionary={dictionary} />}
    />
  );
}
