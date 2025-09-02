import type { Locale } from '@/i18n/config';

import { Hydrate } from '@/components/hydrate';
import { Plans } from './components/plans';

import { api } from '@/clients/api';
import { getPlansQueryKey } from '@/hooks/queries/use-plan-queries';
import { getQueryClient, parseServerSearchParams } from '@/utils/query';
import { dehydrate } from '@tanstack/react-query';

export default async function PlansPage({
  searchParams,
  params,
}: {
  searchParams: Record<string, string | string[] | undefined>;
  params: { lang: Locale };
}) {
  const queryClient = getQueryClient();
  const queryKey = getPlansQueryKey(parseServerSearchParams(searchParams));
  await queryClient.prefetchQuery(queryKey, async () => {
    const plans = await api.plan.findMany.query(queryKey[2]);
    return JSON.parse(JSON.stringify(plans)) as typeof plans;
  });

  return (
    <Hydrate state={dehydrate(queryClient)}>
      <Plans lang={params.lang} />
    </Hydrate>
  );
}
