'use client';

import type { InventoryTransaction, InventoryTransactionFormValues } from './@types';

import { InventoryTransactionCreateBodySchema } from '@/schemas/inventory-transaction';

import { Icons } from '@/components/icons';
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
import { Form } from '@/components/ui/form';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import * as React from 'react';

import { useToast } from '@/components/ui/use-toast';
import { useFormErrors } from '@/hooks';
import {
  useCreateInventoryTransaction,
  useUpdateInventoryTransaction,
} from '@/hooks/queries/use-inventory-transaction-queries';
import { usePermissions } from '@/hooks/use-permissions';
import { useStoreContext } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormSkeleton } from './inventory-transactions-info-tabs-loading';
import dynamic from 'next/dynamic';

const InventoryTransactionFormInfo = dynamic(() => import('./inventory-transaction-form-info'));
const InventoryTransactionFormResources = dynamic(
  () => import('./inventory-transaction-form-resources'),
  { loading: FormSkeleton }
);

export function InventoryTransactionFormSheet({
  inventoryTransaction,
  opened,
  onOpened,
}: {
  inventoryTransaction: InventoryTransaction | undefined;
  opened: boolean;
  onOpened(opened: boolean): void;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.inventoryTransaction.form);

  const { getPermission } = usePermissions({ include: ['manage:inventoryTransaction'] });

  const { toast } = useToast();

  const { onSubmitError } = useFormErrors();

  const [openedUnsavedChangesDialog, setOpenedUnsavedChangesDialog] = React.useState(false);

  // Ref allows to dynamically submit form within alert dialog when there're unsaved changes.
  const formRef = React.useRef<HTMLFormElement>(null);

  const form = useForm<InventoryTransactionFormValues>({
    resolver: zodResolver(InventoryTransactionCreateBodySchema.shape.data),
    values: React.useMemo(() => {
      return {
        note: inventoryTransaction?.note ?? '',
        rejectionNote: inventoryTransaction?.rejectionNote ?? '',
        type: inventoryTransaction?.type ?? 'stock',
        status: inventoryTransaction?.status ?? 'pending',
        supplierInvoiceNumber: inventoryTransaction?.supplierInvoiceNumber ?? '',
        orderNumber: inventoryTransaction?.orderNumber ?? '',
      };
    }, [inventoryTransaction]),
  });

  const handleOnOpenChange = React.useCallback(
    (opened: boolean) => {
      if (!opened && form.formState.isDirty) {
        return setOpenedUnsavedChangesDialog(true);
      }
      onOpened(opened);
    },
    [onOpened, form.formState.isDirty]
  );

  const handleDiscardChanges = React.useCallback(() => {
    form.reset();
    setOpenedUnsavedChangesDialog(false);
    onOpened(false);
  }, [form, onOpened, setOpenedUnsavedChangesDialog]);

  const handleSaveChanges = React.useCallback(() => {
    formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  }, []);

  const { mutateAsync: create, isLoading: isCreatingInventoryTransaction } =
    useCreateInventoryTransaction({
      onSuccess: () => {
        form.reset();
        onOpened(false);
      },
    });

  const { mutateAsync: update, isLoading: isUpadingInventoryTransaction } =
    useUpdateInventoryTransaction({
      onSuccess: () => {
        form.reset();
        setOpenedUnsavedChangesDialog(false);
        onOpened(false);
      },
      // Close alert dialog, but don't reset form as we might want the inventoryTransaction
      // to preserve the data, fix issue and re-submit.
      onError: () => {
        setOpenedUnsavedChangesDialog(false);
      },
    });

  const isLoading = useMemo(
    () => isCreatingInventoryTransaction || isUpadingInventoryTransaction,
    [isCreatingInventoryTransaction, isUpadingInventoryTransaction]
  );

  const isUpdate = useMemo(() => !!inventoryTransaction, [inventoryTransaction]);

  const onSubmit = useCallback(
    async (data: InventoryTransactionFormValues) => {
      if (!getPermission(['create:inventoryTransaction', 'update:inventoryTransaction']).granted) {
        return toast({
          variant: 'destructive',
          description: 'You do not have permission to create/update inventoryTransaction.',
        });
      }

      if (inventoryTransaction && isUpdate) {
        await update({ params: { id: inventoryTransaction.id }, body: { data } });
      } else {
        await create({ body: { data } });
      }
    },
    [inventoryTransaction, create, update, isUpdate, getPermission, toast]
  );

  const tabNames = React.useMemo(
    () => Object.values(dictionary.tabs) as [string, string, string],
    [dictionary.tabs]
  );
  const tabs = React.useMemo(
    () =>
      new Map<
        string,
        { component: React.ComponentType<{ inventoryTransaction?: InventoryTransaction }> }
      >([
        [tabNames[0], { component: InventoryTransactionFormInfo }],
        [tabNames[1], { component: InventoryTransactionFormResources }],
      ]),
    [tabNames]
  );
  const [tab, setTab] = React.useState<string>(tabNames[0]);
  const renderTabContent = React.useCallback(() => {
    const Component = tabs.get(tab)?.component ?? FormSkeleton;
    return <Component inventoryTransaction={inventoryTransaction} />;
  }, [tab, tabs, inventoryTransaction]);

  return (
    <>
      <Sheet open={opened} onOpenChange={handleOnOpenChange}>
        <SheetContent className="w-full overflow-y-scroll sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>
              {inventoryTransaction ? (
                <div>
                  {dictionary.headings.update}{' '}
                  <span className="text-muted-foreground">[ Id:{inventoryTransaction?.id} ]</span>
                </div>
              ) : (
                <div>{dictionary.headings.new}</div>
              )}
            </SheetTitle>
            <SheetDescription>{dictionary.description}</SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form
              ref={formRef}
              onSubmit={form.handleSubmit(onSubmit, onSubmitError)}
              className="space-y-4"
            >
              <Tabs value={tab} onValueChange={(tab) => setTab(tab)} className="mt-4">
                <TabsList className="grid w-fit grid-cols-2">
                  {tabNames.map((tabName) => (
                    <TabsTrigger
                      key={`tab-${tabName}`}
                      value={tabName}
                      className="text-xs capitalize sm:text-sm"
                    >
                      {tabName}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value={tab} className="space-y-2">
                  {renderTabContent()}
                  {getPermission('create:inventoryTransaction').granted && (
                    <Button type="submit" disabled={isLoading} className="ml-auto flex">
                      {isLoading && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
                      {dictionary.buttons.save}
                    </Button>
                  )}
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </SheetContent>
      </Sheet>

      {/* Alert inventoryTransaction of unsaved changes */}
      <AlertDialog open={openedUnsavedChangesDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dictionary.dialogs.unsaved.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {dictionary.dialogs.unsaved.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDiscardChanges}>
              {dictionary.dialogs.unsaved.buttons.discard}
            </AlertDialogCancel>
            <AlertDialogAction disabled={isUpadingInventoryTransaction} onClick={handleSaveChanges}>
              {isUpadingInventoryTransaction && (
                <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {dictionary.dialogs.unsaved.buttons.save}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
