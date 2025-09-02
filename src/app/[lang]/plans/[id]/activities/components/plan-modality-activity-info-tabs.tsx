'use client';

import type { ComponentType } from 'react';
import type { PlanModalityActivity } from './@types';

import { TabsSkeleton } from '@/components/skeletons';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useStoreContext } from '@/store';
import dynamic from 'next/dynamic';
import { useCallback, useMemo, useState } from 'react';

const PlanModalityActivityTabsPrimary = dynamic(
  () => import('./plan-modality-activity-info-tabs-primary')
);
const PlanModalityActivitySchools = dynamic(
  () => import('./plan-modality-activity-info-tabs-schools'),
  {
    loading: TabsSkeleton,
  }
);
const PlanModalityActivityResources = dynamic(
  () => import('./plan-modality-activity-info-tabs-resources'),
  {
    loading: TabsSkeleton,
  }
);
const PlanModalityActivityProofFiles = dynamic(
  () => import('./plan-modality-activity-info-tabs-proof-files'),
  {
    loading: TabsSkeleton,
  }
);

export function ActivityInfoTabs({
  planModalityActivity,
}: {
  planModalityActivity: PlanModalityActivity | undefined;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.planModalityActivity.info);

  const tabNames = useMemo(
    () => Object.values(dictionary.tabs) as [string, string, string, string],
    [dictionary.tabs]
  );
  const tabs = useMemo(
    () =>
      new Map<
        string,
        { component: ComponentType<{ planModalityActivity?: PlanModalityActivity }> }
      >([
        [tabNames[0], { component: PlanModalityActivityTabsPrimary }],
        [tabNames[1], { component: PlanModalityActivitySchools }],
        [tabNames[2], { component: PlanModalityActivityResources }],
        [tabNames[3], { component: PlanModalityActivityProofFiles }],
      ]),
    [tabNames]
  );
  const [tab, setTab] = useState<string>(tabNames[0]);
  const renderTabContent = useCallback(() => {
    const Component = tabs.get(tab)?.component ?? TabsSkeleton;
    return <Component planModalityActivity={planModalityActivity} />;
  }, [tabs, tab, planModalityActivity]);

  return (
    <Tabs value={tab} onValueChange={(tab) => setTab(tab)} className="mt-4">
      <TabsList className="mb-4 grid w-fit grid-cols-4">
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
