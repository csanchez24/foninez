import { Hydrate } from '@/components/hydrate';
import { Guardians } from './components/guardians';

import { api } from '@/clients/api';
import { getGuardiansQueryKey } from '@/hooks/queries/use-guardian-queries';
import { getQueryClient, parseServerSearchParams } from '@/utils/query';
import { dehydrate } from '@tanstack/react-query';

export default async function GuardiansPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const queryClient = getQueryClient();
  const queryKey = getGuardiansQueryKey(parseServerSearchParams(searchParams));
  await queryClient.prefetchQuery(queryKey, async () => {
    const guardians = await api.guardian.findMany.query(queryKey[2]);
    return JSON.parse(JSON.stringify(guardians)) as typeof guardians;
  });

  return (
    <Hydrate state={dehydrate(queryClient)}>
      <Guardians />
    </Hydrate>
  );
}
