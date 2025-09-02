import { Hydrate } from '@/components/hydrate';
import { Schools } from './components/schools';

import { api } from '@/clients/api';
import { getSchoolsQueryKey } from '@/hooks/queries/use-school-queries';
import { getQueryClient, parseServerSearchParams } from '@/utils/query';
import { dehydrate } from '@tanstack/react-query';

export default async function SchoolsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const queryClient = getQueryClient();
  const queryKey = getSchoolsQueryKey(parseServerSearchParams(searchParams));
  await queryClient.prefetchQuery(queryKey, async () => {
    const schools = await api.school.findMany.query(queryKey[2]);
    return JSON.parse(JSON.stringify(schools)) as typeof schools;
  });

  return (
    <Hydrate state={dehydrate(queryClient)}>
      <Schools />
    </Hydrate>
  );
}
