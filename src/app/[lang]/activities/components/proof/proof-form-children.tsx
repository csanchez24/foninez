'use client';

import { Separator } from '@/components/ui/separator';
import { useStoreContext } from '@/store';
import type { Activity, ActivityProofFormValues } from '../@types';

import { useGetPlanModalityActivitySchoolChildren } from '@/hooks/queries/use-plan-modality-activity-school-children-queries';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

export default function FormFiles({
  activity,
  onOpened: _,
}: {
  activity?: Activity;
  onOpened(opened: boolean): void;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.activity.proof.children);

  const { data: planModalityActivitySchoolChildren } = useGetPlanModalityActivitySchoolChildren({
    planModalityActivitySchoolId: activity?.id,
    where: {
      planModalityActivitySchoolId: activity?.id,
      status: 'confirmed',
    },
    limit: 10000,
  });

  const form = useFormContext<ActivityProofFormValues>();

  const { fields, replace, update } = useFieldArray({
    keyName: 'id',
    name: 'planModalityActivitySchoolProofChildAttendance',
    control: form.control,
  });

  useEffect(() => {
    if (
      planModalityActivitySchoolChildren &&
      planModalityActivitySchoolChildren?.body?.data?.length > 0
    ) {
      const data =
        planModalityActivitySchoolChildren?.body.data?.map((c) => {
          return {
            planModalityActivitySchoolChildId: c.id,
            attended: false,
            name: `${c.child?.firstName} ${c.child?.lastName}`,
            planModalityActivitySchoolProofResourcesId: [],
          };
        }) ?? [];
      replace(data);
    }
  }, [activity, replace, planModalityActivitySchoolChildren]);

  const markedAll = () => {
    const data =
      planModalityActivitySchoolChildren?.body.data?.map((c) => {
        return {
          planModalityActivitySchoolChildId: c.id,
          attended: true,
          name: `${c.child?.firstName} ${c.child?.lastName}`,
          planModalityActivitySchoolProofResourcesId:
            activity?.planModalityActivitySchoolsResources?.map((r) => r.id) ?? [],
        };
      }) ?? [];
    form.setValue('planModalityActivitySchoolProofChildAttendance', data);
  };
  const markedNoAll = () => {
    const data =
      planModalityActivitySchoolChildren?.body.data?.map((c) => {
        return {
          planModalityActivitySchoolChildId: c.id,
          attended: false,
          name: `${c.child?.firstName} ${c.child?.lastName}`,
          planModalityActivitySchoolProofResourcesId: [],
        };
      }) ?? [];
    form.setValue('planModalityActivitySchoolProofChildAttendance', data);
  };

  return (
    <div className="my-6 space-y-2">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div>
          <h3 className="text-lg font-medium">{dictionary.heading}</h3>
          <p className="text-sm text-muted-foreground">{dictionary.description}</p>
        </div>
      </div>
      <div className="flex justify-end gap-4 py-8">
        <Button type="button" className="" onClick={markedAll}>
          {dictionary.buttons.mark}
        </Button>
        <Button type="button" className="" onClick={markedNoAll} variant="outline">
          {dictionary.buttons.unMark}
        </Button>
      </div>
      <Separator />
      {fields.map((field, index) => (
        <div key={`field-array-${index}`} className="border  p-2">
          <FormField
            control={form.control}
            name={`planModalityActivitySchoolProofChildAttendance.${index}.attended`}
            render={({ field: _ }) => (
              <div className="flex w-full items-center ">
                <FormItem className="flex w-full items-center gap-3 space-y-0">
                  <FormControl>
                    <Switch
                      checked={field.attended}
                      onCheckedChange={(checked) => {
                        return checked
                          ? update(index, {
                              planModalityActivitySchoolChildId:
                                field.planModalityActivitySchoolChildId,
                              attended: true,
                              name: field.name,
                              planModalityActivitySchoolProofResourcesId: [],
                            })
                          : update(index, {
                              planModalityActivitySchoolProofResourcesId: [],
                              planModalityActivitySchoolChildId:
                                field.planModalityActivitySchoolChildId,
                              attended: false,
                              name: field.name,
                            });
                      }}
                    />
                  </FormControl>
                  <FormLabel className="mt-0 flex-1">{field.name}</FormLabel>
                  <FormMessage />
                </FormItem>
              </div>
            )}
          />
          {field.attended && (
            <div className="mt-4 flex flex-col gap-2 pl-4">
              {activity?.planModalityActivitySchoolsResources
                ?.filter(
                  (r) => r.planModalityActivityResource?.resource?.usageType === 'individual'
                )
                ?.map((resource) => (
                  <FormField
                    key={`child-resource-${resource.id}`}
                    control={form.control}
                    name={`planModalityActivitySchoolProofChildAttendance.${index}.planModalityActivitySchoolProofResourcesId`}
                    render={({ field: _ }) => (
                      <div className="flex w-full items-center ">
                        <FormItem className="flex w-full items-center gap-3 space-y-0">
                          <FormControl>
                            <Switch
                              checked={field.planModalityActivitySchoolProofResourcesId?.some(
                                (r) => r === resource.id
                              )}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? update(index, {
                                      planModalityActivitySchoolProofResourcesId: [
                                        ...(field.planModalityActivitySchoolProofResourcesId ?? []),
                                        resource.id,
                                      ],
                                      planModalityActivitySchoolChildId:
                                        field.planModalityActivitySchoolChildId,
                                      attended: true,
                                      name: field.name,
                                    })
                                  : update(index, {
                                      planModalityActivitySchoolProofResourcesId:
                                        field.planModalityActivitySchoolProofResourcesId?.filter(
                                          (r) => r != resource.id
                                        ),
                                      planModalityActivitySchoolChildId:
                                        field.planModalityActivitySchoolChildId,
                                      attended: true,
                                      name: field.name,
                                    });
                              }}
                            />
                          </FormControl>
                          <FormLabel className="mt-0 flex-1">
                            {resource.planModalityActivityResource?.resource?.name ?? ''}
                          </FormLabel>
                          <FormMessage />
                        </FormItem>
                      </div>
                    )}
                  />
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
