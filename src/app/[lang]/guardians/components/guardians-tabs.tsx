'use client';

import type { ComponentType } from 'react';
import type { Guardian } from './@types';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GuardiansTabsLoading } from './guardians-tabs-loading';

import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import { Separator } from '@/components/ui/separator';

const TabsInfo = dynamic(() => import('./guardians-tabs-info'));
const TabsActivity = dynamic(() => import('./guardians-tabs-children'), {
  loading: GuardiansTabsLoading,
});

const TABS = ['informacion', 'children'] as const;

const tabs = new Map<
  string,
  {
    component: ComponentType<{
      guardian: Guardian | undefined;
    }>;
  }
>([
  [TABS[0], { component: TabsInfo }],
  [TABS[1], { component: TabsActivity }],
]);

export function GuardiansTabs({ guardian }: { guardian: Guardian | undefined }) {
  const [tab, setTab] = useState<string>(TABS[0]);
  const renderTabContent = useCallback(() => {
    const Component = tabs.get(tab)?.component ?? GuardiansTabsLoading;
    return <Component guardian={guardian} />;
  }, [tab, guardian]);

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
