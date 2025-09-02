'use client';

import type { ComponentType } from 'react';
import type { Supplier } from './@types';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SuppliersTabsLoading } from './suppliers-tabs-loading';

import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import { Separator } from '@/components/ui/separator';

const TabsInfo = dynamic(() => import('./suppliers-tabs-info'));
const TabsActivity = dynamic(() => import('./suppliers-tabs-resources'), {
  loading: SuppliersTabsLoading,
});

const TABS = ['informacion', 'resources'] as const;

const tabs = new Map<
  string,
  {
    component: ComponentType<{
      supplier: Supplier | undefined;
    }>;
  }
>([
  [TABS[0], { component: TabsInfo }],
  [TABS[1], { component: TabsActivity }],
]);

export function SuppliersTabs({ supplier }: { supplier: Supplier | undefined }) {
  const [tab, setTab] = useState<string>(TABS[0]);
  const renderTabContent = useCallback(() => {
    const Component = tabs.get(tab)?.component ?? SuppliersTabsLoading;
    return <Component supplier={supplier} />;
  }, [tab, supplier]);

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
