import type { Locale } from '@/i18n/config';

import { Hydrate } from '@/components/hydrate';
import { ProgramModalities } from './components/programs-modalities';

import { api } from '@/clients/api';
import { getModalitiesQueryKey } from '@/hooks/queries/use-modality-queries';
import { getProgramQueryKey } from '@/hooks/queries/use-program-queries';
import { getQueryClient, parseServerSearchParams } from '@/utils/query';
import { dehydrate } from '@tanstack/react-query';

export default async function ProgramModalitiesPage({
  searchParams,
  params,
}: {
  searchParams: Record<string, string | string[] | undefined>;
  params: { lang: Locale; id: string };
}) {
  const programId = parseInt(params.id);
  if (isNaN(programId)) {
    throw new Error('Ensure to pass in a valid program id param');
  }

  const queryClient = getQueryClient();

  // Prefetch associated program
  const programQuery = getProgramQueryKey(programId);
  await queryClient.prefetchQuery(programQuery, async () => {
    const modalities = await api.program.findUnique.query(programQuery[2]);
    return JSON.parse(JSON.stringify(modalities)) as typeof modalities;
  });

  // Prefetch paginated data
  const modalitiesQueryKey = getModalitiesQueryKey({
    ...parseServerSearchParams(searchParams),
    programId,
  });
  await queryClient.prefetchQuery(modalitiesQueryKey, async () => {
    const modalities = await api.modality.findMany.query(modalitiesQueryKey[2]);
    return JSON.parse(JSON.stringify(modalities)) as typeof modalities;
  });

  return (
    <Hydrate state={dehydrate(queryClient)}>
      <ProgramModalities lang={params.lang} programId={programId} />
    </Hydrate>
  );
}
