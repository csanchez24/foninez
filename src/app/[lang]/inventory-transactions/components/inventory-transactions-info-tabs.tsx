'use client';

import type { ComponentType } from 'react';
import type { InventoryTransaction } from './@types';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InventoryTransactionsInfoTabsLoading } from './inventory-transactions-info-tabs-loading';

import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import { Separator } from '@/components/ui/separator';

const TabsInfo = dynamic(() => import('./inventory-transactions-tabs-info'));
const TabsInventory = dynamic(() => import('./inventory-transactions-info-tabs-resources'), {
  loading: InventoryTransactionsInfoTabsLoading,
});

const TABS = ['informacion', 'inventory'] as const;

const tabs = new Map<
  string,
  {
    component: ComponentType<{
      inventoryTransaction: InventoryTransaction | undefined;
    }>;
  }
>([
  [TABS[0], { component: TabsInfo }],
  [TABS[1], { component: TabsInventory }],
]);

export function InventoryTransactionsInfoTabs({
  inventoryTransaction,
}: {
  inventoryTransaction: InventoryTransaction | undefined;
}) {
  const [tab, setTab] = useState<string>(TABS[0]);
  const renderTabContent = useCallback(() => {
    const Component = tabs.get(tab)?.component ?? InventoryTransactionsInfoTabsLoading;
    return <Component inventoryTransaction={inventoryTransaction} />;
  }, [tab, inventoryTransaction]);

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
