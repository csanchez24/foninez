import type { Locale } from '@/i18n/config';

import { Hydrate } from '@/components/hydrate';
import { PlanModalityActivities } from './components/plan-modality-activities';

import { api } from '@/clients/api';
import { getPlanModalityActivitiesQueryKey } from '@/hooks/queries/use-plan-modality-activity-queries';
import { getPlanQueryKey } from '@/hooks/queries/use-plan-queries';
import { getQueryClient, parseServerSearchParams } from '@/utils/query';
import { dehydrate } from '@tanstack/react-query';

export default async function PlanModalityActivitiesPage({
  searchParams,
  params,
}: {
  searchParams: Record<string, string | string[] | undefined>;
  params: { lang: Locale; id: string };
}) {
  const planId = parseInt(params.id);
  if (isNaN(planId)) {
    throw new Error('Ensure to pass in a valid plan id param');
  }

  const queryClient = getQueryClient();

  // Prefetch associated plan
  const planQueryKey = getPlanQueryKey(planId);
  await queryClient.prefetchQuery(planQueryKey, async () => {
    const planModalityActivities = await api.plan.findUnique.query(planQueryKey[2]);
    return JSON.parse(JSON.stringify(planModalityActivities)) as typeof planModalityActivities;
  });

  // Prefetch paginated data
  const planModalityActivitiesQueryKey = getPlanModalityActivitiesQueryKey({
    ...parseServerSearchParams(searchParams),
    planId,
  });
  await queryClient.prefetchQuery(planModalityActivitiesQueryKey, async () => {
    const planModalityActivities = await api.planModalityActivity.findMany.query(
      planModalityActivitiesQueryKey[2]
    );
    return JSON.parse(JSON.stringify(planModalityActivities)) as typeof planModalityActivities;
  });

  return (
    <Hydrate state={dehydrate(queryClient)}>
      <PlanModalityActivities lang={params.lang} planId={planId} />
    </Hydrate>
  );
}
