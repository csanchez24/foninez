'use client';

import type { Resource, ResourceClassification, ResourceFormValues } from './@types';

import { ResourceCreateBodySchema } from '@/schemas/resource';

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
import { ResourceFormInfo } from './resource-form-info';

import { useToast } from '@/components/ui/use-toast';
import { useFormErrors } from '@/hooks';
import { useCreateResource, useUpdateResource } from '@/hooks/queries/use-resource-queries';
import { usePermissions } from '@/hooks/use-permissions';
import { useStoreContext } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDeleteResourceClassification } from '@/hooks/queries/use-resource-classification-queries';
import { ResourceClassificationsForm } from './resource-classifications-form';
import ResourceFormSupplier from './resource-form-supplier';
import { FormSkeleton } from './resources-tabs-loading';

export function ResourceFormSheet({
  resource,
  opened,
  onOpened,
}: {
  resource: Resource | undefined;
  opened: boolean;
  onOpened(opened: boolean): void;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.resource.form);

  const { getPermission } = usePermissions({ include: ['manage:resource'] });

  const { toast } = useToast();

  const { onSubmitError } = useFormErrors();

  const [openedUnsavedChangesDialog, setOpenedUnsavedChangesDialog] = React.useState(false);

  // Ref allows to dynamically submit form within alert dialog when there're unsaved changes.
  const formRef = React.useRef<HTMLFormElement>(null);

  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(ResourceCreateBodySchema.shape.data),
    values: React.useMemo(() => {
      return {
        name: resource?.name ?? '',
        type: resource?.type ?? 'external',
        usageType: resource?.usageType ?? 'general',
        price: resource?.price ?? 0,
        resourceClassificationId: resource?.resourceClassificationId,
        resourcesToSuppliers:
          resource?.resourcesToSuppliers?.map((s) => {
            return {
              supplier: s.supplier!,
            };
          }) ?? [],
      };
    }, [resource]),
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

  const { mutateAsync: create, isLoading: isCreatingResource } = useCreateResource({
    onSuccess: () => {
      form.reset();
      onOpened(false);
    },
  });

  const { mutateAsync: update, isLoading: isUpadingResource } = useUpdateResource({
    onSuccess: () => {
      form.reset();
      setOpenedUnsavedChangesDialog(false);
      onOpened(false);
    },
    // Close alert dialog, but don't reset form as we might want the resource
    // to preserve the data, fix issue and re-submit.
    onError: () => {
      setOpenedUnsavedChangesDialog(false);
    },
  });

  const isLoading = useMemo(
    () => isCreatingResource || isUpadingResource,
    [isCreatingResource, isUpadingResource]
  );

  const isUpdate = useMemo(() => !!resource, [resource]);

  const onSubmit = useCallback(
    async (data: ResourceFormValues) => {
      if (!getPermission(['create:resource', 'update:resource']).granted) {
        return toast({
          variant: 'destructive',
          description: 'You do not have permission to create/update resource.',
        });
      }

      if (resource && isUpdate) {
        await update({ params: { id: resource.id }, body: { data } });
      } else {
        await create({ body: { data: data as Required<typeof data> } });
      }
    },
    [resource, create, update, isUpdate, getPermission, toast]
  );

  const [openedResourceClassificationDeleteDialog, setOpenedResourceClassificationDeleteDialog] =
    React.useState(false);
  const [openedResourceClassificationFormDialog, setOpenedResourceClassificationFormDialog] =
    React.useState(false);
  const [selectedResourceClassification, setSelectedResourceClassification] =
    React.useState<ResourceClassification>();
  const handleCancelResourceClassification = React.useCallback(() => {
    setSelectedResourceClassification(undefined);
    setOpenedResourceClassificationFormDialog(false);
  }, []);
  const handleSuccessResourceClassification = React.useCallback(() => {
    setSelectedResourceClassification(undefined);
    setOpenedResourceClassificationFormDialog(false);
  }, []);
  const handleCreateResourceClassification = React.useCallback(() => {
    setOpenedResourceClassificationFormDialog(true);
  }, []);
  const handleEditResourceClassification = React.useCallback(
    (resourceClassification: ResourceClassification) => {
      setSelectedResourceClassification(resourceClassification);
      setOpenedResourceClassificationFormDialog(true);
    },
    []
  );
  const handleDeleteResourceClassification = React.useCallback(
    (resourceClassification: ResourceClassification) => {
      setSelectedResourceClassification(resourceClassification);
      setOpenedResourceClassificationDeleteDialog(true);
    },
    []
  );
  const { mutateAsync: deleteResourceClassification, isLoading: isDeletingResourceClassification } =
    useDeleteResourceClassification({
      onSuccess() {
        setSelectedResourceClassification(undefined);
        setOpenedResourceClassificationDeleteDialog(false);
      },
    });
  const handleConfirmDeleteResourceClassification = React.useCallback(() => {
    if (!selectedResourceClassification) {
      return toast({
        variant: 'destructive',
        description: 'No resourceClassification has been selected for deletion.',
      });
    }
    deleteResourceClassification({ params: { id: selectedResourceClassification.id } });
  }, [selectedResourceClassification, deleteResourceClassification, toast]);

  const tabNames = React.useMemo(
    () => Object.values(dictionary.tabs) as [string, string, string],
    [dictionary.tabs]
  );
  const tabs = React.useMemo(
    () =>
      new Map<
        string,
        {
          component: React.ComponentType<{
            resource?: Resource;
            onCreateResourceClassification?(): void;
            onEditResourceClassification?(category: ResourceClassification): void;
            onDeleteResourceClassification?(category: ResourceClassification): void;
          }>;
        }
      >([
        [tabNames[0], { component: ResourceFormInfo }],
        [tabNames[1], { component: ResourceFormSupplier }],
      ]),
    [tabNames]
  );
  const [tab, setTab] = React.useState<string>(tabNames[0]);
  const renderTabContent = React.useCallback(() => {
    const Component = tabs.get(tab)?.component ?? FormSkeleton;
    return (
      <Component
        resource={resource}
        onCreateResourceClassification={handleCreateResourceClassification}
        onEditResourceClassification={handleEditResourceClassification}
        onDeleteResourceClassification={handleDeleteResourceClassification}
      />
    );
  }, [
    tab,
    tabs,
    resource,
    handleCreateResourceClassification,
    handleEditResourceClassification,
    handleDeleteResourceClassification,
  ]);

  return (
    <>
      <Sheet open={opened} onOpenChange={handleOnOpenChange}>
        <SheetContent className="w-full overflow-y-scroll sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>
              {resource ? (
                <div>
                  {dictionary.headings.update}{' '}
                  <span className="text-muted-foreground">[ Id:{resource?.id} ]</span>
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
                  {getPermission(['create:resource', 'update:resource']).granted && (
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

      {/* Create/update resource's resourceClassifications */}
      <AlertDialog
        open={openedResourceClassificationFormDialog}
        onOpenChange={setOpenedResourceClassificationFormDialog}
      >
        <AlertDialogContent className="sm:max-w-xl" onEscapeKeyDown={(e) => e.preventDefault()}>
          <AlertDialogHeader>
            <AlertDialogTitle>{dictionary.dialogs.create.title}</AlertDialogTitle>
            <AlertDialogDescription>{dictionary.dialogs.create.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <ResourceClassificationsForm
            resourceClassification={selectedResourceClassification}
            onCancel={handleCancelResourceClassification}
            onSucces={handleSuccessResourceClassification}
          />
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert user before deleting resourceClassification */}
      <AlertDialog open={openedResourceClassificationDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dictionary.dialogs.delete.title}</AlertDialogTitle>
            <AlertDialogDescription>{dictionary.dialogs.delete.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenedResourceClassificationDeleteDialog(false)}>
              {dictionary.dialogs.delete.buttons.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeletingResourceClassification}
              onClick={handleConfirmDeleteResourceClassification}
            >
              {isDeletingResourceClassification && (
                <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {dictionary.dialogs.delete.buttons.continue}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert resource of unsaved changes */}
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
            <AlertDialogAction disabled={isUpadingResource} onClick={handleSaveChanges}>
              {isUpadingResource && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
              {dictionary.dialogs.unsaved.buttons.save}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
