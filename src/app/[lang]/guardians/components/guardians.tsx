'use client';

import type { Guardian } from './@types';

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
import { GuardianFormSheet } from './guardian-form';
import { GuardiansDataTable } from './guardians-data-table';

import { useRouter } from 'next/navigation';
import { useDataTableUtils } from '@/components/data-table';
import { useDeleteGuardian, useGetGuardians } from '@/hooks/queries/use-guardian-queries';
import { usePermissions } from '@/hooks/use-permissions';
import { useStoreContext } from '@/store';
import { GuardianInfoSheet } from './guardians-info';
import { GuardiansReport } from './guardians-report';

export const Guardians = () => {
  const dictionary = useStoreContext((state) => state.dictionary.guardian);
  const dictionaryMisc = useStoreContext((state) => state.dictionary.misc);
  const router = useRouter();

  const { getPermission } = usePermissions({ include: ['manage:guardian'] });

  const { deboucedSearchText, sort, pagination, onSearch, onSorting, onPagination } =
    useDataTableUtils({ sort: { createdAt: 'desc' } });

  const { data, isInitialLoading, isFetching } = useGetGuardians({
    ...pagination,
    deboucedSearchText,
    sort,
  });

  const { mutateAsync: deleteGuardian, isLoading: isDeleting } = useDeleteGuardian();

  // Track selected row/guardian to be view/edited/removed
  const [guardian, setGuardian] = React.useState<Guardian>();

  const [openedFormSheet, setOpenedFormSheet] = React.useState(false);
  const handleFormSheetChange = React.useCallback(
    (open: boolean) => {
      if (open === false) {
        setGuardian(undefined);
      }
      setOpenedFormSheet(open);
    },
    [setGuardian, setOpenedFormSheet]
  );

  const [openedDeleteDialog, setOpenedDeleteDialog] = React.useState(false);
  const handleDelete = React.useCallback(async () => {
    if (!guardian?.id) return;
    await deleteGuardian({ params: { id: guardian.id } });
    setGuardian(undefined);
    setOpenedDeleteDialog(false);
  }, [guardian?.id, setGuardian, setOpenedDeleteDialog, deleteGuardian]);

  const [openedInfoSheet, setOpenedInfoSheet] = React.useState(false);
  const handleInfoSheetChange = React.useCallback(
    (open: boolean) => {
      if (open === false) {
        setGuardian(undefined);
      }
      setOpenedInfoSheet(open);
    },
    [setGuardian, setOpenedInfoSheet]
  );

  const handleRowEdit = (row: Guardian) => {
    setGuardian(row);
    setOpenedFormSheet(true);
  };

  const handleRowDelete = (row: Guardian) => {
    setGuardian(row);
    setOpenedDeleteDialog(true);
  };

  const handleRowOpen = (row: Guardian) => {
    setGuardian(row);
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
            {getPermission('report:guardian').granted && <GuardiansReport />}
            {getPermission('create:guardian').granted && (
              <Button onClick={() => handleFormSheetChange(true)}>
                <Icons.PlusCircled className="mr-2 h-4 w-4" />
                {dictionary.buttons.new}
              </Button>
            )}
          </div>
        </div>
      </Layout.Header>
      <Layout.Main>
        {/* Guardian data table */}
        <GuardiansDataTable
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

        {/* Guardian form side drawer/sheet */}
        <GuardianFormSheet
          guardian={guardian}
          opened={openedFormSheet}
          onOpened={handleFormSheetChange}
        />

        <GuardianInfoSheet
          guardian={guardian}
          opened={openedInfoSheet}
          onOpened={handleInfoSheetChange}
        />

        {/* Alert guardian before deleting */}
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
