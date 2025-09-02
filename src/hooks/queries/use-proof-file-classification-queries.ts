import type { ParseServerSearchParamsReturnType } from '@/utils/query';

import { api } from '@/clients/api';
import { useToast } from '@/components/ui/use-toast';
import { getQueryKey } from '@/utils/get-query-key';
import { invalidateQueries } from '@/utils/query';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const findManyQueryKey = getQueryKey(
  'proofFileClassification',
  'findMany'
)({
  query: {
    sort: { createdAt: 'desc' },
    page: 1,
    limit: 10,
  },
});

type GetProofFileClassificationsQueryKeyParams = (typeof findManyQueryKey)[2]['query'] &
  Pick<ParseServerSearchParamsReturnType, 'deboucedSearchText'>;

/** Get paginated shools response */
export function getProofFileClassificationsQueryKey(
  { deboucedSearchText, ...args }: GetProofFileClassificationsQueryKeyParams = findManyQueryKey[2]
    .query
): typeof findManyQueryKey {
  findManyQueryKey[2] = {
    query: {
      ...findManyQueryKey[2].query,
      ...args,
      where: deboucedSearchText ? {} : undefined,
    },
  };
  return findManyQueryKey;
}

export const useGetProofFileClassifications = (
  args?: Parameters<typeof getProofFileClassificationsQueryKey>[0]
) => {
  const queryKey = getProofFileClassificationsQueryKey(args);
  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.proofFileClassification.findMany.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};

export function getProofFileClassificationQueryKey(id: number) {
  return getQueryKey('proofFileClassification', 'findUnique')({ query: {}, params: { id } });
}

/** Get single proofFileClassification by id */
export const useGetProofFileClassification = (id: number | undefined) => {
  const queryKey = id ? getProofFileClassificationQueryKey(id) : [];

  return useQuery({
    enabled: !!id,
    queryKey,
    queryFn: async () => {
      const res = await api.proofFileClassification.findUnique.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};

/** Create a proofFileClassification */
export const useCreateProofFileClassification = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.proofFileClassification.create.useMutation({
    async onSuccess() {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([getProofFileClassificationsQueryKey()]),
      });
      toast({ description: 'ProofFileClassification was successfully created.' });
      onSuccess?.();
    },
    onError(e) {
      if (e.status === 400 || e.status === 500) {
        toast({
          variant: 'destructive',
          title: 'Unable to create proofFileClassification',
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

/** Update a proofFileClassification */
export const useUpdateProofFileClassification = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.proofFileClassification.update.useMutation({
    async onSuccess({ body }) {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([
          [...getProofFileClassificationQueryKey(body.id), body.id],
          getProofFileClassificationsQueryKey(),
        ]),
      });
      toast({
        description: 'ProofFileClassification was successfully updated.',
      });
      onSuccess?.();
    },
    onError(e) {
      if (e.status === 400 || e.status === 404 || e.status === 500) {
        toast({
          variant: 'destructive',
          title: 'Unable to update proofFileClassification.',
          description: e.body.message,
        });
      } else {
        toast({
          variant: 'destructive',
          description: 'Something went wrong while updating proofFileClassification.',
        });
      }
      onError?.();
    },
  });
};

/** Delete proofFileClassification */
export const useDeleteProofFileClassification = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.proofFileClassification.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: invalidateQueries([getProofFileClassificationsQueryKey()]),
      });
      toast({
        description: 'ProofFileClassification was successfully deleted.',
      });
    },
    onError() {
      toast({
        variant: 'destructive',
        description: 'Unable to delete proofFileClassification.',
      });
    },
  });
};
