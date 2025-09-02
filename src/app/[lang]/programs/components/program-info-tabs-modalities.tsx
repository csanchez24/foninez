import type { Dictionary } from '@/i18n/get-dictionary';
import type { ColumnDef, Table } from '@tanstack/react-table';
import type { Program } from './@types';

import { DataTable, DataTableHeadWithSorting } from '@/components/data-table';
import { Input } from '@/components/ui/input';
import * as React from 'react';

import { useStoreContext } from '@/store';
import { formatDate } from '@/utils/format-date';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

type Modality = NonNullable<Program['modalities']>[number];

function DataTableToolbar({
  table,
  dictionary,
  setFilter,
}: {
  table: Table<Modality>;
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
          placeholder={dictionary.activity.info.tableResource.toolbar.searchFilter.input.placeholder}
          value={(table.getState().globalFilter as string) ?? ''}
          onChange={onChange}
          className="h-9 w-[150px] lg:w-[250px]"
        />
      </div>
    </div>
  );
}

export default function ProgramInfoTabsModalities({ program }: { program?: Program | undefined }) {
  const dictionary = useStoreContext((state) => state.dictionary);

  const columns: ColumnDef<Modality>[] = React.useMemo(
    () => [
      {
        accessorKey: 'name',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.program.info.modalitiesTab.table.columns.name}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">{row.getValue('name') ?? ''}</span>
        ),
      },
      {
        accessorKey: 'description',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.program.info.modalitiesTab.table.columns.description}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">{row.getValue('description')}</span>
        ),
      },
      {
        accessorKey: 'createdAt',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.program.info.modalitiesTab.table.columns.createdAt}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {formatDate(row.getValue('createdAt'), 'yyyy-mm-dd')}
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
    data: program?.modalities ?? defaultData,
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
          withPagination={true}
          toolbar={
            <DataTableToolbar table={table} setFilter={setGlobalFilter} dictionary={dictionary} />
          }
        />
      </div>
    </div>
  );
}
