'use client';

import type { Supplier } from './@types';

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
import { SupplierFormSheet } from './supplier-form';
import { SuppliersDataTable } from './suppliers-data-table';

import { useRouter } from 'next/navigation';
import { useDataTableUtils } from '@/components/data-table';
import { useDeleteSupplier, useGetSuppliers } from '@/hooks/queries/use-supplier-queries';
import { usePermissions } from '@/hooks/use-permissions';
import { useStoreContext } from '@/store';
import { SupplierInfoSheet } from './suppliers-info';
import { SuppliersReport } from './suppliers-report';

export const Suppliers = () => {
  const dictionary = useStoreContext((state) => state.dictionary.supplier);
  const dictionaryMisc = useStoreContext((state) => state.dictionary.misc);
  const router = useRouter();

  const { getPermission } = usePermissions({ include: ['manage:supplier'] });

  const { deboucedSearchText, sort, pagination, onSearch, onSorting, onPagination } =
    useDataTableUtils({ sort: { createdAt: 'desc' } });

  const { data, isInitialLoading, isFetching } = useGetSuppliers({
    ...pagination,
    deboucedSearchText,
    sort,
  });

  const { mutateAsync: deleteSupplier, isLoading: isDeleting } = useDeleteSupplier();

  // Track selected row/supplier to be view/edited/removed
  const [supplier, setSupplier] = React.useState<Supplier>();

  const [openedFormSheet, setOpenedFormSheet] = React.useState(false);
  const handleFormSheetChange = React.useCallback(
    (open: boolean) => {
      if (open === false) {
        setSupplier(undefined);
      }
      setOpenedFormSheet(open);
    },
    [setSupplier, setOpenedFormSheet]
  );

  const [openedDeleteDialog, setOpenedDeleteDialog] = React.useState(false);
  const handleDelete = React.useCallback(async () => {
    if (!supplier?.id) return;
    await deleteSupplier({ params: { id: supplier.id } });
    setSupplier(undefined);
    setOpenedDeleteDialog(false);
  }, [supplier?.id, setSupplier, setOpenedDeleteDialog, deleteSupplier]);

  const [openedInfoSheet, setOpenedInfoSheet] = React.useState(false);
  const handleInfoSheetChange = React.useCallback(
    (open: boolean) => {
      if (open === false) {
        setSupplier(undefined);
      }
      setOpenedInfoSheet(open);
    },
    [setSupplier, setOpenedInfoSheet]
  );

  const handleRowEdit = (row: Supplier) => {
    setSupplier(row);
    setOpenedFormSheet(true);
  };

  const handleRowDelete = (row: Supplier) => {
    setSupplier(row);
    setOpenedDeleteDialog(true);
  };

  const handleRowOpen = (row: Supplier) => {
    setSupplier(row);
    setOpenedInfoSheet(true);
  };

  return (
    <Layout.Root>
      <Layout.Header>
        <div className="flex items-center justify-between gap-8">
          <Layout.Heading className="flex items-center space-x-2">
            <Button variant="link" className="p-0 text-muted-foreground" onClick={router.back}>
              <Icons.ArrowLeft className="mr-1 h-5 w-5" />
              <span className="text-xl">{dictionary.layout.back}</span>
            </Button>
            <Icons.ChevronRight className="h-4 w-4 text-muted-foreground" />
            {dictionary.layout.title}
          </Layout.Heading>
          <div className="flex gap-5">
            {getPermission('report:supplier').granted && <SuppliersReport />}
            {getPermission('create:supplier').granted && (
              <Button onClick={() => handleFormSheetChange(true)}>
                <Icons.PlusCircled className="mr-2 h-4 w-4" />
                {dictionary.buttons.new}
              </Button>
            )}
          </div>
        </div>
      </Layout.Header>
      <Layout.Main>
        {/* Supplier data table */}
        <SuppliersDataTable
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
        />

        {/* Supplier form side drawer/sheet */}
        <SupplierFormSheet
          supplier={supplier}
          opened={openedFormSheet}
          onOpened={handleFormSheetChange}
        />

        <SupplierInfoSheet
          supplier={supplier}
          opened={openedInfoSheet}
          onOpened={handleInfoSheetChange}
        />

        {/* Alert supplier before deleting */}
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
