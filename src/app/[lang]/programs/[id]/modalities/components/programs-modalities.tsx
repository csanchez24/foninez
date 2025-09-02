'use client';

import type { Locale } from '@/i18n/config';
import type { Modality } from './@types';

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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { ProgramModalityFormSheet } from './program-modality-form';
import { ProgramModalityInfoSheet } from './program-modality-info';
import { ProgramModalitysDataTable } from './programs-data-table';

import { useDataTableUtils } from '@/components/data-table';
import { useDeleteModality, useGetModalities } from '@/hooks/queries/use-modality-queries';
import { useGetProgram } from '@/hooks/queries/use-program-queries';
import { usePermissions } from '@/hooks/use-permissions';
import { useStoreContext } from '@/store';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

export const ProgramModalities = ({ lang, programId }: { lang: Locale; programId: number }) => {
  const dictionary = useStoreContext((state) => state.dictionary.modality);
  const dictionaryMisc = useStoreContext((state) => state.dictionary.misc);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const { getPermission } = usePermissions({ include: ['manage:modality'] });

  // This is prefetched before hand in the server call
  const programResp = useGetProgram(programId);

  const { deboucedSearchText, sort, pagination, onSearch, onSorting, onPagination } =
    useDataTableUtils({ sort: { createdAt: 'desc' } });

  // Hooks for getting, updating, and deleting
  const { data, isInitialLoading, isFetching } = useGetModalities({
    ...pagination,
    deboucedSearchText,
    sort,
    programId,
  });

  // Delete one modality
  const { mutateAsync: deleteModality, isLoading: isDeleting } = useDeleteModality();

  // Track selected row in order to view/edit/remove
  const [modality, setModality] = useState<Modality>();

  // State and handlers related to show/hide program's modality form side drawer
  const [openedModalityFormSheet, setOpenedModalityFormSheet] = useState(() => {
    const faction = searchParams.get('faction');
    return faction === 'create' || faction === 'update';
  });
  const handleModalityFormSheetChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setModality(undefined);
        // Clear search params on closing drawer to avoid re-open on user page reload
        if (searchParams.has('faction')) {
          router.replace(pathname);
        }
      }
      setOpenedModalityFormSheet(open);
    },
    [setOpenedModalityFormSheet, searchParams, pathname, router]
  );

  // State and handlers related to show/hide program's modality info side drawer
  const [openedModalityInfoSheet, setOpenedModalityInfoSheet] = useState(false);
  const handleModalityInfoSheetChange = useCallback(
    (open: boolean) => {
      if (!open) setModality(undefined);
      setOpenedModalityInfoSheet(open);
    },
    [setOpenedModalityInfoSheet]
  );

  // State and handlers to show/hide dialog needed to confirm program deletion
  const [openedDeleteModalityDialog, setOpenedDeleteModalityDialog] = useState(false);
  const handleDeleteProgram = useCallback(async () => {
    if (!modality?.id) return;
    await deleteModality({ params: { id: modality.id } });
    setModality(undefined);
    setOpenedDeleteModalityDialog(false);
  }, [modality?.id, setModality, setOpenedDeleteModalityDialog, deleteModality]);

  // Handle click on `open` action from the data table
  const handleRowOpenProgram = (row: Modality) => {
    setModality(row);
    setOpenedModalityInfoSheet(true);
  };

  // Handle click on `edit` action from the data table
  const handleRowEditProgram = (row: Modality) => {
    setModality(row);
    setOpenedModalityFormSheet(true);
  };

  // Handle click on `delete` action from the data table
  const handleRowDelete = (row: Modality) => {
    setModality(row);
    setOpenedDeleteModalityDialog(true);
  };

  return (
    <Layout.Root>
      <Layout.Header>
        <div className="flex items-center justify-between gap-8">
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/${lang}/programs`}>Programs</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="block max-w-44 truncate overflow-ellipsis">
                  {programResp.data?.body.name ?? '-'}
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>Modalities</BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Layout.Heading>{dictionary.layout.title}</Layout.Heading>
          </div>

          <div className="flex gap-5">
            {getPermission('read:program').granted && (
              <Button onClick={() => router.push(`/${lang}/programs`)}>
                <Icons.ArrowLeft className="mr-2 h-4 w-4" />
                {dictionary.buttons.goToPrograms}
              </Button>
            )}
            {getPermission('create:modality').granted && (
              <Button onClick={() => handleModalityFormSheetChange(true)}>
                <Icons.PlusCircled className="mr-2 h-4 w-4" />
                {dictionary.buttons.new}
              </Button>
            )}
          </div>
        </div>
      </Layout.Header>
      <Layout.Main>
        {/* ProgramModalities data table */}
        <ProgramModalitysDataTable
          data={data?.body}
          isLoading={!isInitialLoading && isFetching}
          isInitialLoading={isInitialLoading}
          sort={sort}
          pagination={pagination}
          onSorting={onSorting}
          onPagination={onPagination}
          onSearch={onSearch}
          onRowOpen={handleRowOpenProgram}
          onRowEdit={handleRowEditProgram}
          onRowDelete={handleRowDelete}
        />

        {/* View/Open Program Modality form side drawer/sheet */}
        <ProgramModalityInfoSheet
          modality={modality}
          opened={openedModalityInfoSheet}
          onOpened={handleModalityInfoSheetChange}
        />

        {/* Program Modality form side drawer/sheet */}
        <ProgramModalityFormSheet
          program={programResp.data?.body}
          modality={modality}
          opened={openedModalityFormSheet}
          onOpened={handleModalityFormSheetChange}
        />

        {/* Alert program before deleting */}
        <AlertDialog open={openedDeleteModalityDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{dictionaryMisc.dialogs.delete.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {dictionaryMisc.dialogs.delete.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpenedDeleteModalityDialog(false)}>
                {dictionaryMisc.dialogs.delete.buttons.cancel}
              </AlertDialogCancel>
              <AlertDialogAction disabled={isDeleting} onClick={handleDeleteProgram}>
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
