'use client';

import type { Locale } from '@/i18n/config';
import type { Program } from './@types';

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
import { ProgramFormSheet } from './program-form';
import { ProgramInfoSheet } from './program-info';
import { ProgramsDataTable } from './programs-data-table';

import { useDataTableUtils } from '@/components/data-table';
import { useDeleteProgram, useGetPrograms } from '@/hooks/queries/use-program-queries';
import { usePermissions } from '@/hooks/use-permissions';
import { useStoreContext } from '@/store';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

export const Programs = ({ lang }: { lang: Locale }) => {
  const dictionary = useStoreContext((state) => state.dictionary.program);
  const dictionaryMisc = useStoreContext((state) => state.dictionary.misc);

  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const { getPermission } = usePermissions({ include: ['manage:program', 'manage:program'] });

  const { deboucedSearchText, sort, pagination, onSearch, onSorting, onPagination } =
    useDataTableUtils({ sort: { createdAt: 'desc' } });

  // Hooks for getting, updating, and deleting programs
  const { data, isInitialLoading, isFetching } = useGetPrograms({
    ...pagination,
    deboucedSearchText,
    sort,
  });
  const { mutateAsync: deleteProgram, isLoading: isDeleting } = useDeleteProgram();

  // Track selected row/program in order to view/edit/remove
  const [program, setProgram] = useState<Program>();

  // State and handlers related to show/hide program info side drawer
  const [openedProgramInfoSheet, setOpenedProgramInfoSheet] = useState(false);
  const handleProgramInfoSheetChange = useCallback(
    (open: boolean) => {
      if (!open) setProgram(undefined);
      setOpenedProgramInfoSheet(open);
    },
    [setProgram, setOpenedProgramInfoSheet]
  );

  // State and handlers related to show/hide program form side drawer
  const [openedProgramFormSheet, setOpenedProgramFormSheet] = useState(() => {
    return params.get('faction') === 'create' || params.get('form-action') === 'update';
  });
  const handleProgramFormSheetChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setProgram(undefined);
        // Remove 'faction' search param on closing of sheet to avoid re-showing it to
        // user on page reload
        if (params.has('faction')) {
          router.replace(pathname);
        }
      }

      setOpenedProgramFormSheet(open);
    },
    [setProgram, setOpenedProgramFormSheet, params, router, pathname]
  );

  // State and handlers to show/hide dialog needed to confirm program deletion
  const [openedDeleteProgramDialog, setOpenedDeleteProgramDialog] = useState(false);
  const handleDeleteProgram = useCallback(async () => {
    if (!program?.id) return;
    await deleteProgram({ params: { id: program.id } });
    setProgram(undefined);
    setOpenedDeleteProgramDialog(false);
  }, [program?.id, setProgram, setOpenedDeleteProgramDialog, deleteProgram]);

  // Handle click on `open` action from the data table
  const handleRowOpenProgram = (row: Program) => {
    setProgram(row);
    setOpenedProgramInfoSheet(true);
  };

  // Handle click on `edit` action from the data table
  const handleRowEditProgram = (row: Program) => {
    setProgram(row);
    setOpenedProgramFormSheet(true);
  };

  // Handle click on `delete` action from the data table
  const handleRowDelete = (row: Program) => {
    setProgram(row);
    setOpenedDeleteProgramDialog(true);
  };

  // Handle create/update modality for the given program
  const handleRowCreateProgramModality = (row: Program) => {
    router.push(`/${lang}/programs/${row.id}/modalities?faction=create`);
  };

  // Redirect user to modalities page for the selected program
  const handleRowOpenProgramModalities = (row: Program) => {
    router.push(`/${lang}/programs/${row.id}/modalities`);
  };

  return (
    <Layout.Root>
      <Layout.Header>
        <div className="flex items-center justify-between gap-8">
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/${lang}/plans`}>Plans</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/${lang}/programs`}>Programs</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Layout.Heading>{dictionary.layout.title}</Layout.Heading>
          </div>

          <div className="flex gap-5">
            {getPermission('read:plan').granted && (
              <Button onClick={() => router.push(`/${lang}/plans`)}>
                <Icons.ArrowLeft className="mr-2 h-4 w-4" />
                {dictionary.buttons.goToPlans}
              </Button>
            )}
            {getPermission('create:program').granted && (
              <Button onClick={() => handleProgramFormSheetChange(true)}>
                <Icons.PlusCircled className="mr-2 h-4 w-4" />
                {dictionary.buttons.new}
              </Button>
            )}
          </div>
        </div>
      </Layout.Header>
      <Layout.Main>
        {/* Programs data table */}
        <ProgramsDataTable
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
          onRowCreateProgramModality={handleRowCreateProgramModality}
          onRowOpenProgramModalities={handleRowOpenProgramModalities}
        />

        <ProgramInfoSheet
          program={program}
          opened={openedProgramInfoSheet}
          onOpened={handleProgramInfoSheetChange}
        />

        {/* Program form side drawer/sheet */}
        <ProgramFormSheet
          program={program}
          opened={openedProgramFormSheet}
          onOpened={handleProgramFormSheetChange}
        />

        {/* Alert program before deleting */}
        <AlertDialog open={openedDeleteProgramDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{dictionaryMisc.dialogs.delete.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {dictionaryMisc.dialogs.delete.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpenedDeleteProgramDialog(false)}>
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
