'use client';

import * as Layout from '@/components/layout';
import { ActivitiesDataTable } from './activities-data-table';

import { useDataTableUtils } from '@/components/data-table';
import {
  type getPlanModalityActivitySchoolsQueryKey,
  useGetPlanModalityActivitySchools,
  useUpdatePlanModalityActivitySchool,
} from '@/hooks/queries/use-plan-modality-activity-school-queries';
import { useStoreContext } from '@/store';
import { useRouter } from 'next/navigation';
import React from 'react';
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
import type { Activity } from './@types';
import { Icons } from '@/components/icons';
import { PlanningFormSheet } from './planning/planning-form';
import { ActivityInfoSheet } from './activity-info';
import { ActivityConfirmResourcesFormSheet } from './activity-confirm-resources';
import { ActivityCompleteFormSheet } from './activity-complete';
import { ProofFormSheet } from './proof/proof-form';
import { ActivitiesReport } from './activity-report';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ActivityRejectForm } from './activity-reject-form';

export const Activities = () => {
  const dictionary = useStoreContext((state) => state.dictionary.activity);
  const router = useRouter();

  const [planModalityActivitySchoolsRow, setPlanModalityActivitySchoolsRow] =
    React.useState<Activity>();

  const [queryWhere, setQueryWhere] =
    React.useState<
      NonNullable<Parameters<typeof getPlanModalityActivitySchoolsQueryKey>[0]>['where']
    >(undefined);

  const { deboucedSearchText, sort, pagination, onSearch, onSorting, onPagination } =
    useDataTableUtils({ sort: { createdAt: 'desc' } });

  const { data, isInitialLoading, isFetching } = useGetPlanModalityActivitySchools({
    ...pagination,
    deboucedSearchText,
    sort,
    where: queryWhere,
  });

  const { mutateAsync: update, isLoading: isUpdating } = useUpdatePlanModalityActivitySchool();

  const [openedInfoSheet, setOpenedInfoSheet] = React.useState(false);
  const handleInfoSheetChange = React.useCallback(
    (open: boolean) => {
      if (open === false) {
        setPlanModalityActivitySchoolsRow(undefined);
      }
      setOpenedInfoSheet(open);
    },
    [setPlanModalityActivitySchoolsRow, setOpenedInfoSheet]
  );

  const [openedPlanningFormSheet, setOpenedPlanningFormSheet] = React.useState(false);
  const handlePlanningFormSheetChange = React.useCallback(
    (open: boolean) => {
      if (open === false) {
        setPlanModalityActivitySchoolsRow(undefined);
      }
      setOpenedPlanningFormSheet(open);
    },
    [setPlanModalityActivitySchoolsRow, setOpenedPlanningFormSheet]
  );

  const [openedProofFormSheet, setOpenedProofFormSheet] = React.useState(false);
  const handleProofFormSheetChange = React.useCallback(
    (open: boolean) => {
      if (open === false) {
        setPlanModalityActivitySchoolsRow(undefined);
      }
      setOpenedProofFormSheet(open);
    },
    [setPlanModalityActivitySchoolsRow, setOpenedProofFormSheet]
  );

  const [openStartActivityAlertDialog, setOpenStartActivityAlertDialog] = React.useState(false);
  const [openCompleteAlertDialog, setOpenCompleteAlertDialog] = React.useState(false);
  const [openConfirmResourcesAlertDialog, setOpenConfirmResourcesAlertDialog] =
    React.useState(false);
  const [openRequestResourcesAlertDialog, setOpenRequestResourcesAlertDialog] =
    React.useState(false);
  const [openStartPlanningAlertDialog, setOpenStartPlanningAlertDialog] = React.useState(false);
  const [openVerifyAlertDialog, setOpenVerifyAlertDialog] = React.useState(false);
  const [openRejectAlertDialog, setOpenRejectAlertDialog] = React.useState(false);

  const onStartPlanning = React.useCallback(async () => {
    if (!planModalityActivitySchoolsRow?.id) return;
    await update({
      params: { id: planModalityActivitySchoolsRow.id },
      body: {
        data: { status: 'planning' },
        options: {
          updateStatuses: true,
        },
      },
    });
    setPlanModalityActivitySchoolsRow(undefined);
    setOpenStartPlanningAlertDialog(false);
  }, [planModalityActivitySchoolsRow?.id, update]);

  const onVerify = React.useCallback(async () => {
    if (!planModalityActivitySchoolsRow?.id) return;
    await update({
      params: { id: planModalityActivitySchoolsRow.id },
      body: {
        data: { status: 'verified' },
        options: {
          updateStatuses: true,
        },
      },
    });
    setPlanModalityActivitySchoolsRow(undefined);
    setOpenVerifyAlertDialog(false);
  }, [planModalityActivitySchoolsRow?.id, update]);

  const onStartActivity = React.useCallback(async () => {
    if (!planModalityActivitySchoolsRow?.id) return;
    await update({
      params: { id: planModalityActivitySchoolsRow.id },
      body: {
        data: { status: 'active' },
        options: {
          updateStatuses: true,
        },
      },
    });
    setPlanModalityActivitySchoolsRow(undefined);
    setOpenStartActivityAlertDialog(false);
  }, [planModalityActivitySchoolsRow?.id, update]);

  const onRequestResources = React.useCallback(async () => {
    if (!planModalityActivitySchoolsRow?.id) return;
    await update({
      params: { id: planModalityActivitySchoolsRow.id },
      body: {
        data: { status: 'requested_resources' },
        options: {
          updateStatuses: true,
        },
      },
    });
    setPlanModalityActivitySchoolsRow(undefined);
    setOpenRequestResourcesAlertDialog(false);
  }, [planModalityActivitySchoolsRow?.id, update]);

  const handleRowOpen = (row: Activity) => {
    setPlanModalityActivitySchoolsRow(row);
    setOpenedInfoSheet(true);
  };

  const handlePlanning = (row: Activity) => {
    setPlanModalityActivitySchoolsRow(row);
    setOpenedPlanningFormSheet(true);
  };

  const handleProof = (row: Activity) => {
    setPlanModalityActivitySchoolsRow(row);
    setOpenedProofFormSheet(true);
  };

  const handleConfirmResources = React.useCallback(
    (open: boolean) => {
      if (open === false) {
        setPlanModalityActivitySchoolsRow(undefined);
      }
      setOpenConfirmResourcesAlertDialog(open);
    },
    [setPlanModalityActivitySchoolsRow, setOpenConfirmResourcesAlertDialog]
  );

  const handleComplete = React.useCallback(
    (open: boolean) => {
      if (open === false) {
        setPlanModalityActivitySchoolsRow(undefined);
      }
      setOpenCompleteAlertDialog(open);
    },
    [setPlanModalityActivitySchoolsRow, setOpenCompleteAlertDialog]
  );

  const handleReject = React.useCallback(
    (open: boolean) => {
      if (open === false) {
        setPlanModalityActivitySchoolsRow(undefined);
      }
      setOpenRejectAlertDialog(open);
    },
    [setPlanModalityActivitySchoolsRow, setOpenRejectAlertDialog]
  );

  return (
    <Layout.Root>
      <Layout.Header>
        <div className="flex items-center justify-between gap-8">
          <Layout.Heading>{dictionary.layout.title}</Layout.Heading>
          <div className="flex gap-5">
            <ActivitiesReport />
          </div>
        </div>
      </Layout.Header>
      <Layout.Main>
        {/* Activities data table */}
        <ActivitiesDataTable
          data={data?.body}
          isLoading={!isInitialLoading && isFetching}
          isInitialLoading={isInitialLoading}
          sort={sort}
          pagination={pagination}
          onSorting={onSorting}
          onPagination={onPagination}
          onSearch={onSearch}
          onRowOpen={handleRowOpen}
          onPlanning={handlePlanning}
          onProof={handleProof}
          onStartPlanning={(rowData) => {
            setPlanModalityActivitySchoolsRow(rowData);
            setOpenStartPlanningAlertDialog(true);
          }}
          onGoToRegister={(rowData) => {
            return router.push(`/activities/${rowData.id}/register`);
          }}
          onComplete={(rowData) => {
            setPlanModalityActivitySchoolsRow(rowData);
            setOpenCompleteAlertDialog(true);
          }}
          onVerify={(rowData) => {
            setPlanModalityActivitySchoolsRow(rowData);
            setOpenVerifyAlertDialog(true);
          }}
          onReject={(rowData) => {
            setPlanModalityActivitySchoolsRow(rowData);
            setOpenRejectAlertDialog(true);
          }}
          onRequestResources={(rowData) => {
            setPlanModalityActivitySchoolsRow(rowData);
            setOpenRequestResourcesAlertDialog(true);
          }}
          onConfirmResources={(rowData) => {
            setPlanModalityActivitySchoolsRow(rowData);
            setOpenConfirmResourcesAlertDialog(true);
          }}
          onStartActivity={(rowData) => {
            setPlanModalityActivitySchoolsRow(rowData);
            setOpenStartActivityAlertDialog(true);
          }}
          onFacetedFilterStatus={(
            selections: Parameters<
              NonNullable<Parameters<typeof ActivitiesDataTable>[0]['onFacetedFilterStatus']>
            >[0]
          ) => {
            setQueryWhere(
              !selections.length
                ? undefined
                : { ...queryWhere, status: { in: selections.map((s) => s.value) } }
            );
          }}
          onFacetedFilterSchool={(
            selections: Parameters<
              NonNullable<Parameters<typeof ActivitiesDataTable>[0]['onFacetedFilterSchool']>
            >[0]
          ) => {
            setQueryWhere(
              !selections.length
                ? undefined
                : { ...queryWhere, schoolId: { in: selections.map((s) => parseInt(s.value)) } }
            );
          }}
          onFacetedFilterActivity={(
            selections: Parameters<
              NonNullable<Parameters<typeof ActivitiesDataTable>[0]['onFacetedFilterActivity']>
            >[0]
          ) => {
            setQueryWhere(
              !selections.length
                ? undefined
                : {
                    ...queryWhere,
                    planModalityActivityId: { in: selections.map((s) => parseInt(s.value)) },
                  }
            );
          }}
        />

        <ActivityInfoSheet
          activity={planModalityActivitySchoolsRow}
          opened={openedInfoSheet}
          onOpened={handleInfoSheetChange}
        />

        <PlanningFormSheet
          activity={planModalityActivitySchoolsRow}
          opened={openedPlanningFormSheet}
          onOpened={handlePlanningFormSheetChange}
        />

        <ProofFormSheet
          activity={planModalityActivitySchoolsRow}
          opened={openedProofFormSheet}
          onOpened={handleProofFormSheetChange}
        />

        {/* start planning */}
        <AlertDialog open={openStartPlanningAlertDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{dictionary.formStartPlaning.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {dictionary.formStartPlaning.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpenStartPlanningAlertDialog(false)}>
                {dictionary.formStartPlaning.buttons.cancel}
              </AlertDialogCancel>
              <AlertDialogAction disabled={isUpdating} onClick={onStartPlanning}>
                {isUpdating && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
                {dictionary.formStartPlaning.buttons.confirm}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {/* request resources */}
        <AlertDialog open={openRequestResourcesAlertDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{dictionary.formRequestResources.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {dictionary.formRequestResources.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpenRequestResourcesAlertDialog(false)}>
                {dictionary.formRequestResources.buttons.cancel}
              </AlertDialogCancel>
              <AlertDialogAction disabled={isUpdating} onClick={onRequestResources}>
                {isUpdating && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
                {dictionary.formStartPlaning.buttons.confirm}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {/* confirming resources */}
        <ActivityConfirmResourcesFormSheet
          activity={planModalityActivitySchoolsRow}
          opened={openConfirmResourcesAlertDialog}
          onOpened={handleConfirmResources}
        />
        {/* complete resources */}
        <ActivityCompleteFormSheet
          activity={planModalityActivitySchoolsRow}
          opened={openCompleteAlertDialog}
          onOpened={handleComplete}
        />

        <AlertDialog open={openVerifyAlertDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{dictionary.formVerify.title}</AlertDialogTitle>
              <AlertDialogDescription>{dictionary.formVerify.description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpenVerifyAlertDialog(false)}>
                {dictionary.formVerify.buttons.cancel}
              </AlertDialogCancel>
              <AlertDialogAction disabled={isUpdating} onClick={onVerify}>
                {isUpdating && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
                {dictionary.formVerify.buttons.confirm}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={openRejectAlertDialog} onOpenChange={handleReject}>
          <DialogContent>
            <ActivityRejectForm
              planModalityActivitySchool={planModalityActivitySchoolsRow}
              onSuccess={() => {
                setOpenRejectAlertDialog(false);
                setPlanModalityActivitySchoolsRow(undefined);
                return;
              }}
            />
          </DialogContent>
        </Dialog>

        {/* start activity */}
        <AlertDialog open={openStartActivityAlertDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{dictionary.formStartActivity.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {dictionary.formStartActivity.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpenStartActivityAlertDialog(false)}>
                {dictionary.formStartActivity.buttons.cancel}
              </AlertDialogCancel>
              <AlertDialogAction disabled={isUpdating} onClick={onStartActivity}>
                {isUpdating && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
                {dictionary.formStartActivity.buttons.confirm}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Layout.Main>
    </Layout.Root>
  );
};
