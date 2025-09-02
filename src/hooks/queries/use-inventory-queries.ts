import type { ParseServerSearchParamsReturnType } from '@/utils/query';

import { api } from '@/clients/api';
import { getQueryKey } from '@/utils/get-query-key';
import { useQuery } from '@tanstack/react-query';
import isEqual from 'lodash/isEqual';

const findManyQueryKey = getQueryKey(
  'inventory',
  'findMany'
)({
  query: {
    sort: { createdAt: 'desc' },
    page: 1,
    limit: 10,
  },
});

type GetInventoriesQueryKeyParams = (typeof findManyQueryKey)[2]['query'] &
  Pick<ParseServerSearchParamsReturnType, 'deboucedSearchText'>;

export function getInventoriesQueryKey(
  { deboucedSearchText, ...args }: GetInventoriesQueryKeyParams = findManyQueryKey[2].query
): typeof findManyQueryKey {
  if (!deboucedSearchText && isEqual(args, findManyQueryKey[2])) {
    return findManyQueryKey;
  }

  findManyQueryKey[2] = {
    query: {
      ...findManyQueryKey[2].query,
      ...args,
      where: deboucedSearchText ? { _or: [{ name: { like: deboucedSearchText } }] } : undefined,
    },
  };
  return findManyQueryKey;
}

/** Get inventories paginated reponse */
export const useGetInventories = (args?: Parameters<typeof getInventoriesQueryKey>[0]) => {
  const queryKey = getInventoriesQueryKey(args);
  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.inventory.findMany.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};
