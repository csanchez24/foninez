'use client';

import type { Resource } from './@types';

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
import { ResourceFormSheet } from './resource-form';
import { ResourcesDataTable } from './resources-data-table';

import { useRouter } from 'next/navigation';
import { useDataTableUtils } from '@/components/data-table';
import { useDeleteResource, useGetResources } from '@/hooks/queries/use-resource-queries';
import { usePermissions } from '@/hooks/use-permissions';
import { useStoreContext } from '@/store';
import { ResourceInfoSheet } from './resources-info';
import { ResourcesReport } from './resources-report';

export const Resources = () => {
  const dictionary = useStoreContext((state) => state.dictionary.resource);
  const dictionaryMisc = useStoreContext((state) => state.dictionary.misc);

  const router = useRouter();
  const { getPermission } = usePermissions({ include: ['manage:resource'] });

  const { deboucedSearchText, sort, pagination, onSearch, onSorting, onPagination } =
    useDataTableUtils({ sort: { createdAt: 'desc' } });

  const { data, isInitialLoading, isFetching } = useGetResources({
    ...pagination,
    deboucedSearchText,
    sort,
  });

  const { mutateAsync: deleteResource, isLoading: isDeleting } = useDeleteResource();

  // Track selected row/resource to be view/edited/removed
  const [resource, setResource] = React.useState<Resource>();

  const [openedFormSheet, setOpenedFormSheet] = React.useState(false);
  const handleFormSheetChange = React.useCallback(
    (open: boolean) => {
      if (open === false) {
        setResource(undefined);
      }
      setOpenedFormSheet(open);
    },
    [setResource, setOpenedFormSheet]
  );

  const [openedDeleteDialog, setOpenedDeleteDialog] = React.useState(false);
  const handleDelete = React.useCallback(async () => {
    if (!resource?.id) return;
    await deleteResource({ params: { id: resource.id } });
    setResource(undefined);
    setOpenedDeleteDialog(false);
  }, [resource?.id, setResource, setOpenedDeleteDialog, deleteResource]);

  const [openedInfoSheet, setOpenedInfoSheet] = React.useState(false);
  const handleInfoSheetChange = React.useCallback(
    (open: boolean) => {
      if (open === false) {
        setResource(undefined);
      }
      setOpenedInfoSheet(open);
    },
    [setResource, setOpenedInfoSheet]
  );

  const handleRowEdit = (row: Resource) => {
    setResource(row);
    setOpenedFormSheet(true);
  };

  const handleRowDelete = (row: Resource) => {
    setResource(row);
    setOpenedDeleteDialog(true);
  };

  const handleRowOpen = (row: Resource) => {
    setResource(row);
    setOpenedInfoSheet(true);
  };

  return (
    <Layout.Root>
      <Layout.Header>
        <div className="flex items-center justify-between gap-8">
          <Layout.Heading>{dictionary.layout.title}</Layout.Heading>
          <div className="flex gap-5">
            {getPermission('report:resource').granted && <ResourcesReport />}
            {getPermission('read:supplier').granted && (
              <Button onClick={() => router.push(`/suppliers/`)}>
                <Icons.PlusCircled className="mr-2 h-4 w-4" />
                {dictionary.buttons.suppliers}
              </Button>
            )}
            {getPermission('create:resource').granted && (
              <Button onClick={() => handleFormSheetChange(true)}>
                <Icons.PlusCircled className="mr-2 h-4 w-4" />
                {dictionary.buttons.new}
              </Button>
            )}
          </div>
        </div>
      </Layout.Header>
      <Layout.Main>
        {/* Resources data table */}
        <ResourcesDataTable
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

        {/* Resource form side drawer/sheet */}
        <ResourceFormSheet
          resource={resource}
          opened={openedFormSheet}
          onOpened={handleFormSheetChange}
        />

        <ResourceInfoSheet
          resource={resource}
          opened={openedInfoSheet}
          onOpened={handleInfoSheetChange}
        />

        {/* Alert resource before deleting */}
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
