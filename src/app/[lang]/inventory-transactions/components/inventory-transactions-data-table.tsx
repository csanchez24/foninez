import type { DataTableProps, UseDataTableUtilsReturn } from '@/components/data-table';
import type { Dictionary } from '@/i18n/get-dictionary';
import type { ColumnDef, RowData, Table, TableMeta } from '@tanstack/react-table';
import type { InventoryTransaction, InventoryTransactionPaginated } from './@types';

import {
  DataTable,
  DataTableFacetedFilter,
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
    onDeny?(rowData: TData): void;
    onApprove?(rowData: TData): void;
    onAddInvoice?(rowData: TData): void;
    onRowOpen?(rowData: TData): void;
    onRowEdit?(rowData: TData): void;
    onRowDelete?(rowData: TData): void;
    onFacetedFilterStatus?: (options: { value: string; label: string }[]) => void;
    onFacetedFilterTypes?: (options: { value: string; label: string }[]) => void;
  }
}

function InventoryTransactionDataTableToolbar({
  table,
  dictionary,
}: {
  table: Table<InventoryTransaction>;
  dictionary: Dictionary;
}) {
  const onFacetedFilterStatus = React.useCallback(
    (options: { value: string; label: string }[]) => {
      return table.options.meta?.onFacetedFilterStatus?.(options);
    },
    [table.options.meta]
  );

  const onFacetedFilterTypes = React.useCallback(
    (options: { value: string; label: string }[]) => {
      return table.options.meta?.onFacetedFilterTypes?.(options);
    },
    [table.options.meta]
  );

  return (
    <div className="flex items-center justify-between">
      {/* prettier-ignore */}
      <div className='flex gap-2 items-center'>
        <DataTableSearchFilter table={table} dictionary={dictionary.inventoryTransaction.table.toolbar.searchFilter} />
        <DataTableFacetedFilter
          title="Tipo"
          options={dictionary.inventoryTransaction.table.columns.type.values}
          onFacetedFilter={onFacetedFilterTypes}
        />
        <DataTableFacetedFilter
          title="Estado"
          options={dictionary.inventoryTransaction.table.columns.status.values}
          onFacetedFilter={onFacetedFilterStatus}
        />
      </div>
      <DataTableViewOptions
        table={table}
        dictionary={dictionary.inventoryTransaction.table.toolbar.view}
      />
    </div>
  );
}

export function InventoryTransactionsDataTable({
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
  onFacetedFilterStatus,
  onFacetedFilterTypes,
  onDeny,
  onApprove,
  onAddInvoice,
}: Pick<
  TableMeta<InventoryTransaction>,
  | 'onRowEdit'
  | 'onRowDelete'
  | 'onSearch'
  | 'onSorting'
  | 'onPagination'
  | 'onRowOpen'
  | 'onFacetedFilterStatus'
  | 'onFacetedFilterTypes'
  | 'onDeny'
  | 'onApprove'
  | 'onAddInvoice'
> &
  Pick<DataTableProps<InventoryTransaction>, 'isInitialLoading' | 'isLoading'> &
  Pick<UseDataTableUtilsReturn, 'pagination' | 'sort'> & {
    data?: InventoryTransactionPaginated;
  }) {
  const dictionary = useStoreContext((state) => state.dictionary);
  const dictionaryStatus = useStoreContext(
    (state) => state.dictionary.inventoryTransaction.table.columns.status.values
  );
  const dictionaryTypes = useStoreContext(
    (state) => state.dictionary.inventoryTransaction.table.columns.type.values
  );

  const { getPermission } = usePermissions({ include: ['manage:inventoryTransaction'] });

  const columns: ColumnDef<InventoryTransaction>[] = React.useMemo(
    () => [
      {
        accessorKey: 'type',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.inventoryTransaction.table.columns.type.label}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {dictionaryTypes.find((s) => s.value === row.getValue('type'))?.label}
          </span>
        ),
      },
      {
        accessorKey: 'orderNumber',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.inventoryTransaction.table.columns.orderNumber}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">{row.getValue('orderNumber')}</span>
        ),
      },
      {
        accessorKey: 'supplierInvoiceNumber',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.inventoryTransaction.table.columns.supplierInvoiceNumber}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.getValue('supplierInvoiceNumber')}
          </span>
        ),
      },
      {
        accessorKey: 'planModalityActivitySchool.planModalityActivity?.name',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.inventoryTransaction.table.columns.activity}
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
        accessorKey: 'note',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.inventoryTransaction.table.columns.note}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">{row.getValue('note')}</span>
        ),
      },
      {
        accessorKey: 'status',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.inventoryTransaction.table.columns.status.label}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {dictionaryStatus.find((s) => s.value === row.original.status)?.label}
          </span>
        ),
      },
      {
        accessorKey: 'resources',
        enableSorting: true,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.inventoryTransaction.table.columns.resources}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.inventoryTransactionLines?.length ?? 0}
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
                  {dictionary.professional.table.columns.actions.info}
                </DropdownMenuItem>
                {getPermission('update:inventoryTransaction').granted &&
                  row.original.status !== 'confirmed' && (
                    <DropdownMenuItem onClick={() => table.options.meta?.onRowEdit?.(row.original)}>
                      {dictionary.inventoryTransaction.table.columns.actions.edit}
                    </DropdownMenuItem>
                  )}
                {getPermission('invoice:inventoryTransaction').granted && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => table.options.meta?.onAddInvoice?.(row.original)}
                    >
                      {dictionary.inventoryTransaction.table.columns.actions.addInvoice}
                    </DropdownMenuItem>
                  </>
                )}
                {getPermission('confirm:inventoryTransaction').granted &&
                  row.original.status === 'pending' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => table.options.meta?.onApprove?.(row.original)}
                      >
                        {dictionary.inventoryTransaction.table.columns.actions.approve}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => table.options.meta?.onDeny?.(row.original)}>
                        {dictionary.inventoryTransaction.table.columns.actions.deny}
                      </DropdownMenuItem>
                    </>
                  )}
                {getPermission('delete:inventoryTransaction').granted && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => table.options.meta?.onRowDelete?.(row.original)}
                    >
                      {dictionary.inventoryTransaction.table.columns.actions.delete}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [dictionary, getPermission, dictionaryStatus, dictionaryTypes]
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
      onRowOpen,
      onFacetedFilterStatus,
      onFacetedFilterTypes,
      onApprove,
      onDeny,
      onAddInvoice,
    },
  });

  return (
    <DataTable
      table={table}
      withPagination
      isLoading={isLoading}
      isInitialLoading={isInitialLoading}
      dictionary={dictionary.misc.table}
      toolbar={<InventoryTransactionDataTableToolbar table={table} dictionary={dictionary} />}
    />
  );
}
