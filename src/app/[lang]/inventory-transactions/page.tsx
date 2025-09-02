import { Hydrate } from '@/components/hydrate';
import { InventoryTransactions } from './components/inventory-transactions';

import { api } from '@/clients/api';
import { getInventoryTransactionsQueryKey } from '@/hooks/queries/use-inventory-transaction-queries';
import { getQueryClient, parseServerSearchParams } from '@/utils/query';
import { dehydrate } from '@tanstack/react-query';

export default async function InventoryTransactionsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const queryClient = getQueryClient();
  const queryKey = getInventoryTransactionsQueryKey(parseServerSearchParams(searchParams));
  await queryClient.prefetchQuery(queryKey, async () => {
    const transactions = await api.inventoryTransaction.findMany.query(queryKey[2]);
    return JSON.parse(JSON.stringify(transactions)) as typeof transactions;
  });

  return (
    <Hydrate state={dehydrate(queryClient)}>
      <InventoryTransactions />
    </Hydrate>
  );
}
