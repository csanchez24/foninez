import type { DataTableProps, UseDataTableUtilsReturn } from '@/components/data-table';
import type { Dictionary } from '@/i18n/get-dictionary';
import type { ColumnDef, RowData, Table, TableMeta } from '@tanstack/react-table';
import type { Program, ProgramPaginated } from './@types';

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
    onRowCreateProgramModality?(rowData: TData): void;
    onRowOpenProgramModalities?(rowData: TData): void;
  }
}

function ProgramDataTableToolbar({
  table,
  dictionary,
}: {
  table: Table<Program>;
  dictionary: Dictionary;
}) {
  return (
    <div className="flex items-center justify-between">
      {/* prettier-ignore */}
      <DataTableSearchFilter table={table} dictionary={dictionary.program.table.toolbar.searchFilter} />
      <DataTableViewOptions table={table} dictionary={dictionary.program.table.toolbar.view} />
    </div>
  );
}

type ProgramsDataTableProps = Pick<
  TableMeta<Program>,
  | 'onRowOpen'
  | 'onRowEdit'
  | 'onRowDelete'
  | 'onSearch'
  | 'onSorting'
  | 'onPagination'
  | 'onRowCreateProgramModality'
  | 'onRowOpenProgramModalities'
> &
  Pick<DataTableProps<Program>, 'isInitialLoading' | 'isLoading'> &
  Pick<UseDataTableUtilsReturn, 'pagination' | 'sort'> & {
    data?: ProgramPaginated;
  };

export function ProgramsDataTable({
  data,
  sort,
  pagination,
  isLoading,
  isInitialLoading,
  onRowOpen,
  onRowEdit,
  onRowDelete,
  onRowCreateProgramModality,
  onRowOpenProgramModalities,
  onSearch,
  onPagination,
  onSorting,
}: ProgramsDataTableProps) {
  const dictionary = useStoreContext((state) => state.dictionary);

  const { getPermission } = usePermissions({ include: ['manage:program'] });

  const columns: ColumnDef<Program>[] = React.useMemo(
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
        accessorKey: 'description',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.program.table.columns.description}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">{row.getValue('description')}</span>
        ),
      },
      {
        accessorKey: 'createdAt',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting title={dictionary.program.table.columns.createdAt} {...props} />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {formatDate(row.getValue('createdAt'), 'y-MM-dd')}
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
                {getPermission('read:program').granted && (
                  <DropdownMenuItem onClick={() => table.options.meta?.onRowOpen?.(row.original)}>
                    {dictionary.program.table.columns.actions.open}
                  </DropdownMenuItem>
                )}
                {getPermission('update:program').granted && (
                  <DropdownMenuItem onClick={() => table.options.meta?.onRowEdit?.(row.original)}>
                    {dictionary.program.table.columns.actions.edit}
                  </DropdownMenuItem>
                )}
                {getPermission(['read:modality', 'create:modality']).granted && (
                  <>
                    <DropdownMenuSeparator />
                    {getPermission('read:modality').granted && (
                      <DropdownMenuItem
                        onClick={() =>
                          table.options.meta?.onRowOpenProgramModalities?.(row.original)
                        }
                      >
                        {dictionary.program.table.columns.actions.openModalities}
                      </DropdownMenuItem>
                    )}
                    {getPermission('create:modality').granted && (
                      <DropdownMenuItem
                        onClick={() =>
                          table.options.meta?.onRowCreateProgramModality?.(row.original)
                        }
                      >
                        {dictionary.program.table.columns.actions.createModality}
                      </DropdownMenuItem>
                    )}
                  </>
                )}
                {getPermission('delete:program').granted && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => table.options.meta?.onRowDelete?.(row.original)}
                    >
                      {dictionary.program.table.columns.actions.delete}
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
      onRowCreateProgramModality,
      onRowOpenProgramModalities,
    },
  });

  return (
    <DataTable
      table={table}
      withPagination
      isLoading={isLoading}
      isInitialLoading={isInitialLoading}
      dictionary={dictionary.misc.table}
      toolbar={<ProgramDataTableToolbar table={table} dictionary={dictionary} />}
    />
  );
}
