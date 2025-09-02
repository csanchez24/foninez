import type { ParseServerSearchParamsReturnType } from '@/utils/query';

import { api } from '@/clients/api';
import { useToast } from '@/components/ui/use-toast';
import { getQueryKey } from '@/utils/get-query-key';
import { invalidateQueries } from '@/utils/query';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const findManyQueryKey = getQueryKey(
  'modality',
  'findMany'
)({
  query: {
    include: { program: true },
    sort: { createdAt: 'desc' },
    page: 1,
    limit: 10,
  },
});

type GetModalitiesQueryKeyParams = (typeof findManyQueryKey)[2]['query'] &
  Pick<ParseServerSearchParamsReturnType, 'deboucedSearchText'> & { programId?: number };

/** Get paginated shools response */
export function getModalitiesQueryKey(
  { deboucedSearchText, programId, ...args }: GetModalitiesQueryKeyParams = findManyQueryKey[2]
    .query
): typeof findManyQueryKey {
  findManyQueryKey[2] = {
    query: {
      ...findManyQueryKey[2].query,
      ...args,
      where: deboucedSearchText
        ? {
            ...(typeof programId !== 'undefined'
              ? { programId, _and: [{ name: { like: deboucedSearchText } }] }
              : { _or: [{ name: { like: deboucedSearchText } }] }),
          }
        : programId
          ? { programId }
          : undefined,
    },
  };
  return findManyQueryKey;
}

export const useGetModalities = (args?: Parameters<typeof getModalitiesQueryKey>[0]) => {
  const queryKey = getModalitiesQueryKey(args);
  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.modality.findMany.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};

export function getModalityQueryKey(id: number) {
  return getQueryKey('modality', 'findUnique')({ query: {}, params: { id } });
}

/** Get single modality by id */
export const useGetModality = (id: number | undefined) => {
  const queryKey = id ? getModalityQueryKey(id) : [];

  return useQuery({
    enabled: !!id,
    queryKey,
    queryFn: async () => {
      const res = await api.modality.findUnique.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};

/** Create a modality */
export const useCreateModality = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.modality.create.useMutation({
    async onSuccess() {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([getModalitiesQueryKey()]),
      });
      toast({ description: 'Modality was successfully created.' });
      onSuccess?.();
    },
    onError(e) {
      if (e.status === 400 || e.status === 500) {
        toast({
          variant: 'destructive',
          title: 'Unable to create modality',
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

/** Update a modality */
export const useUpdateModality = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.modality.update.useMutation({
    async onSuccess({ body }) {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([
          getModalitiesQueryKey(),
          [...getModalityQueryKey(body.id), body.id],
        ]),
      });
      toast({
        description: 'Modality was successfully updated.',
      });
      onSuccess?.();
    },
    onError(e) {
      if (e.status === 400 || e.status === 404 || e.status === 500) {
        toast({
          variant: 'destructive',
          title: 'Unable to update modality.',
          description: e.body.message,
        });
      } else {
        toast({
          variant: 'destructive',
          description: 'Something went wrong while updating modality.',
        });
      }
      onError?.();
    },
  });
};

/** Delete modality */
export const useDeleteModality = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.modality.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: invalidateQueries([getModalitiesQueryKey()]),
      });
      toast({
        description: 'Modality was successfully deleted.',
      });
    },
    onError() {
      toast({
        variant: 'destructive',
        description: 'Unable to delete modality.',
      });
    },
  });
};
