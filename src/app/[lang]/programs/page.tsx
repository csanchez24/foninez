import type { Locale } from '@/i18n/config';

import { Hydrate } from '@/components/hydrate';
import { Programs } from './components/programs';

import { api } from '@/clients/api';
import { getProgramsQueryKey } from '@/hooks/queries/use-program-queries';
import { getQueryClient, parseServerSearchParams } from '@/utils/query';
import { dehydrate } from '@tanstack/react-query';

export default async function ProgramsPage({
  searchParams,
  params,
}: {
  searchParams: Record<string, string | string[] | undefined>;
  params: { lang: Locale };
}) {
  const queryClient = getQueryClient();
  const queryKey = getProgramsQueryKey(parseServerSearchParams(searchParams));
  await queryClient.prefetchQuery(queryKey, async () => {
    const programs = await api.program.findMany.query(queryKey[2]);
    return JSON.parse(JSON.stringify(programs)) as typeof programs;
  });

  return (
    <Hydrate state={dehydrate(queryClient)}>
      <Programs lang={params.lang} />
    </Hydrate>
  );
}
