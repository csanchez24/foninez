import type { ParseServerSearchParamsReturnType } from '@/utils/query';

import { api } from '@/clients/api';
import { useToast } from '@/components/ui/use-toast';
import { getQueryKey } from '@/utils/get-query-key';
import { invalidateQueries } from '@/utils/query';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const findManyQueryKey = getQueryKey(
  'guardian',
  'findMany'
)({
  query: {
    sort: { createdAt: 'desc' },
    page: 1,
    limit: 10,
    include: {
      identification: true,
      children: true,
    },
  },
});

type GetGuardiansQueryKeyParams = (typeof findManyQueryKey)[2]['query'] &
  Pick<ParseServerSearchParamsReturnType, 'deboucedSearchText'>;

/** Get paginated shools response */
export function getGuardiansQueryKey(
  { deboucedSearchText, ...args }: GetGuardiansQueryKeyParams = findManyQueryKey[2].query
): typeof findManyQueryKey {
  findManyQueryKey[2] = {
    query: {
      ...findManyQueryKey[2].query,
      ...args,
      where: deboucedSearchText
        ? {
            _or: [
              { firstName: { like: deboucedSearchText } },
              { lastName: { like: deboucedSearchText } },
              { middleName: { like: deboucedSearchText } },
            ],
          }
        : undefined,
    },
  };
  return findManyQueryKey;
}

export const useGetGuardians = (args?: Parameters<typeof getGuardiansQueryKey>[0]) => {
  const queryKey = getGuardiansQueryKey(args);
  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.guardian.findMany.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};

export function getGuardianQueryKey(id: number) {
  return getQueryKey('guardian', 'findUnique')({ query: {}, params: { id } });
}

/** Get single guardian by id */
export const useGetGuardian = (id: number | undefined) => {
  const queryKey = id ? getGuardianQueryKey(id) : [];

  return useQuery({
    enabled: !!id,
    queryKey,
    queryFn: async () => {
      const res = await api.guardian.findUnique.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};

/** Create a guardian */
export const useCreateGuardian = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.guardian.create.useMutation({
    async onSuccess() {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([getGuardiansQueryKey()]),
      });
      toast({ description: 'Guardian was successfully created.' });
      onSuccess?.();
    },
    onError(e) {
      if (e.status === 400 || e.status === 500) {
        toast({
          variant: 'destructive',
          title: 'Unable to create guardian',
          description: e.body.message,
        });
      } else {
        toast({
          variant: 'destructive',
          description: 'Something went wrong. Try again!',
        });
      }
      onError?.();
    },
  });
};

/** Update a guardian */
export const useUpdateGuardian = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.guardian.update.useMutation({
    async onSuccess({ body }) {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([
          [...getGuardianQueryKey(body.id), body.id],
          getGuardiansQueryKey(),
        ]),
      });
      toast({
        description: 'Guardian was successfully updated.',
      });
      onSuccess?.();
    },
    onError(e) {
      if (e.status === 400 || e.status === 404 || e.status === 500) {
        toast({
          variant: 'destructive',
          title: 'Unable to update guardian.',
          description: e.body.message,
        });
      } else {
        toast({
          variant: 'destructive',
          description: 'Something went wrong while updating guardian.',
        });
      }
      onError?.();
    },
  });
};

/** Delete guardian */
export const useDeleteGuardian = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.guardian.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: invalidateQueries([getGuardiansQueryKey()]),
      });
      toast({
        description: 'Guardian was successfully deleted.',
      });
    },
    onError() {
      toast({
        variant: 'destructive',
        description: 'Unable to delete guardian.',
      });
    },
  });
};
