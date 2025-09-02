import type { DataTableProps } from '@/components/data-table';
import type { Dictionary } from '@/i18n/get-dictionary';
import type { ColumnDef, Table } from '@tanstack/react-table';
import type { Activities, Activity, School } from './@types';

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

function SchoolDataTableToolbar({
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
            dictionary.school.info.tableActivities.toolbar.searchFilter.input.placeholder
          }
          value={(table.getState().globalFilter as string) ?? ''}
          onChange={onChange}
          className="h-9 w-[150px] lg:w-[250px]"
        />
      </div>
    </div>
  );
}

function SchoolsTabsActivitiesTable({
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
        accessorKey: 'planModalityActivity.name',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.school.info.tableActivities.columns.activity}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.planModalityActivity?.name}
          </span>
        ),
      },
      {
        accessorKey: 'qty',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.school.info.tableActivities.columns.qty}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.participantsQty} -{' '}
            {row.original.planModalityActivitySchoolChildren?.filter(
              (c) => c.status === 'confirmed'
            ).length ?? 0}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.school.info.tableActivities.columns.status}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {dictionaryStatus.find((s) => s.value === row.original.status)?.label}
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
        <SchoolDataTableToolbar table={table} setFilter={setGlobalFilter} dictionary={dictionary} />
      }
    />
  );
}

export default function SchoolsTabsActivities({ school }: { school: School | undefined }) {
  return (
    <div>
      <div className="py-4">
        <SchoolsTabsActivitiesTable data={school?.planModalityActivitySchools ?? []} />
      </div>
    </div>
  );
}
