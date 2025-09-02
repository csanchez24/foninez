'use client';

import type { ComponentType } from 'react';
import type { Professional } from './@types';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfessionalsTabsLoading } from './professionals-tabs-loading';

import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import { Separator } from '@/components/ui/separator';

const TabsInfo = dynamic(() => import('./professionals-tabs-info'));
const TabsActivity = dynamic(() => import('./professionals-tabs-activities'), {
  loading: ProfessionalsTabsLoading,
});

const TABS = ['informacion', 'activities'] as const;

const tabs = new Map<
  string,
  {
    component: ComponentType<{
      professional: Professional | undefined;
    }>;
  }
>([
  [TABS[0], { component: TabsInfo }],
  [TABS[1], { component: TabsActivity }],
]);

export function ProfessionalsTabs({ professional }: { professional: Professional | undefined }) {
  const [tab, setTab] = useState<string>(TABS[0]);
  const renderTabContent = useCallback(() => {
    const Component = tabs.get(tab)?.component ?? ProfessionalsTabsLoading;
    return <Component professional={professional} />;
  }, [tab, professional]);

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
