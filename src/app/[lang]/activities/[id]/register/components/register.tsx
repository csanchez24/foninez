'use client';

import type { SchoolChild } from './@types';

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
import { RegisterFormSheet } from './register-form';
import { RegisterDataTable } from './register-data-table';

import { useDataTableUtils } from '@/components/data-table';
import {
  useDeletePlanModalityActivitySchoolChild,
  useGetPlanModalityActivitySchoolChildren,
  useReSyncPlanModalityActivitySchoolChild,
} from '@/hooks/queries/use-plan-modality-activity-school-children-queries';
import { usePermissions } from '@/hooks/use-permissions';
import { useStoreContext } from '@/store';
import { useGetPlanModalityActivitySchool } from '@/hooks/queries/use-plan-modality-activity-school-queries';
import { RegisterInfoSheet } from './register-info';

export const Register = ({ activityId }: { activityId: number }) => {
  const dictionary = useStoreContext((state) => state.dictionary.register);
  const dictionaryMisc = useStoreContext((state) => state.dictionary.misc);

  const { getPermission } = usePermissions({ include: ['manage:planModalityActivitySchoolChild'] });

  const { deboucedSearchText, sort, pagination, onSearch, onSorting, onPagination } =
    useDataTableUtils({ sort: { createdAt: 'desc' } });

  const { data: activity } = useGetPlanModalityActivitySchool(activityId);

  const { data, isInitialLoading, isFetching } = useGetPlanModalityActivitySchoolChildren({
    ...pagination,
    deboucedSearchText,
    sort,
    planModalityActivitySchoolId: activityId,
  });

  const { mutateAsync: resync } = useReSyncPlanModalityActivitySchoolChild();

  const { mutateAsync: deleteSchoolChild, isLoading: isDeleting } =
    useDeletePlanModalityActivitySchoolChild();

  // Track selected row/school to be view/edited/removed
  const [schoolChild, setSchoolChild] = React.useState<SchoolChild>();

  const [openedFormSheet, setOpenedFormSheet] = React.useState(false);
  const handleFormSheetChange = React.useCallback(
    (open: boolean) => {
      if (open === false) {
        setSchoolChild(undefined);
      }
      setOpenedFormSheet(open);
    },
    [setSchoolChild, setOpenedFormSheet]
  );

  const [openedInfoSheet, setOpenedInfoSheet] = React.useState(false);
  const handleInfoSheetChange = React.useCallback(
    (open: boolean) => {
      if (open === false) {
        setSchoolChild(undefined);
      }
      setOpenedInfoSheet(open);
    },
    [setSchoolChild, setOpenedInfoSheet]
  );

  const [openedDeleteDialog, setOpenedDeleteDialog] = React.useState(false);
  const handleDelete = React.useCallback(async () => {
    if (!schoolChild?.id) return;
    await deleteSchoolChild({ params: { id: schoolChild.id } });
    setSchoolChild(undefined);
    setOpenedDeleteDialog(false);
  }, [schoolChild?.id, setSchoolChild, setOpenedDeleteDialog, deleteSchoolChild]);

  const handleRowInfo = (row: SchoolChild) => {
    setSchoolChild(row);
    setOpenedInfoSheet(true);
  };

  const handleRowEdit = (row: SchoolChild) => {
    setSchoolChild(row);
    setOpenedFormSheet(true);
  };

  const handleRowDelete = (row: SchoolChild) => {
    setSchoolChild(row);
    setOpenedDeleteDialog(true);
  };

  return (
    <Layout.Root>
      <Layout.Header>
        <div className="flex items-center justify-between gap-8">
          <Layout.Heading>
            {dictionary.layout.title} : {activity?.body.planModalityActivity?.name}
          </Layout.Heading>
          <div className="flex gap-5">
            {getPermission('create:planModalityActivitySchoolChild').granted && (
              <Button onClick={() => handleFormSheetChange(true)}>
                <Icons.PlusCircled className="mr-2 h-4 w-4" />
                {dictionary.buttons.new}
              </Button>
            )}
          </div>
        </div>
      </Layout.Header>
      <Layout.Main>
        {/* Schools data table */}
        <RegisterDataTable
          data={data?.body}
          isLoading={!isInitialLoading && isFetching}
          isInitialLoading={isInitialLoading}
          sort={sort}
          pagination={pagination}
          onSorting={onSorting}
          onPagination={onPagination}
          onSearch={onSearch}
          onRowEdit={handleRowEdit}
          onRowOpen={handleRowInfo}
          onRowDelete={handleRowDelete}
          onResync={(rowData) => resync({ params: { id: rowData.id } })}
        />

        {/* School form side drawer/sheet */}
        <RegisterFormSheet
          activity={activity?.body}
          schoolChild={schoolChild}
          opened={openedFormSheet}
          onOpened={handleFormSheetChange}
        />

        <RegisterInfoSheet
          schoolChild={schoolChild}
          opened={openedInfoSheet}
          onOpened={handleInfoSheetChange}
        />

        {/* Alert school before deleting */}
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
