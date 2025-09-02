import type { DataTableProps, UseDataTableUtilsReturn } from '@/components/data-table';
import type { Dictionary } from '@/i18n/get-dictionary';
import type { ColumnDef, RowData, Table, TableMeta } from '@tanstack/react-table';
import type { Activity, ActivityPaginated } from './@types';

import {
  DataTable,
  DataTableFacetedFilter,
  DataTableHeadWithSorting,
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import * as React from 'react';

import { usePermissions } from '@/hooks/use-permissions';
import { useStoreContext } from '@/store';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useGetSchools } from '@/hooks/queries/use-school-queries';
import { useGetPlanModalityActivities } from '@/hooks/queries/use-plan-modality-activity-queries';

declare module '@tanstack/table-core' {
  interface TableMeta<TData extends RowData> {
    onRowOpen?(rowData: TData): void;
    onStartActivity?(rowData: TData): void;
    onRequestResources?(rowData: TData): void;
    onConfirmResources?(rowData: TData): void;
    onComplete?(rowData: TData): void;
    onVerify?(rowData: TData): void;
    onReject?(rowData: TData): void;
    onFacetedFilterStatus?: (options: { value: string; label: string }[]) => void;
    onFacetedFilterSchool?: (options: { value: string; label: string }[]) => void;
    onFacetedFilterActivity?: (options: { value: string; label: string }[]) => void;
    onGoToRegister?(rowData: TData): void;
    onPlanning?(rowData: TData): void;
    onProof?(rowData: TData): void;
    onStartPlanning?(rowData: TData): void;
  }
}

function ActivityDataTableToolbar({
  table,
  dictionary,
}: {
  table: Table<Activity>;
  dictionary: Dictionary;
}) {
  const { data: schools } = useGetSchools({ limit: 1000 });
  const { data: activities } = useGetPlanModalityActivities({ limit: 10000 });

  const onFacetedFilterStatus = React.useCallback(
    (options: { value: string; label: string }[]) => {
      return table.options.meta?.onFacetedFilterStatus?.(options);
    },
    [table.options.meta]
  );

  const onFacetedFilterSchool = React.useCallback(
    (options: { value: string; label: string }[]) => {
      return table.options.meta?.onFacetedFilterSchool?.(options);
    },
    [table.options.meta]
  );

  const onFacetedFilterActivity = React.useCallback(
    (options: { value: string; label: string }[]) => {
      return table.options.meta?.onFacetedFilterActivity?.(options);
    },
    [table.options.meta]
  );

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <DataTableFacetedFilter
          title={dictionary.activity.table.filters.status}
          options={dictionary.activity.table.columns.statuses.values}
          onFacetedFilter={onFacetedFilterStatus}
        />
        <DataTableFacetedFilter
          title={dictionary.activity.table.filters.school}
          options={
            schools?.body?.data?.map((c) => {
              return { value: c.id.toString(), label: c.name };
            }) ?? []
          }
          onFacetedFilter={onFacetedFilterSchool}
        />
        <DataTableFacetedFilter
          title={dictionary.activity.table.filters.activity}
          options={
            activities?.body?.data?.map((a) => {
              return { value: a.id.toString(), label: a.name };
            }) ?? []
          }
          onFacetedFilter={onFacetedFilterActivity}
        />
      </div>
      <DataTableViewOptions table={table} dictionary={dictionary.activity.table.toolbar.view} />
    </div>
  );
}

export function ActivitiesDataTable({
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
  onGoToRegister,
  onFacetedFilterStatus,
  onFacetedFilterSchool,
  onFacetedFilterActivity,
  onComplete,
  onVerify,
  onReject,
  onConfirmResources,
  onRequestResources,
  onPlanning,
  onProof,
  onRowOpen,
  onStartActivity,
  onStartPlanning,
}: Pick<
  TableMeta<Activity>,
  | 'onGoToRegister'
  | 'onRowEdit'
  | 'onRowDelete'
  | 'onSearch'
  | 'onSorting'
  | 'onPagination'
  | 'onFacetedFilterStatus'
  | 'onFacetedFilterSchool'
  | 'onFacetedFilterActivity'
  | 'onComplete'
  | 'onVerify'
  | 'onReject'
  | 'onRequestResources'
  | 'onConfirmResources'
  | 'onPlanning'
  | 'onProof'
  | 'onRowOpen'
  | 'onStartActivity'
  | 'onStartPlanning'
> &
  Pick<DataTableProps<Activity>, 'isInitialLoading' | 'isLoading'> &
  Pick<UseDataTableUtilsReturn, 'pagination' | 'sort'> & {
    data?: ActivityPaginated;
  }) {
  const dictionary = useStoreContext((state) => state.dictionary);
  const dictionaryStatus = useStoreContext(
    (state) => state.dictionary.activity.table.columns.statuses.values
  );

  const { getPermission } = usePermissions({ include: ['manage:planModalityActivitySchool'] });

  const columns: ColumnDef<Activity>[] = React.useMemo(
    () => [
      {
        accessorKey: 'school',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting title={dictionary.activity.table.columns.school} {...props} />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">{row.original?.school?.name}</span>
        ),
      },
      {
        accessorKey: 'plan',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting title={dictionary.activity.table.columns.activity} {...props} />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.planModalityActivity?.name}
          </span>
        ),
      },
      {
        accessorKey: 'participants_qty',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.activity.table.columns.participants}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.participantsQty}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.activity.table.columns.statuses.label}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {dictionaryStatus.find((s) => s.value === row.getValue('status'))?.label}
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
                  {dictionary.activity.table.columns.actions.info}
                </DropdownMenuItem>
                {getPermission('planning:planModalityActivitySchool').granted &&
                  row.original.status === 'pending' && (
                    <DropdownMenuItem
                      onClick={() => table.options.meta?.onStartPlanning?.(row.original)}
                    >
                      {dictionary.activity.table.columns.actions.startPlanning}
                    </DropdownMenuItem>
                  )}
                {getPermission('planning:planModalityActivitySchool').granted &&
                  ['completed', 'planning', 'requested_resources', 'confirmed_resources'].includes(
                    row.original.status
                  ) && (
                    <DropdownMenuItem
                      onClick={() => table.options.meta?.onPlanning?.(row.original)}
                    >
                      {dictionary.activity.table.columns.actions.planning}
                    </DropdownMenuItem>
                  )}
                {getPermission('register:planModalityActivitySchool').granted &&
                  row.original.status === 'planning' && (
                    <DropdownMenuItem
                      onClick={() => table.options.meta?.onGoToRegister?.(row.original)}
                    >
                      {dictionary.activity.table.columns.actions.register}
                    </DropdownMenuItem>
                  )}
                {getPermission('request_resources:planModalityActivitySchool').granted &&
                  row.original.status === 'planning' && (
                    <DropdownMenuItem
                      onClick={() => table.options.meta?.onRequestResources?.(row.original)}
                    >
                      {dictionary.activity.table.columns.actions.requestResources}
                    </DropdownMenuItem>
                  )}
                {getPermission('confirmed_resources:planModalityActivitySchool').granted &&
                  row.original.status === 'requested_resources' && (
                    <DropdownMenuItem
                      onClick={() => table.options.meta?.onConfirmResources?.(row.original)}
                    >
                      {dictionary.activity.table.columns.actions.confirmResources}
                    </DropdownMenuItem>
                  )}
                {getPermission('startActivity:planModalityActivitySchool').granted &&
                  row.original.status === 'confirmed_resources' && (
                    <DropdownMenuItem
                      onClick={() => table.options.meta?.onStartActivity?.(row.original)}
                    >
                      {dictionary.activity.table.columns.actions.startActivity}
                    </DropdownMenuItem>
                  )}
                {getPermission('addProof:planModalityActivitySchool').granted &&
                ((row.original.status === 'active' &&
                  row.original.planModalityActivitySchoolProofs?.length !==
                    row.original.planModalityActivity?.requiredProofOfCompletionCount) ||
                  row.original.status === 'rejected') ? (
                  <DropdownMenuItem onClick={() => table.options.meta?.onProof?.(row.original)}>
                    {dictionary.activity.table.columns.actions.addProof} (
                    {row.original.planModalityActivitySchoolProofs?.length}/
                    {row.original.planModalityActivity?.requiredProofOfCompletionCount})
                  </DropdownMenuItem>
                ) : null}
                {getPermission('complete:planModalityActivitySchool').granted &&
                ((row.original.status === 'active' &&
                  (row.original.planModalityActivitySchoolProofs?.length ?? 0) >=
                    (row.original.planModalityActivity?.requiredProofOfCompletionCount ?? 0)) ||
                  row.original.status === 'rejected') ? (
                  <DropdownMenuItem onClick={() => table.options.meta?.onComplete?.(row.original)}>
                    {dictionary.activity.table.columns.actions.complete}
                  </DropdownMenuItem>
                ) : null}
                {getPermission('verify:planModalityActivitySchool').granted &&
                  row.original.status === 'completed' && (
                    <DropdownMenuItem onClick={() => table.options.meta?.onVerify?.(row.original)}>
                      {dictionary.activity.table.columns.actions.verify}
                    </DropdownMenuItem>
                  )}
                {getPermission('reject:planModalityActivitySchool').granted &&
                  row.original.status === 'completed' && (
                    <DropdownMenuItem onClick={() => table.options.meta?.onReject?.(row.original)}>
                      {dictionary.activity.table.columns.actions.reject}
                    </DropdownMenuItem>
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
      onRowEdit,
      onRowDelete,
      onPagination,
      onSorting,
      onSearch,
      onGoToRegister,
      onFacetedFilterStatus,
      onFacetedFilterSchool,
      onFacetedFilterActivity,
      onRequestResources,
      onConfirmResources,
      onComplete,
      onVerify,
      onReject,
      onPlanning,
      onProof,
      onRowOpen,
      onStartActivity,
      onStartPlanning,
    },
  });

  return (
    <DataTable
      table={table}
      withPagination
      isLoading={isLoading}
      isInitialLoading={isInitialLoading}
      dictionary={dictionary.misc.table}
      toolbar={<ActivityDataTableToolbar table={table} dictionary={dictionary} />}
    />
  );
}
