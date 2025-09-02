import * as Layout from '@/components/layout';
import { DataTableSkeleton, PageHeaderSkeleton } from '@/components/skeletons';

export default function SchoolsLoading() {
  return (
    <Layout.Root>
      <Layout.Header>
        <PageHeaderSkeleton />
      </Layout.Header>
      <Layout.Main>
        <article className="[&>*]:mb-12">
          <DataTableSkeleton id="sch" />
        </article>
      </Layout.Main>
    </Layout.Root>
  );
}
