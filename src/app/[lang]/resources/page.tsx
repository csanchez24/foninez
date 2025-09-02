import { Hydrate } from '@/components/hydrate';
import { Resources } from './components/resources';

import { api } from '@/clients/api';
import { getResourcesQueryKey } from '@/hooks/queries/use-resource-queries';
import { getQueryClient, parseServerSearchParams } from '@/utils/query';
import { dehydrate } from '@tanstack/react-query';

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const queryClient = getQueryClient();
  const queryKey = getResourcesQueryKey(parseServerSearchParams(searchParams));
  await queryClient.prefetchQuery(queryKey, async () => {
    const resources = await api.resource.findMany.query(queryKey[2]);
    return JSON.parse(JSON.stringify(resources)) as typeof resources;
  });

  return (
    <Hydrate state={dehydrate(queryClient)}>
      <Resources />
    </Hydrate>
  );
}
