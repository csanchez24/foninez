import { Hydrate } from '@/components/hydrate';
import { Children } from './components/children';

import { api } from '@/clients/api';
import { getChildrenQueryKey } from '@/hooks/queries/use-child-queries';
import { getQueryClient, parseServerSearchParams } from '@/utils/query';
import { dehydrate } from '@tanstack/react-query';

export default async function ChildrenPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const queryClient = getQueryClient();
  const queryKey = getChildrenQueryKey(parseServerSearchParams(searchParams));
  await queryClient.prefetchQuery(queryKey, async () => {
    const children = await api.child.findMany.query(queryKey[2]);
    return JSON.parse(JSON.stringify(children)) as typeof children;
  });

  return (
    <Hydrate state={dehydrate(queryClient)}>
      <Children />
    </Hydrate>
  );
}
