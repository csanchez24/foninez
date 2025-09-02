'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Separator } from '@/components/ui/separator';
import { useStoreContext } from '@/store';
import type { Activity } from '../@types';
import { useToast } from '@/components/ui/use-toast';
import {
  useGetPlanModalityActivitySchoolResources,
  useUpdatePlanModalityActivitySchoolResource,
} from '@/hooks/queries/use-plan-modality-activity-school-resources-queries';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useGetPlanModalityActivitySchools } from '@/hooks/queries/use-plan-modality-activity-school-queries';
import { Icons } from '@/components/icons';

type ResourceQuantities = Record<number, number>;

export default function FormResources({
  activity,
  onOpened: _,
}: {
  activity?: Activity;
  onOpened(opened: boolean): void;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.activity.planning);

  const { data: planModalityActivitySchoolResources } = useGetPlanModalityActivitySchoolResources({
    where: {
      planModalityActivitySchoolId: activity?.id,
    },
    limit: 1000,
  });

  const { data: planModalityActivitySchools } = useGetPlanModalityActivitySchools({
    where: {
      planModalityActivityId: activity?.planModalityActivityId,
    },
    page: 1,
    limit: 1000,
  });

  const { toast } = useToast();

  const { mutateAsync: update, isLoading } = useUpdatePlanModalityActivitySchoolResource({
    onSuccess: () => {
      toast({ description: 'Resource quantity updated successfully' });
      //onOpened(false)
    },
  });

  const [quantities, setQuantities] = useState<ResourceQuantities>({});

  useEffect(() => {
    const initialQuantities: ResourceQuantities = {};
    planModalityActivitySchoolResources?.body.data.forEach((resource) => {
      initialQuantities[resource.id] = resource.resourcesQty;
    });
    setQuantities(initialQuantities);
  }, [planModalityActivitySchoolResources]);

  const debouncedUpdate = useDebouncedCallback(async (id: number, qty: number) => {
    try {
      await update({
        params: { id },
        body: { data: { resourcesQty: qty } },
      });
    } catch (error) {
      toast({ description: 'Failed to update resource quantity', variant: 'destructive' });
    }
  }, 500);

  const handleQuantityChange = useCallback(
    (available: number, resourceId: number, newQty: number) => {
      if (available < newQty) {
        toast({ variant: 'destructive', description: 'qty incorrect' });
        return;
      }
      setQuantities((prev) => ({ ...prev, [resourceId]: newQty }));
      debouncedUpdate(resourceId, newQty);
    },
    [debouncedUpdate, toast]
  );

  const calculateDefaultValues = () => {
    const initialQuantities: ResourceQuantities = {};
    planModalityActivitySchoolResources?.body.data.forEach((resource) => {
      const total = resource.planModalityActivityResource?.qty ?? 0;
      const calculate = Math.round(total / (planModalityActivitySchools?.body.data.length ?? 0));
      const available =
        (resource.planModalityActivityResource?.qty ?? 0) +
        resource.resourcesQty -
        (resource.planModalityActivityResource?.planModalityActivitySchoolResources?.reduce(
          (pre, cur) => cur.resourcesQty + pre,
          0
        ) ?? 0);

      const newQty = calculate > available ? available : calculate;
      initialQuantities[resource.id] = newQty;
      update({
        params: { id: resource.id },
        body: { data: { resourcesQty: newQty } },
      });
    });
    setQuantities(initialQuantities);
  };

  return (
    <div className="my-6 space-y-2">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div>
          <h3 className="text-lg font-medium">{dictionary.resources.heading}</h3>
          <p className="text-sm text-muted-foreground">{dictionary.resources.description}</p>
        </div>
        <div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" disabled={isLoading}>
                {isLoading && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
                Calculate Default Values
              </Button>
            </AlertDialogTrigger>
            <p className="mt-1 text-xs">
              {dictionary.resources.schoolQty}: {planModalityActivitySchools?.body.data.length ?? 0}
            </p>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{dictionary.resources.confirmModal.title}</AlertDialogTitle>
                <AlertDialogDescription>
                  {dictionary.resources.confirmModal.description}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {dictionary.resources.confirmModal.buttons.cancel}
                </AlertDialogCancel>
                <AlertDialogAction onClick={calculateDefaultValues}>
                  {dictionary.resources.confirmModal.buttons.confirm}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <Separator />
      <Table className="mt-8">
        <TableHeader>
          <TableRow>
            <TableHead className="w-6/12">{dictionary.resources.table.columns.resource}</TableHead>
            <TableHead className="w-2/12">{dictionary.resources.table.columns.qtyTotal}</TableHead>
            <TableHead className="w-2/12">
              {dictionary.resources.table.columns.qtyAvailable}
            </TableHead>
            <TableHead className="w-2/12">{dictionary.resources.table.columns.qty}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {planModalityActivitySchoolResources?.body.data.length ? (
            planModalityActivitySchoolResources.body.data.map((field) => {
              const available =
                (field.planModalityActivityResource?.qty ?? 0) +
                field.resourcesQty -
                (field.planModalityActivityResource?.planModalityActivitySchoolResources?.reduce(
                  (pre, cur) => cur.resourcesQty + pre,
                  0
                ) ?? 0);
              return (
                <TableRow key={field.id}>
                  <TableCell>{field.planModalityActivityResource?.resource?.name}</TableCell>
                  <TableCell>{field.planModalityActivityResource?.qty ?? 0}</TableCell>
                  <TableCell>{available}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      placeholder="Qty"
                      disabled={isLoading}
                      value={quantities[field.id] ?? 0}
                      onChange={(e) =>
                        handleQuantityChange(available, field.id, parseInt(e.target.value, 10) || 0)
                      }
                      min="0"
                      max={available > 0 ? available : 0}
                      className="w-full"
                    />
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={2} className="h-24 text-center">
                <div className="text-sm font-medium text-muted-foreground">
                  {dictionary.professional.table.empty}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
