import { Hydrate } from '@/components/hydrate';
import { Professionals } from './components/professionals';

import { api } from '@/clients/api';
import { getProfessionalsQueryKey } from '@/hooks/queries/use-professional-queries';
import { getQueryClient, parseServerSearchParams } from '@/utils/query';
import { dehydrate } from '@tanstack/react-query';

export default async function ProfessionalsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const queryClient = getQueryClient();
  const queryKey = getProfessionalsQueryKey(parseServerSearchParams(searchParams));
  await queryClient.prefetchQuery(queryKey, async () => {
    const professionals = await api.professional.findMany.query(queryKey[2]);
    return JSON.parse(JSON.stringify(professionals)) as typeof professionals;
  });

  return (
    <Hydrate state={dehydrate(queryClient)}>
      <Professionals />
    </Hydrate>
  );
}
