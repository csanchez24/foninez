'use client';

import type { Child } from './@types';

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
import { ChildFormSheet } from './child-form';
import { ChildrenDataTable } from './childs-data-table';

import { useRouter } from 'next/navigation';
import { useDataTableUtils } from '@/components/data-table';
import { useDeleteChild, useGetChildren } from '@/hooks/queries/use-child-queries';
import { usePermissions } from '@/hooks/use-permissions';
import { useStoreContext } from '@/store';
import { ChildInfoSheet } from './children-info';
import { ChildrenReport } from './children-report';

export const Children = () => {
  const dictionary = useStoreContext((state) => state.dictionary.child);
  const dictionaryMisc = useStoreContext((state) => state.dictionary.misc);

  const router = useRouter();
  const { getPermission } = usePermissions({ include: ['manage:child'] });

  const { deboucedSearchText, sort, pagination, onSearch, onSorting, onPagination } =
    useDataTableUtils({ sort: { createdAt: 'desc' } });

  const { data, isInitialLoading, isFetching } = useGetChildren({
    ...pagination,
    deboucedSearchText,
    sort,
  });

  const { mutateAsync: deleteChild, isLoading: isDeleting } = useDeleteChild();

  // Track selected row/child to be view/edited/removed
  const [child, setChild] = React.useState<Child>();

  const [openedFormSheet, setOpenedFormSheet] = React.useState(false);
  const handleFormSheetChange = React.useCallback(
    (open: boolean) => {
      if (open === false) {
        setChild(undefined);
      }
      setOpenedFormSheet(open);
    },
    [setChild, setOpenedFormSheet]
  );

  const [openedDeleteDialog, setOpenedDeleteDialog] = React.useState(false);
  const handleDelete = React.useCallback(async () => {
    if (!child?.id) return;
    await deleteChild({ params: { id: child.id } });
    setChild(undefined);
    setOpenedDeleteDialog(false);
  }, [child?.id, setChild, setOpenedDeleteDialog, deleteChild]);

  const [openedInfoSheet, setOpenedInfoSheet] = React.useState(false);
  const handleInfoSheetChange = React.useCallback(
    (open: boolean) => {
      if (open === false) {
        setChild(undefined);
      }
      setOpenedInfoSheet(open);
    },
    [setChild, setOpenedInfoSheet]
  );

  const handleRowEdit = (row: Child) => {
    setChild(row);
    setOpenedFormSheet(true);
  };

  const handleRowDelete = (row: Child) => {
    setChild(row);
    setOpenedDeleteDialog(true);
  };

  const handleRowOpen = (row: Child) => {
    setChild(row);
    setOpenedInfoSheet(true);
  };

  return (
    <Layout.Root>
      <Layout.Header>
        <div className="flex items-center justify-between gap-8">
          <Layout.Heading>{dictionary.layout.title}</Layout.Heading>
          <div className="flex gap-5">
            {getPermission('report:child').granted && <ChildrenReport />}
            {getPermission('read:guardian').granted && (
              <Button onClick={() => router.push(`/guardians/`)}>
                <Icons.PlusCircled className="mr-2 h-4 w-4" />
                {dictionary.buttons.guardian}
              </Button>
            )}
            {getPermission('create:child').granted && (
              <Button onClick={() => handleFormSheetChange(true)}>
                <Icons.PlusCircled className="mr-2 h-4 w-4" />
                {dictionary.buttons.new}
              </Button>
            )}
          </div>
        </div>
      </Layout.Header>
      <Layout.Main>
        {/* Children data table */}
        <ChildrenDataTable
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

        {/* Child form side drawer/sheet */}
        <ChildFormSheet child={child} opened={openedFormSheet} onOpened={handleFormSheetChange} />

        <ChildInfoSheet child={child} opened={openedInfoSheet} onOpened={handleInfoSheetChange} />

        {/* Alert child before deleting */}
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
