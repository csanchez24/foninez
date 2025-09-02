'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as Layout from '@/components/layout';
import { ReportCoverage } from './report-coverage';
import { ReportMicrodato } from './report-microdato';
import { useStoreContext } from '@/store';
import { ReportResources } from './report-resources';

export function ReportTabs() {
  const dictionary = useStoreContext((state) => state.dictionary.reports);

  return (
    <Layout.Root>
      <Layout.Header>
        <div className="flex items-center justify-between gap-8">
          <div>
            <Layout.Heading>{dictionary.layout.title}</Layout.Heading>
          </div>
        </div>
      </Layout.Header>
      <Layout.Main>
        <Tabs defaultValue="coverage" className="">
          <TabsList>
            <TabsTrigger value="coverage">{dictionary.tabs.coverage.tab}</TabsTrigger>
            <TabsTrigger value="microdato">{dictionary.tabs.microdato.tab}</TabsTrigger>
            <TabsTrigger value="resources">{dictionary.tabs.resources.tab}</TabsTrigger>
          </TabsList>
          <TabsContent value="coverage">
            <div className="max-w-xl p-8">
              <ReportCoverage />
            </div>
          </TabsContent>
          <TabsContent value="microdato">
            <div className="max-w-xl p-8">
              <ReportMicrodato />
            </div>
          </TabsContent>
          <TabsContent value="resources">
            <div className="max-w-xl p-8">
              <ReportResources />
            </div>
          </TabsContent>
        </Tabs>
      </Layout.Main>
    </Layout.Root>
  );
}
