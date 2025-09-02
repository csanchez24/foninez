'use client';

import type { ComponentType } from 'react';
import type { Child } from './@types';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChildrenTabsLoading } from './children-tabs-loading';

import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import { Separator } from '@/components/ui/separator';

const TabsInfo = dynamic(() => import('./children-tabs-info'));
const TabsActivity = dynamic(() => import('./children-tabs-activities'), {
  loading: ChildrenTabsLoading,
});

const TABS = ['informacion', 'activities'] as const;

const tabs = new Map<
  string,
  {
    component: ComponentType<{
      child: Child | undefined;
    }>;
  }
>([
  [TABS[0], { component: TabsInfo }],
  [TABS[1], { component: TabsActivity }],
]);

export function ChildrenTabs({ child }: { child: Child | undefined }) {
  const [tab, setTab] = useState<string>(TABS[0]);
  const renderTabContent = useCallback(() => {
    const Component = tabs.get(tab)?.component ?? ChildrenTabsLoading;
    return <Component child={child} />;
  }, [tab, child]);

  return (
    <Tabs value={tab} onValueChange={(tab) => setTab(tab)} className="mt-4">
      <TabsList className="mb-4 grid w-fit grid-cols-2">
        {TABS.map((tab) => (
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
