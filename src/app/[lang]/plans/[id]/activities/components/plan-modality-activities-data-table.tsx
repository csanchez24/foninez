import type { DataTableProps, UseDataTableUtilsReturn } from '@/components/data-table';
import type { Dictionary } from '@/i18n/get-dictionary';
import type { ColumnDef, RowData, Table, TableMeta } from '@tanstack/react-table';
import type { PlanModalityActivity, PlanModalityActivityPaginated } from './@types';

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
  }
}

function PlanModalityActivityDataTableToolbar({
  table,
  dictionary,
}: {
  table: Table<PlanModalityActivity>;
  dictionary: Dictionary;
}) {
  return (
    <div className="flex items-center justify-between">
      {/* prettier-ignore */}
      <DataTableSearchFilter table={table} dictionary={dictionary.planModalityActivity.table.toolbar.searchFilter} />
      <DataTableViewOptions
        table={table}
        dictionary={dictionary.planModalityActivity.table.toolbar.view}
      />
    </div>
  );
}

type PlanModalityActivitiesDataTableProps = Pick<
  TableMeta<PlanModalityActivity>,
  'onRowOpen' | 'onRowEdit' | 'onRowDelete' | 'onSearch' | 'onSorting' | 'onPagination'
> &
  Pick<DataTableProps<PlanModalityActivity>, 'isInitialLoading' | 'isLoading'> &
  Pick<UseDataTableUtilsReturn, 'pagination' | 'sort'> & {
    data?: PlanModalityActivityPaginated;
  };

export function PlanModalityActivitiesDataTable({
  data,
  sort,
  pagination,
  isLoading,
  isInitialLoading,
  onRowOpen,
  onRowEdit,
  onRowDelete,
  onSearch,
  onPagination,
  onSorting,
}: PlanModalityActivitiesDataTableProps) {
  const dictionary = useStoreContext((state) => state.dictionary);

  const { getPermission } = usePermissions({ include: ['manage:planModalityActivity'] });

  const columns: ColumnDef<PlanModalityActivity>[] = React.useMemo(
    () => [
      {
        accessorKey: 'name',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.planModalityActivity.table.columns.name}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">{row.getValue('name')}</span>
        ),
      },
      // {
      //   accessorKey: 'description',
      //   enableSorting: true,
      //   header: (props) => (
      //     <DataTableHeadWithSorting
      //       title={dictionary.planModalityActivity.table.columns.description}
      //       {...props}
      //     />
      //   ),
      //   cell: ({ row }) => (
      //     <span className="inline-block max-w-[300px] truncate">{row.getValue('description')}</span>
      //   ),
      // },
      {
        accessorKey: 'planModalityId',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.planModalityActivity.table.columns.planModalityId}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.planModality?.modality?.name ?? '-'}
          </span>
        ),
      },
      {
        accessorKey: 'requiredProofOfCompletionCount',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.planModalityActivity.table.columns.requiredProofOfCompletionCount}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.getValue('requiredProofOfCompletionCount')}
          </span>
        ),
      },
      {
        id: 'schoolsTotal',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.planModalityActivity.table.columns.schoolsTotal}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.planModalityActivitySchools?.length ?? 0}
          </span>
        ),
      },
      {
        id: 'participantsTotal',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.planModalityActivity.table.columns.participantsTotal}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.planModalityActivitySchools?.reduce((acc, cur) => {
              return acc + cur.participantsQty;
            }, 0)}
          </span>
        ),
      },
      {
        id: 'resourcesTotal',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.planModalityActivity.table.columns.resourcesTotal}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.planModalityActivityResources?.length ?? 0}
          </span>
        ),
      },
      {
        accessorKey: 'startDate',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.planModalityActivity.table.columns.startDate}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {formatDate(row.getValue('startDate'), 'y-MM-dd')}
          </span>
        ),
      },
      {
        accessorKey: 'endDate',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.planModalityActivity.table.columns.endDate}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {formatDate(row.getValue('endDate'), 'y-MM-dd')}
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
                {getPermission('read:planModalityActivity').granted && (
                  <DropdownMenuItem onClick={() => table.options.meta?.onRowOpen?.(row.original)}>
                    {dictionary.planModalityActivity.table.columns.actions.open}
                  </DropdownMenuItem>
                )}
                {getPermission('update:planModalityActivity').granted &&
                  (row.original.plan?.status === 'draft' ||
                    row.original.plan?.status === 'rejected') && (
                    <DropdownMenuItem onClick={() => table.options.meta?.onRowEdit?.(row.original)}>
                      {dictionary.planModalityActivity.table.columns.actions.edit}
                    </DropdownMenuItem>
                  )}
                {getPermission('delete:planModalityActivity').granted &&
                  (row.original.plan?.status === 'draft' ||
                    row.original.plan?.status === 'rejected') && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => table.options.meta?.onRowDelete?.(row.original)}
                      >
                        {dictionary.planModalityActivity.table.columns.actions.delete}
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
      toolbar={<PlanModalityActivityDataTableToolbar table={table} dictionary={dictionary} />}
    />
  );
}
