import type { DataTableProps } from '@/components/data-table';
import type { Dictionary } from '@/i18n/get-dictionary';
import type { ColumnDef, Table } from '@tanstack/react-table';
import type { ActivitySchoolProofs, ActivitySchoolProof, Activity } from './@types';

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
import { formatDate } from '@/utils/format-date';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { ActivityProofInfo } from './activity-proof-info';

function DataTableToolbar({
  table,
  dictionary,
  setFilter,
}: {
  table: Table<ActivitySchoolProof>;
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
            dictionary.activity.info.tableResource.toolbar.searchFilter.input.placeholder
          }
          value={(table.getState().globalFilter as string) ?? ''}
          onChange={onChange}
          className="h-9 w-[150px] lg:w-[250px]"
        />
      </div>
    </div>
  );
}

function ProofsTable({
  data,
  isInitialLoading,
}: Pick<DataTableProps<ActivitySchoolProof>, 'isInitialLoading'> & {
  data?: ActivitySchoolProofs;
}) {
  const dictionary = useStoreContext((state) => state.dictionary);
  const [opened, setOpened] = React.useState(false);

  const [planModalityActivitySchoolsProofRow, setPlanModalityActivitySchoolProofRow] =
    React.useState<ActivitySchoolProof>();

  const columns: ColumnDef<ActivitySchoolProof>[] = React.useMemo(
    () => [
      {
        accessorKey: 'name',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.activity.info.tableProof.columns.note}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">{row.original.note ?? ''}</span>
        ),
      },
      {
        accessorKey: 'createdAt',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.activity.info.tableProof.columns.createdAt}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {formatDate(row.original?.createdAt ?? '', 'y-MM-dd')}
          </span>
        ),
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <div>
            <Button
              onClick={() => {
                setOpened(true);
                setPlanModalityActivitySchoolProofRow(row.original);
              }}
              variant="outline"
              size="icon"
            >
              <Icons.InfoCircled className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [dictionary]
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
    <>
      <DataTable
        table={table}
        isInitialLoading={isInitialLoading}
        dictionary={dictionary.misc.table}
        toolbar={
          <DataTableToolbar table={table} setFilter={setGlobalFilter} dictionary={dictionary} />
        }
      />
      <ActivityProofInfo
        activitySchoolProof={planModalityActivitySchoolsProofRow}
        opened={opened}
        onOpened={(open: boolean) => setOpened(open)}
      />
    </>
  );
}

export default function ActivityInfoTabsProofs({ activity }: { activity: Activity | undefined }) {
  return (
    <div>
      <div className="py-4">
        <ProofsTable data={activity?.planModalityActivitySchoolProofs ?? []} />
      </div>
    </div>
  );
}
