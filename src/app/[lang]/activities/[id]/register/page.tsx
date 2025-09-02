import { Hydrate } from '@/components/hydrate';
import { Register } from './components/register';

import { api } from '@/clients/api';
import { getPlanModalityActivitySchoolChildrenQueryKey } from '@/hooks/queries/use-plan-modality-activity-school-children-queries';
import { getQueryClient, parseServerSearchParams } from '@/utils/query';
import { dehydrate } from '@tanstack/react-query';
import { getPlanModalityActivitySchoolQueryKey } from '@/hooks/queries/use-plan-modality-activity-school-queries';

export default async function RegisterPage({
  searchParams,
  params,
}: {
  searchParams: Record<string, string | string[] | undefined>;
  params: { id: number };
}) {
  const queryClient = getQueryClient();
  const queryKey = getPlanModalityActivitySchoolChildrenQueryKey(
    parseServerSearchParams(searchParams)
  );

  const queryKeyActivity = getPlanModalityActivitySchoolQueryKey(params.id);

  await queryClient.prefetchQuery(queryKey, async () => {
    const schools = await api.planModalityActivitySchoolChild.findMany.query(queryKey[2]);
    return JSON.parse(JSON.stringify(schools)) as typeof schools;
  });
  await queryClient.prefetchQuery(queryKey, async () => {
    const activity = await api.planModalityActivitySchool.findUnique.query(queryKeyActivity[2]);
    return JSON.parse(JSON.stringify(activity)) as typeof activity;
  });

  return (
    <Hydrate state={dehydrate(queryClient)}>
      <Register activityId={Number(params.id)} />
    </Hydrate>
  );
}
