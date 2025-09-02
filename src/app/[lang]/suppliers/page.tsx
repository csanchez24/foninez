import { Hydrate } from '@/components/hydrate';
import { Suppliers } from './components/suppliers';

import { api } from '@/clients/api';
import { getSuppliersQueryKey } from '@/hooks/queries/use-supplier-queries';
import { getQueryClient, parseServerSearchParams } from '@/utils/query';
import { dehydrate } from '@tanstack/react-query';

export default async function SuppliersPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const queryClient = getQueryClient();
  const queryKey = getSuppliersQueryKey(parseServerSearchParams(searchParams));
  await queryClient.prefetchQuery(queryKey, async () => {
    const suppliers = await api.supplier.findMany.query(queryKey[2]);
    return JSON.parse(JSON.stringify(suppliers)) as typeof suppliers;
  });

  return (
    <Hydrate state={dehydrate(queryClient)}>
      <Suppliers />
    </Hydrate>
  );
}
