import type { ParseServerSearchParamsReturnType } from '@/utils/query';

import { api } from '@/clients/api';
import { getQueryKey } from '@/utils/get-query-key';
import { useQuery } from '@tanstack/react-query';
import isEqual from 'lodash/isEqual';

const findManyQueryKey = getQueryKey(
  'serviceAipi',
  'findMany'
)({
  query: {
    sort: { createdAt: 'desc' },
    page: 1,
    limit: 1000,
  },
});

type GetServicesAipiQueryKeyParams = (typeof findManyQueryKey)[2]['query'] &
  Pick<ParseServerSearchParamsReturnType, 'deboucedSearchText'>;

export function getServicesAipiQueryKey(
  { deboucedSearchText, ...args }: GetServicesAipiQueryKeyParams = findManyQueryKey[2].query
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

/** Get servicesAipi paginated reponse */
export const useGetServicesAipi = (args?: Parameters<typeof getServicesAipiQueryKey>[0]) => {
  const queryKey = getServicesAipiQueryKey(args);
  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.serviceAipi.findMany.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};
