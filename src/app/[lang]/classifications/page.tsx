import type { Locale } from '@/i18n/config';

import { Hydrate } from '@/components/hydrate';
import { ProofFileClassifications } from './components/classifications';

import { api } from '@/clients/api';
import { getProofFileClassificationsQueryKey } from '@/hooks/queries/use-proof-file-classification-queries';
import { getQueryClient, parseServerSearchParams } from '@/utils/query';
import { dehydrate } from '@tanstack/react-query';

export default async function ProofFileClassificationsPage({
  searchParams,
  params,
}: {
  searchParams: Record<string, string | string[] | undefined>;
  params: { lang: Locale };
}) {
  const queryClient = getQueryClient();
  const queryKey = getProofFileClassificationsQueryKey(parseServerSearchParams(searchParams));
  await queryClient.prefetchQuery(queryKey, async () => {
    const classifications = await api.proofFileClassification.findMany.query(queryKey[2]);
    return JSON.parse(JSON.stringify(classifications)) as typeof classifications;
  });

  return (
    <Hydrate state={dehydrate(queryClient)}>
      <ProofFileClassifications lang={params.lang} />
    </Hydrate>
  );
}
