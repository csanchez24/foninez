'use client';

import type { ComponentType } from 'react';
import type { Modality } from './@types';

import { TabsSkeleton } from '@/components/skeletons';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useStoreContext } from '@/store';
import dynamic from 'next/dynamic';
import { useCallback, useMemo, useState } from 'react';

const ProgramModalityTabsPrimary = dynamic(() => import('./program-modality-info-tabs-primary'));

export function ProgramModalityInfoTabs({ modality }: { modality: Modality | undefined }) {
  const dictionary = useStoreContext((state) => state.dictionary.modality.info);

  const tabNames = useMemo(
    () => Object.values(dictionary.tabs) as [string, string, string],
    [dictionary.tabs]
  );
  const tabs = useMemo(
    () =>
      new Map<string, { component: ComponentType<{ modality?: Modality }> }>([
        [tabNames[0], { component: ProgramModalityTabsPrimary }],
      ]),
    [tabNames]
  );
  const [tab, setTab] = useState<string>(tabNames[0]);
  const renderTabContent = useCallback(() => {
    const Component = tabs.get(tab)?.component ?? TabsSkeleton;
    return <Component modality={modality} />;
  }, [tabs, tab, modality]);

  return (
    <Tabs value={tab} onValueChange={(tab) => setTab(tab)} className="mt-4">
      <TabsList className="mb-4 grid w-fit grid-cols-1">
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
