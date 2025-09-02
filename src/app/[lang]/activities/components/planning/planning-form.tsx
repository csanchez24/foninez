'use client';

import type { Activity } from '../@types';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import * as React from 'react';

import { useStoreContext } from '@/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import dynamic from 'next/dynamic';
import { FormSkeleton } from '../skeleton';
import { useGetPlanModalityActivitySchool } from '@/hooks/queries/use-plan-modality-activity-school-queries';

const FormMain = dynamic(() => import('./planning-form-main'));
const FormProfessional = dynamic(() => import('./planning-form-professional'));
const FormResources = dynamic(() => import('./planning-form-resources'), {
  loading: FormSkeleton,
});

export function PlanningFormSheet({
  activity,
  opened,
  onOpened,
}: {
  activity: Activity | undefined;
  opened: boolean;
  onOpened(opened: boolean): void;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.inventoryTransaction.form);
  const { data } = useGetPlanModalityActivitySchool(activity?.id);

  const handleOnOpenChange = React.useCallback(
    (opened: boolean) => {
      onOpened(opened);
    },
    [onOpened]
  );

  const tabNames = React.useMemo(
    () => Object.values(dictionary.tabs) as [string, string, string],
    [dictionary.tabs]
  );
  const tabs = React.useMemo(
    () =>
      new Map<
        string,
        { component: React.ComponentType<{ activity?: Activity; onOpened(opened: boolean): void }> }
      >([
        [tabNames[0], { component: FormMain }],
        [tabNames[1], { component: FormProfessional }],
        [tabNames[2], { component: FormResources }],
      ]),
    [tabNames]
  );
  const [tab, setTab] = React.useState<string>(tabNames[0]);
  const renderTabContent = React.useCallback(() => {
    const Component = tabs.get(tab)?.component ?? FormSkeleton;
    return <Component activity={data?.body} onOpened={onOpened} />;
  }, [tab, tabs, data, onOpened]);

  return (
    <>
      <Sheet open={opened} onOpenChange={handleOnOpenChange}>
        <SheetContent className="w-full overflow-y-scroll sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>
              <div>{dictionary.headings.new}</div>
            </SheetTitle>
            <SheetDescription>{dictionary.description}</SheetDescription>
          </SheetHeader>
          <Tabs value={tab} onValueChange={(tab) => setTab(tab)} className="mt-4">
            <TabsList className="grid w-fit grid-cols-3">
              {tabNames.map((tabName, tabIndex) => (
                <TabsTrigger
                  key={`tab-${tabName}`}
                  value={tabName}
                  className="text-xs capitalize sm:text-sm"
                  disabled={tabIndex === 2 && activity?.status !== 'planning'}
                >
                  {tabName}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={tab} className="space-y-2">
              {renderTabContent()}
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </>
  );
}
