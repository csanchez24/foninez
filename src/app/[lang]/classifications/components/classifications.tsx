'use client';

import type { Locale } from '@/i18n/config';
import type { ProofFileClassification } from './@types';

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
import { ProofFileClassificationFormSheet } from './classification-form';
import { ProofFileClassificationsDataTable } from './classifications-data-table';

import { useDataTableUtils } from '@/components/data-table';
import {
  useDeleteProofFileClassification,
  useGetProofFileClassifications,
} from '@/hooks/queries/use-proof-file-classification-queries';
import { usePermissions } from '@/hooks/use-permissions';
import { useStoreContext } from '@/store';
import { useCallback, useState } from 'react';

export const ProofFileClassifications = ({ lang: _lang }: { lang: Locale }) => {
  const dictionary = useStoreContext((state) => state.dictionary.proofFileClassification);
  const dictionaryMisc = useStoreContext((state) => state.dictionary.misc);

  const { getPermission } = usePermissions({
    include: ['manage:proofFileClassification'],
  });

  const { deboucedSearchText, sort, pagination, onSearch, onSorting, onPagination } =
    useDataTableUtils({ sort: { createdAt: 'desc' } });

  // Hooks for getting, updating, and deleting plans
  const { data, isInitialLoading, isFetching } = useGetProofFileClassifications({
    ...pagination,
    deboucedSearchText,
    sort,
  });
  const { mutateAsync: deleteProofFileClassification, isLoading: isDeleting } =
    useDeleteProofFileClassification();

  // Track selected row/plan in order to view/edit/remove
  const [proofFileClassification, setProofFileClassification] = useState<ProofFileClassification>();

  // State and handlers related to show/hide plan form side drawer
  const [openedProofFileClassificationFormSheet, setOpenedProofFileClassificationFormSheet] =
    useState(false);
  const handleProofFileClassificationFormSheetChange = useCallback(
    (open: boolean) => {
      if (!open) setProofFileClassification(undefined);
      setOpenedProofFileClassificationFormSheet(open);
    },
    [setProofFileClassification, setOpenedProofFileClassificationFormSheet]
  );

  // State and handlers to show/hide dialog needed to confirm plan deletion
  const [openedDeleteProofFileClassificationDialog, setOpenedDeleteProofFileClassificationDialog] =
    useState(false);
  const handleDeleteProofFileClassification = useCallback(async () => {
    if (!proofFileClassification?.id) return;
    await deleteProofFileClassification({ params: { id: proofFileClassification.id } });
    setProofFileClassification(undefined);
    setOpenedDeleteProofFileClassificationDialog(false);
  }, [
    proofFileClassification?.id,
    setProofFileClassification,
    setOpenedDeleteProofFileClassificationDialog,
    deleteProofFileClassification,
  ]);

  // Handle click on `open` action from the data table
  // Handle click on `edit` action from the data table
  const handleRowEditProofFileClassification = (row: ProofFileClassification) => {
    setProofFileClassification(row);
    setOpenedProofFileClassificationFormSheet(true);
  };

  // Handle click on `delete` action from the data table
  const handleRowDelete = (row: ProofFileClassification) => {
    setProofFileClassification(row);
    setOpenedDeleteProofFileClassificationDialog(true);
  };

  return (
    <Layout.Root>
      <Layout.Header>
        <div className="flex items-center justify-between gap-8">
          <Layout.Heading>{dictionary.layout.title}</Layout.Heading>

          <div className="flex gap-5">
            {getPermission('create:proofFileClassification').granted && (
              <Button onClick={() => handleProofFileClassificationFormSheetChange(true)}>
                {dictionary.buttons.new}
                <Icons.PlusCircled className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </Layout.Header>
      <Layout.Main>
        {/* ProofFileClassifications data table */}
        <ProofFileClassificationsDataTable
          data={data?.body}
          isLoading={!isInitialLoading && isFetching}
          isInitialLoading={isInitialLoading}
          sort={sort}
          pagination={pagination}
          onSorting={onSorting}
          onPagination={onPagination}
          onSearch={onSearch}
          onRowEdit={handleRowEditProofFileClassification}
          onRowDelete={handleRowDelete}
        />

        {/* ProofFileClassification form side drawer/sheet */}
        <ProofFileClassificationFormSheet
          proofFileClassification={proofFileClassification}
          opened={openedProofFileClassificationFormSheet}
          onOpened={handleProofFileClassificationFormSheetChange}
        />

        {/* Alert plan before deleting */}
        <AlertDialog open={openedDeleteProofFileClassificationDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{dictionaryMisc.dialogs.delete.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {dictionaryMisc.dialogs.delete.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => setOpenedDeleteProofFileClassificationDialog(false)}
              >
                {dictionaryMisc.dialogs.delete.buttons.cancel}
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={isDeleting}
                onClick={handleDeleteProofFileClassification}
              >
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
