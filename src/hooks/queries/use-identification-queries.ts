import type { ParseServerSearchParamsReturnType } from '@/utils/query';

import { api } from '@/clients/api';
import { getQueryKey } from '@/utils/get-query-key';
import { useQuery } from '@tanstack/react-query';
import isEqual from 'lodash/isEqual';

const findManyQueryKey = getQueryKey(
  'identification',
  'findMany'
)({
  query: {
    sort: { createdAt: 'desc' },
    page: 1,
    limit: 10,
  },
});

type GetIdentificationsQueryKeyParams = (typeof findManyQueryKey)[2]['query'] &
  Pick<ParseServerSearchParamsReturnType, 'deboucedSearchText'>;

export function getIdentificationsQueryKey(
  { deboucedSearchText, ...args }: GetIdentificationsQueryKeyParams = findManyQueryKey[2].query
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

/** Get cities paginated reponse */
export const useGetIdentifications = (args?: Parameters<typeof getIdentificationsQueryKey>[0]) => {
  const queryKey = getIdentificationsQueryKey(args);
  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.identification.findMany.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};
