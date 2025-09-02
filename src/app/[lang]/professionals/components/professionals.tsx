'use client';

import type { Professional } from './@types';

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
import { ProfessionalFormSheet } from './professional-form';
import { ProfessionalsDataTable } from './professionals-data-table';

import { useDataTableUtils } from '@/components/data-table';
import {
  useDeleteProfessional,
  useGetProfessionals,
} from '@/hooks/queries/use-professional-queries';
import { usePermissions } from '@/hooks/use-permissions';
import { useStoreContext } from '@/store';
import { ProfessionalInfoSheet } from './professionals-info';
import { ProfessionalsReport } from './professionals-report';

export const Professionals = () => {
  const dictionary = useStoreContext((state) => state.dictionary.professional);
  const dictionaryMisc = useStoreContext((state) => state.dictionary.misc);

  const { getPermission } = usePermissions({ include: ['manage:professional'] });

  const { deboucedSearchText, sort, pagination, onSearch, onSorting, onPagination } =
    useDataTableUtils({ sort: { createdAt: 'desc' } });

  const { data, isInitialLoading, isFetching } = useGetProfessionals({
    ...pagination,
    deboucedSearchText,
    sort,
  });

  const { mutateAsync: deleteProfessional, isLoading: isDeleting } = useDeleteProfessional();

  // Track selected row/professional to be view/edited/removed
  const [professional, setProfessional] = React.useState<Professional>();

  const [openedFormSheet, setOpenedFormSheet] = React.useState(false);
  const handleFormSheetChange = React.useCallback(
    (open: boolean) => {
      if (open === false) {
        setProfessional(undefined);
      }
      setOpenedFormSheet(open);
    },
    [setProfessional, setOpenedFormSheet]
  );

  const [openedDeleteDialog, setOpenedDeleteDialog] = React.useState(false);
  const handleDelete = React.useCallback(async () => {
    if (!professional?.id) return;
    await deleteProfessional({ params: { id: professional.id } });
    setProfessional(undefined);
    setOpenedDeleteDialog(false);
  }, [professional?.id, setProfessional, setOpenedDeleteDialog, deleteProfessional]);

  const [openedInfoSheet, setOpenedInfoSheet] = React.useState(false);
  const handleInfoSheetChange = React.useCallback(
    (open: boolean) => {
      if (open === false) {
        setProfessional(undefined);
      }
      setOpenedInfoSheet(open);
    },
    [setProfessional, setOpenedInfoSheet]
  );

  const handleRowEdit = (row: Professional) => {
    setProfessional(row);
    setOpenedFormSheet(true);
  };

  const handleRowDelete = (row: Professional) => {
    setProfessional(row);
    setOpenedDeleteDialog(true);
  };

  const handleRowOpen = (row: Professional) => {
    setProfessional(row);
    setOpenedInfoSheet(true);
  };

  return (
    <Layout.Root>
      <Layout.Header>
        <div className="flex items-center justify-between gap-8">
          <Layout.Heading>{dictionary.layout.title}</Layout.Heading>
          <div className="flex gap-5">
            {getPermission('report:professional').granted && <ProfessionalsReport />}
            {getPermission('create:professional').granted && (
              <Button onClick={() => handleFormSheetChange(true)}>
                <Icons.PlusCircled className="mr-2 h-4 w-4" />
                {dictionary.buttons.new}
              </Button>
            )}
          </div>
        </div>
      </Layout.Header>
      <Layout.Main>
        {/* Professionals data table */}
        <ProfessionalsDataTable
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

        {/* Professional form side drawer/sheet */}
        <ProfessionalFormSheet
          professional={professional}
          opened={openedFormSheet}
          onOpened={handleFormSheetChange}
        />

        <ProfessionalInfoSheet
          professional={professional}
          opened={openedInfoSheet}
          onOpened={handleInfoSheetChange}
        />

        {/* Alert professional before deleting */}
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
