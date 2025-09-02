import type { ParseServerSearchParamsReturnType } from '@/utils/query';

import { api } from '@/clients/api';
import { getQueryKey } from '@/utils/get-query-key';
import { useQuery } from '@tanstack/react-query';
import isEqual from 'lodash/isEqual';

const findManyQueryKey = getQueryKey(
  'modalityType',
  'findMany'
)({
  query: {
    sort: { createdAt: 'desc' },
    page: 1,
    limit: 1000,
  },
});

type GetModalityTypesQueryKeyParams = (typeof findManyQueryKey)[2]['query'] &
  Pick<ParseServerSearchParamsReturnType, 'deboucedSearchText'>;

export function getModalityTypesQueryKey(
  { deboucedSearchText, ...args }: GetModalityTypesQueryKeyParams = findManyQueryKey[2].query
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

/** Get modalityTypes paginated reponse */
export const useGetModalityTypes = (args?: Parameters<typeof getModalityTypesQueryKey>[0]) => {
  const queryKey = getModalityTypesQueryKey(args);
  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.modalityType.findMany.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};
