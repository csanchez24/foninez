'use client';

import type { ComponentType } from 'react';
import type { Program } from './@types';

import { TabsSkeleton } from '@/components/skeletons';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useStoreContext } from '@/store';
import dynamic from 'next/dynamic';
import { useCallback, useMemo, useState } from 'react';

const ProgramTabsPrimary = dynamic(() => import('./program-info-tabs-primary'));
const ProgramModalities = dynamic(() => import('./program-info-tabs-modalities'), {
  loading: TabsSkeleton,
});

export function ProgramInfoTabs({ program }: { program: Program | undefined }) {
  const dictionary = useStoreContext((state) => state.dictionary.program.info);

  const tabNames = useMemo(
    () => Object.values(dictionary.tabs) as [string, string, string],
    [dictionary.tabs]
  );
  const tabs = useMemo(
    () =>
      new Map<string, { component: ComponentType<{ program?: Program }> }>([
        [tabNames[0], { component: ProgramTabsPrimary }],
        [tabNames[1], { component: ProgramModalities }],
      ]),
    [tabNames]
  );
  const [tab, setTab] = useState<string>(tabNames[0]);
  const renderTabContent = useCallback(() => {
    const Component = tabs.get(tab)?.component ?? TabsSkeleton;
    return <Component program={program} />;
  }, [tabs, tab, program]);

  return (
    <Tabs value={tab} onValueChange={(tab) => setTab(tab)} className="mt-4">
      <TabsList className="mb-4 grid w-fit grid-cols-2">
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
