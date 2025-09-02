'use client';

import type { ComponentType } from 'react';
import type { Activity } from './@types';

import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabsLoading } from './skeleton';

import dynamic from 'next/dynamic';
import { useCallback, useMemo, useState } from 'react';
import { useStoreContext } from '@/store';
import { useGetPlanModalityActivitySchool } from '@/hooks/queries/use-plan-modality-activity-school-queries';

const TabsInfo = dynamic(() => import('./activity-tabs-info'));

const TabsProfessionals = dynamic(() => import('./activity-info-tabs-professionals'), {
  loading: TabsLoading,
});
const TabsResources = dynamic(() => import('./activity-info-tabs-resources'), {
  loading: TabsLoading,
});

const TabsChildren = dynamic(() => import('./activity-info-tabs-children'), {
  loading: TabsLoading,
});

const TabsProofs = dynamic(() => import('./activity-info-tabs-proofs'), {
  loading: TabsLoading,
});

export function ActivityInfoTabs({ activity }: { activity: Activity | undefined }) {
  const dictionary = useStoreContext((state) => state.dictionary.activity.info);
  const { data } = useGetPlanModalityActivitySchool(activity?.id);

  const tabNames = useMemo(
    () => Object.values(dictionary.tabs) as [string, string, string, string, string],
    [dictionary.tabs]
  );
  const tabs = useMemo(
    () =>
      new Map<string, { component: ComponentType<{ activity: Activity | undefined }> }>([
        [tabNames[0], { component: TabsInfo }],
        [tabNames[1], { component: TabsProfessionals }],
        [tabNames[2], { component: TabsResources }],
        [tabNames[3], { component: TabsChildren }],
        [tabNames[4], { component: TabsProofs }],
      ]),
    [tabNames]
  );

  const [tab, setTab] = useState<string>(tabNames[0]);
  const renderTabContent = useCallback(() => {
    const Component = tabs.get(tab)?.component ?? TabsLoading;
    return <Component activity={data?.body} />;
  }, [tabs, tab, data]);

  return (
    <Tabs value={tab} onValueChange={(tab) => setTab(tab)} className="mt-4">
      <TabsList className="mb-4 grid w-fit grid-cols-5">
        {tabNames.map((tab) => (
          <TabsTrigger key={`tab-${tab}`} value={tab} className="text-xs capitalize sm:text-sm">
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
      <Separator />
      <TabsContent value={tab} className="space-y-2">
        {renderTabContent()}
      </TabsContent>
    </Tabs>
  );
}
