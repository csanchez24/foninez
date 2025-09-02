'use client';

import type { InventoryTransaction } from './@types';

import { Icons } from '@/components/icons';
import * as Layout from '@/components/layout';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import * as React from 'react';
import { InventoryTransactionFormSheet } from './inventory-transaction-form';
import { InventoryTransactionsDataTable } from './inventory-transactions-data-table';

import { useDataTableUtils } from '@/components/data-table';
import {
  type getInventoryTransactionsQueryKey,
  useDeleteInventoryTransaction,
  useGetInventoryTransactions,
} from '@/hooks/queries/use-inventory-transaction-queries';
import { usePermissions } from '@/hooks/use-permissions';
import { useStoreContext } from '@/store';
import { InventoryTransactionInfoSheet } from './inventory-transactions-info';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DenyForm } from './deny-form';
import { ApproveForm } from './approve-form';
import { InvoiceForm } from './add-invoice-form';
import { InventoryTransactionsReport } from './inventory-transactions-report';

export const InventoryTransactions = () => {
  const dictionary = useStoreContext((state) => state.dictionary.inventoryTransaction);
  const dictionaryMisc = useStoreContext((state) => state.dictionary.misc);

  const [queryWhere, setQueryWhere] =
    React.useState<NonNullable<Parameters<typeof getInventoryTransactionsQueryKey>[0]>['where']>(
      undefined
    );

  const { getPermission } = usePermissions({ include: ['manage:inventoryTransaction'] });

  const { deboucedSearchText, sort, pagination, onSearch, onSorting, onPagination } =
    useDataTableUtils({ sort: { createdAt: 'desc' } });

  const { data, isInitialLoading, isFetching } = useGetInventoryTransactions({
    ...pagination,
    deboucedSearchText,
    sort,
    where: queryWhere,
  });

  const { mutateAsync: deleteInventoryTransaction, isLoading: isDeleting } =
    useDeleteInventoryTransaction();

  // Track selected row/inventoryTransaction to be view/edited/removed
  const [inventoryTransaction, setInventoryTransaction] = React.useState<InventoryTransaction>();

  const [openedFormSheet, setOpenedFormSheet] = React.useState(false);
  const handleFormSheetChange = React.useCallback(
    (open: boolean) => {
      if (open === false) {
        setInventoryTransaction(undefined);
      }
      setOpenedFormSheet(open);
    },
    [setInventoryTransaction, setOpenedFormSheet]
  );

  const [openedDeleteDialog, setOpenedDeleteDialog] = React.useState(false);
  const handleDelete = React.useCallback(async () => {
    if (!inventoryTransaction?.id) return;
    await deleteInventoryTransaction({ params: { id: inventoryTransaction.id } });
    setInventoryTransaction(undefined);
    setOpenedDeleteDialog(false);
  }, [
    inventoryTransaction?.id,
    setInventoryTransaction,
    setOpenedDeleteDialog,
    deleteInventoryTransaction,
  ]);

  const [openedInfoSheet, setOpenedInfoSheet] = React.useState(false);
  const handleInfoSheetChange = React.useCallback(
    (open: boolean) => {
      if (open === false) {
        setInventoryTransaction(undefined);
      }
      setOpenedInfoSheet(open);
    },
    [setInventoryTransaction, setOpenedInfoSheet]
  );

  const [denyRowDialog, setDenyRowDialog] = React.useState(false);
  const onDenyDialogChange = React.useCallback((open: boolean) => {
    if (open === false) setInventoryTransaction(undefined);
    setDenyRowDialog(open);
  }, []);

  const [approveRowDialog, setApproveRowDialog] = React.useState(false);
  const onApproveDialogChange = React.useCallback((open: boolean) => {
    if (open === false) setInventoryTransaction(undefined);
    setApproveRowDialog(open);
  }, []);

  const [invoiceRowDialog, setInvoiceRowDialog] = React.useState(false);
  const onInvoiceDialogChange = React.useCallback((open: boolean) => {
    if (open === false) setInventoryTransaction(undefined);
    setInvoiceRowDialog(open);
  }, []);

  const handleRowEdit = (row: InventoryTransaction) => {
    setInventoryTransaction(row);
    setOpenedFormSheet(true);
  };

  const handleRowDelete = (row: InventoryTransaction) => {
    setInventoryTransaction(row);
    setOpenedDeleteDialog(true);
  };

  const handleRowOpen = (row: InventoryTransaction) => {
    setInventoryTransaction(row);
    setOpenedInfoSheet(true);
  };

  const handleApproveOpen = (row: InventoryTransaction) => {
    setInventoryTransaction(row);
    setApproveRowDialog(true);
  };

  const handleInvoiceOpen = (row: InventoryTransaction) => {
    setInventoryTransaction(row);
    setInvoiceRowDialog(true);
  };

  const handleDenyOpen = (row: InventoryTransaction) => {
    setInventoryTransaction(row);
    setDenyRowDialog(true);
  };

  return (
    <Layout.Root>
      <Layout.Header>
        <div className="flex items-center justify-between gap-8">
          <Layout.Heading>{dictionary.layout.title}</Layout.Heading>
          <div className="flex gap-5">
            {getPermission('report:inventoryTransaction').granted && (
              <InventoryTransactionsReport />
            )}
            {getPermission('create:inventoryTransaction').granted && (
              <Button onClick={() => handleFormSheetChange(true)}>
                <Icons.PlusCircled className="mr-2 h-4 w-4" />
                {dictionary.buttons.new}
              </Button>
            )}
          </div>
        </div>
      </Layout.Header>
      <Layout.Main>
        {/* InventoryTransactions data table */}
        <InventoryTransactionsDataTable
          data={data?.body}
          isLoading={!isInitialLoading && isFetching}
          isInitialLoading={isInitialLoading}
          sort={sort}
          pagination={pagination}
          onSorting={onSorting}
          onPagination={onPagination}
          onSearch={onSearch}
          onRowEdit={handleRowEdit}
          onRowDelete={handleRowDelete}
          onRowOpen={handleRowOpen}
          onAddInvoice={handleInvoiceOpen}
          onApprove={handleApproveOpen}
          onDeny={handleDenyOpen}
          onFacetedFilterStatus={(
            selections: Parameters<
              NonNullable<
                Parameters<typeof InventoryTransactionsDataTable>[0]['onFacetedFilterStatus']
              >
            >[0]
          ) => {
            setQueryWhere(
              !selections.length
                ? undefined
                : { ...queryWhere, status: { in: selections.map((s) => s.value) } }
            );
          }}
          onFacetedFilterTypes={(
            selections: Parameters<
              NonNullable<
                Parameters<typeof InventoryTransactionsDataTable>[0]['onFacetedFilterTypes']
              >
            >[0]
          ) => {
            setQueryWhere(
              !selections.length
                ? undefined
                : { ...queryWhere, type: { in: selections.map((s) => s.value) } }
            );
          }}
        />

        {/* InventoryTransaction form side drawer/sheet */}
        <InventoryTransactionFormSheet
          inventoryTransaction={inventoryTransaction}
          opened={openedFormSheet}
          onOpened={handleFormSheetChange}
        />

        <InventoryTransactionInfoSheet
          inventoryTransaction={inventoryTransaction}
          opened={openedInfoSheet}
          onOpened={handleInfoSheetChange}
        />

        <Dialog open={denyRowDialog} onOpenChange={onDenyDialogChange}>
          <DialogContent>
            <DenyForm
              inventoryTransaction={inventoryTransaction}
              onSuccess={() => {
                setDenyRowDialog(false);
                setInventoryTransaction(undefined);
                return;
              }}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={approveRowDialog} onOpenChange={onApproveDialogChange}>
          <DialogContent>
            <ApproveForm
              inventoryTransaction={inventoryTransaction}
              onSuccess={() => {
                setApproveRowDialog(false);
                setInventoryTransaction(undefined);
                return;
              }}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={invoiceRowDialog} onOpenChange={onInvoiceDialogChange}>
          <DialogContent>
            <InvoiceForm
              inventoryTransaction={inventoryTransaction}
              onSuccess={() => {
                setInvoiceRowDialog(false);
                setInventoryTransaction(undefined);
                return;
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Alert inventoryTransaction before deleting */}
        <AlertDialog open={openedDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{dictionaryMisc.dialogs.delete.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {dictionaryMisc.dialogs.delete.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpenedDeleteDialog(false)}>
                {dictionaryMisc.dialogs.delete.buttons.cancel}
              </AlertDialogCancel>
              <AlertDialogAction disabled={isDeleting} onClick={handleDelete}>
                {isDeleting && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
                {dictionaryMisc.dialogs.delete.buttons.continue}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Layout.Main>
    </Layout.Root>
  );
};
