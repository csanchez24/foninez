import type { DataTableProps, UseDataTableUtilsReturn } from '@/components/data-table';
import type { Dictionary } from '@/i18n/get-dictionary';
import type { ColumnDef, RowData, Table, TableMeta } from '@tanstack/react-table';
import type { Plan, PlanPaginated } from './@types';

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
    onRowCreateActivity?(rowData: TData): void;
    onRowViewActivities?(rowData: TData): void;
  }
}

function PlanStatusIcon({ status }: { status: NonNullable<Plan['status']> }) {
  const icons = {
    draft: Icons.Circle,
    approved: Icons.CheckCircle,
    rejected: Icons.CrossCircled,
    reviewed: Icons.InfoCircled,
    'pending review': Icons.Stopwatch,
  } satisfies Record<NonNullable<Plan['status']>, (typeof Icons)[keyof typeof Icons]>;
  const Icon = icons[status];
  return <Icon className="mr-2 h-5 w-4" />;
}

function PlanDataTableToolbar({
  table,
  dictionary,
}: {
  table: Table<Plan>;
  dictionary: Dictionary;
}) {
  return (
    <div className="flex items-center justify-between">
      {/* prettier-ignore */}
      <DataTableSearchFilter table={table} dictionary={dictionary.plan.table.toolbar.searchFilter} />
      <DataTableViewOptions table={table} dictionary={dictionary.plan.table.toolbar.view} />
    </div>
  );
}

type PlansDataTableProps = Pick<
  TableMeta<Plan>,
  | 'onRowOpen'
  | 'onRowEdit'
  | 'onRowDelete'
  | 'onSearch'
  | 'onSorting'
  | 'onPagination'
  | 'onRowCreateActivity'
  | 'onRowViewActivities'
> &
  Pick<DataTableProps<Plan>, 'isInitialLoading' | 'isLoading'> &
  Pick<UseDataTableUtilsReturn, 'pagination' | 'sort'> & {
    data?: PlanPaginated;
  };

export function PlansDataTable({
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
  onRowCreateActivity,
  onRowViewActivities,
}: PlansDataTableProps) {
  const dictionary = useStoreContext((state) => state.dictionary);
  const dictionaryStatuses = useStoreContext(
    (state) => state.dictionary.plan.table.columns.status.values
  );

  const { getPermission } = usePermissions({ include: ['manage:plan'] });

  const columns: ColumnDef<Plan>[] = React.useMemo(
    () => [
      {
        accessorKey: 'year',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting title={dictionary.plan.table.columns.year} {...props} />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">{row.getValue('year')}</span>
        ),
      },
      {
        accessorKey: 'programId',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting title={dictionary.plan.table.columns.program} {...props} />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.program?.name ?? ''}
          </span>
        ),
      },
      {
        accessorKey: 'longTermObjective',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.plan.table.columns.longTermObjective}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.getValue('longTermObjective')}
          </span>
        ),
      },
      {
        accessorKey: 'shortTermObjective',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.plan.table.columns.shortTermObjective}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.getValue('shortTermObjective')}
          </span>
        ),
      },
      {
        accessorKey: 'justification',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.plan.table.columns.justification}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.getValue('justification')}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting title={dictionary.plan.table.columns.status.label} {...props} />
        ),
        cell: ({ row }) => (
          <span className="flex max-w-[300px] items-center truncate capitalize">
            <PlanStatusIcon status={row.original.status ?? 'draft'} />
            {dictionaryStatuses.find((s) => s.value === row.getValue('status'))?.label}
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
                {getPermission('read:plan').granted && (
                  <DropdownMenuItem onClick={() => table.options.meta?.onRowOpen?.(row.original)}>
                    {dictionary.plan.table.columns.actions.open}
                  </DropdownMenuItem>
                )}
                {getPermission('update:plan').granted &&
                  (row.original.status === 'draft' || row.original.status === 'rejected') && (
                    <DropdownMenuItem onClick={() => table.options.meta?.onRowEdit?.(row.original)}>
                      {dictionary.plan.table.columns.actions.edit}
                    </DropdownMenuItem>
                  )}
                <>
                  <DropdownMenuSeparator />
                  {getPermission('read:planModalityActivity').granted && (
                    <DropdownMenuItem
                      onClick={() => table.options.meta?.onRowViewActivities?.(row.original)}
                    >
                      {dictionary.plan.table.columns.actions.viewActivities}
                    </DropdownMenuItem>
                  )}
                  {getPermission('create:planModalityActivity').granted &&
                    (row.original.status === 'draft' || row.original.status === 'rejected') && (
                      <DropdownMenuItem
                        onClick={() => table.options.meta?.onRowCreateActivity?.(row.original)}
                      >
                        {dictionary.plan.table.columns.actions.createActivity}
                      </DropdownMenuItem>
                    )}
                </>
                {getPermission('delete:plan').granted &&
                  (row.original.status === 'draft' || row.original.status === 'rejected') && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => table.options.meta?.onRowDelete?.(row.original)}
                      >
                        {dictionary.plan.table.columns.actions.delete}
                      </DropdownMenuItem>
                    </>
                  )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [dictionary, dictionaryStatuses, getPermission]
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
      onRowCreateActivity,
      onRowViewActivities,
    },
  });

  return (
    <DataTable
      table={table}
      withPagination
      isLoading={isLoading}
      isInitialLoading={isInitialLoading}
      dictionary={dictionary.misc.table}
      toolbar={<PlanDataTableToolbar table={table} dictionary={dictionary} />}
    />
  );
}
