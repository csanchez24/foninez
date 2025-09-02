import type { Dictionary } from '@/i18n/get-dictionary';
import type { ColumnDef, Table } from '@tanstack/react-table';
import type { PlanModalityActivity } from './@types';

import { DataTable, DataTableHeadWithSorting } from '@/components/data-table';
import { Input } from '@/components/ui/input';
import * as React from 'react';

import { useStoreContext } from '@/store';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

type PlanModalityActivityProofFile = NonNullable<
  PlanModalityActivity['planModalityActivityProofFiles']
>[number];

function DataTableToolbar({
  table,
  dictionary,
  setFilter,
}: {
  table: Table<PlanModalityActivityProofFile>;
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
            dictionary.planModalityActivity.info.proofFiles.table.toolbar.searchFilter.input
              .placeholder
          }
          value={(table.getState().globalFilter as string) ?? ''}
          onChange={onChange}
          className="h-9 w-[150px] lg:w-[250px]"
        />
      </div>
    </div>
  );
}

export default function PlanModalityActivityInfoTabsProofFiles({
  planModalityActivity,
}: {
  planModalityActivity?: PlanModalityActivity | undefined;
}) {
  const dictionary = useStoreContext((state) => state.dictionary);

  const columns: ColumnDef<PlanModalityActivityProofFile>[] = React.useMemo(
    () => [
      {
        id: 'classification',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.planModalityActivity.info.proofFiles.table.columns.classification}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.proofFileClassification?.name ?? ''}
          </span>
        ),
      },
    ],
    [dictionary]
  );

  const defaultData = React.useMemo(() => [], []);
  const [globalFilter, setGlobalFilter] = React.useState<string>();

  const table = useReactTable({
    columns,
    data: planModalityActivity?.planModalityActivityProofFiles ?? defaultData,
    enableFilters: true,
    enableSorting: true,
    enableRowSelection: false,
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    enableGlobalFilter: true,
    globalFilterFn: 'auto',
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div>
      <div className="py-4">
        <DataTable
          table={table}
          isInitialLoading={false}
          dictionary={dictionary.misc.table}
          toolbar={
            <DataTableToolbar table={table} setFilter={setGlobalFilter} dictionary={dictionary} />
          }
        />
      </div>
    </div>
  );
}
