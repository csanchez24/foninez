import type { ParseServerSearchParamsReturnType } from '@/utils/query';

import { api } from '@/clients/api';
import { getQueryKey } from '@/utils/get-query-key';
import { useQuery } from '@tanstack/react-query';
import isEqual from 'lodash/isEqual';

const findManyQueryKey = getQueryKey(
  'educationLevel',
  'findMany'
)({
  query: {
    sort: { createdAt: 'desc' },
    page: 1,
    limit: 1000,
  },
});

type GetEducationLevelsQueryKeyParams = (typeof findManyQueryKey)[2]['query'] &
  Pick<ParseServerSearchParamsReturnType, 'deboucedSearchText'>;

export function getEducationLevelsQueryKey(
  { deboucedSearchText, ...args }: GetEducationLevelsQueryKeyParams = findManyQueryKey[2].query
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

/** Get educationLevels paginated reponse */
export const useGetEducationLevels = (args?: Parameters<typeof getEducationLevelsQueryKey>[0]) => {
  const queryKey = getEducationLevelsQueryKey(args);
  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.educationLevel.findMany.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};
