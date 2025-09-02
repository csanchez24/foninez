import { Hydrate } from '@/components/hydrate';
import { Activities } from './components/activities';

import { api } from '@/clients/api';
import { getPlanModalityActivitySchoolsQueryKey } from '@/hooks/queries/use-plan-modality-activity-school-queries';
import { getQueryClient, parseServerSearchParams } from '@/utils/query';
import { dehydrate } from '@tanstack/react-query';

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const queryClient = getQueryClient();
  const queryKey = getPlanModalityActivitySchoolsQueryKey(parseServerSearchParams(searchParams));
  await queryClient.prefetchQuery(queryKey, async () => {
    const activities = await api.planModalityActivitySchool.findMany.query(queryKey[2]);
    return JSON.parse(JSON.stringify(activities)) as typeof activities;
  });

  return (
    <Hydrate state={dehydrate(queryClient)}>
      <Activities />
    </Hydrate>
  );
}
