import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type {
  ActivitySchoolProof,
  ActivitySchoolProofChildAttendance,
  ActivitySchoolProofChildAttendances,
} from './@types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getFile } from '@/utils/comfenalco';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { DataTable, DataTableHeadWithSorting, type DataTableProps } from '@/components/data-table';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type Table,
} from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import React from 'react';
import { type Dictionary } from '@/i18n/get-dictionary';
import { useStoreContext } from '@/store';
import { Separator } from '@/components/ui/separator';

function DataTableToolbar({
  table,
  dictionary,
  setFilter,
}: {
  table: Table<ActivitySchoolProofChildAttendance>;
  setFilter: React.Dispatch<React.SetStateAction<string | undefined>>;
  dictionary: Dictionary;
}) {
  const onChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilter(event.target.value);
    },
    [setFilter]
  );

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={
            dictionary.activity.info.tableResource.toolbar.searchFilter.input.placeholder
          }
          value={(table.getState().globalFilter as string) ?? ''}
          onChange={onChange}
          className="h-9 w-[150px] lg:w-[250px]"
        />
      </div>
    </div>
  );
}

function AttendancesTable({
  data,
  activitySchoolProof,
  isInitialLoading,
}: Pick<DataTableProps<ActivitySchoolProofChildAttendance>, 'isInitialLoading'> & {
  data?: ActivitySchoolProofChildAttendances;
  activitySchoolProof?: ActivitySchoolProof;
}) {
  const dictionary = useStoreContext((state) => state.dictionary);

  const columns: ColumnDef<ActivitySchoolProofChildAttendance>[] = React.useMemo(
    () => [
      {
        accessorKey: 'planModalityActivitySchoolChild.child.firstName',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.activity.info.tableProofAttendances.columns.firstName}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.planModalityActivitySchoolChild?.child?.firstName ?? ''}
          </span>
        ),
      },
      {
        accessorKey: 'planModalityActivitySchoolChild.child.lastName',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.activity.info.tableProofAttendances.columns.lastName}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.planModalityActivitySchoolChild?.child?.lastName ?? ''}
          </span>
        ),
      },
      {
        accessorKey: 'attended',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.activity.info.tableProofAttendances.columns.attend}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {row.original.attended ? 'Si' : 'No'}
          </span>
        ),
      },
      {
        accessorKey: 'resources',
        enableSorting: false,
        header: (props) => (
          <DataTableHeadWithSorting
            title={dictionary.activity.info.tableProofAttendances.columns.resources}
            {...props}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-block max-w-[300px] truncate">
            {activitySchoolProof?.planModalityActivitySchoolProofChildrenResources
              ?.filter(
                (r) =>
                  r.planModalityActivitySchoolChildId ===
                  row.original.planModalityActivitySchoolChildId
              )
              .map(
                (r) =>
                  r.planModalityActivitySchoolResource?.planModalityActivityResource?.resource?.name
              )
              .join(', ') ?? ''}
          </span>
        ),
      },
    ],
    [dictionary, activitySchoolProof]
  );

  const defaultData = React.useMemo(() => [], []);
  const [globalFilter, setGlobalFilter] = React.useState<string>();

  const table = useReactTable({
    columns,
    data: data ?? defaultData,
    enableFilters: true,
    enableSorting: true,
    enableRowSelection: false,
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    enableGlobalFilter: true,
    globalFilterFn: 'auto',
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <>
      <DataTable
        table={table}
        isInitialLoading={isInitialLoading}
        dictionary={dictionary.misc.table}
        withPagination={true}
        toolbar={
          <DataTableToolbar table={table} setFilter={setGlobalFilter} dictionary={dictionary} />
        }
      />
    </>
  );
}

export function ActivityProofInfo({
  activitySchoolProof,
  onOpened,
  opened,
}: {
  activitySchoolProof?: ActivitySchoolProof;
  opened: boolean;
  onOpened(opened: boolean): void;
}) {
  const dictionary = useStoreContext(
    (state) => state.dictionary.activity.info.tableProofAttendances
  );

  const downloadFile = async (fileId: string) => {
    const res = await getFile(fileId);
    if (res) {
      const link = document.createElement('a');
      link.setAttribute('href', res.data);
      link.setAttribute('download', res.data);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Sheet open={opened} onOpenChange={(open) => onOpened(open)}>
      <SheetContent className="w-full overflow-y-scroll sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>{dictionary.title}</SheetTitle>
        </SheetHeader>
        <Tabs defaultValue="files" className="mt-4">
          <TabsList className="mb-4">
            <TabsTrigger value="files">{dictionary.tabs.files}</TabsTrigger>
            <TabsTrigger value="children">{dictionary.tabs.children}</TabsTrigger>
          </TabsList>
          <Separator />
          <TabsContent value="files">
            <div className="space-y-3">
              {activitySchoolProof?.planModalityActivitySchoolProofFiles?.map((file) => (
                <>
                  <div key={`files-${file.id}`} className="mb-3 flex items-center justify-between">
                    <p className="text-lg">{file.proofFileClassification?.name}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => downloadFile?.(file.filePath)}
                    >
                      <Icons.File className="h-4 w-4" />
                    </Button>
                  </div>
                  <Separator />
                </>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="children">
            <div className="py-4">
              <AttendancesTable
                data={activitySchoolProof?.planModalityActivitySchoolProofChildrenAttendances ?? []}
                activitySchoolProof={activitySchoolProof}
              />
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
