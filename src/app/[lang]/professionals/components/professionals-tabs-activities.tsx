import type { DataTableProps } from '@/components/data-table';
import type { Dictionary } from '@/i18n/get-dictionary';
import type { ColumnDef, Table } from '@tanstack/react-table';
import type { Activities, Activity, Professional } from './@types';

import { DataTable, DataTableHeadWithSorting } from '@/components/data-table';
import * as React from 'react';

import { useStoreContext } from '@/store';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Input } from '@/components/ui/input';

function DataTableToolbar({
  table,
  setFilter,
  dictionary,
}: {
  table: Table<Activity>;
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
            dictionary.professional.info.tableActivities.toolbar.searchFilter.input.placeholder
          }
          value={(table.getState().globalFilter as string) ?? ''}
          onChange={onChange}
          className="h-9 w-[150px] lg:w-[250px]"
        />
      </div>
    </div>
  );
}

function ProfessionalsTabsActivitiesTable({
  data,
  isInitialLoading,
}: Pick<DataTableProps<Activity>, 'isInitialLoading'> & {
  data?: Activities;
}) {
  const dictionary = useStoreContext((state) => state.dictionary);

  const dictionaryStatus = useStoreContext(
    (state) => state.dictionary.activity.table.columns.statuses.values
  );

  const columns: ColumnDef<Activity>[] = React.useMemo(
    () => [
      {
        accessorKey: 'planModalityActivitySchool.planModalityActivity.name',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.professional.info.tableActivities.columns.activity}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.planModalityActivitySchool?.planModalityActivity?.name ?? ''}
          </span>
        ),
      },
      {
        accessorKey: 'planModalityActivitySchool.school.name',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.professional.info.tableActivities.columns.school}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.planModalityActivitySchool?.school?.name ?? ''}
          </span>
        ),
      },
      {
        accessorKey: 'planModalityActivitySchool.participantsQty',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.professional.info.tableActivities.columns.qty}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.planModalityActivitySchool?.participantsQty ?? 0}
          </span>
        ),
      },
      {
        accessorKey: 'planModalityActivitySchool.status',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.professional.info.tableActivities.columns.status}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {
              dictionaryStatus.find(
                (s) => s.value === row.original.planModalityActivitySchool?.status
              )?.label
            }
          </span>
        ),
      },
    ],
    [dictionary, dictionaryStatus]
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

export default function ProfessionalsTabsActivities({
  professional,
}: {
  professional: Professional | undefined;
}) {
  return (
    <div>
      <div className="py-4">
        <ProfessionalsTabsActivitiesTable
          data={professional?.planModalityActivitySchoolProfessionals ?? []}
        />
      </div>
    </div>
  );
}
