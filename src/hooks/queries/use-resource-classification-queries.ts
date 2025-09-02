import type { ParseServerSearchParamsReturnType } from '@/utils/query';

import { api } from '@/clients/api';
import { useToast } from '@/components/ui/use-toast';
import { getQueryKey } from '@/utils/get-query-key';
import { invalidateQueries } from '@/utils/query';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const findManyQueryKey = getQueryKey(
  'resourceClassification',
  'findMany'
)({
  query: {
    sort: { createdAt: 'desc' },
    page: 1,
    limit: 10,
  },
});

type GetResourceClassificationsQueryKeyParams = (typeof findManyQueryKey)[2]['query'] &
  Pick<ParseServerSearchParamsReturnType, 'deboucedSearchText'>;

/** Get paginated shools response */
export function getResourceClassificationsQueryKey(
  { deboucedSearchText, ...args }: GetResourceClassificationsQueryKeyParams = findManyQueryKey[2]
    .query
): typeof findManyQueryKey {
  findManyQueryKey[2] = {
    query: {
      ...findManyQueryKey[2].query,
      ...args,
      where: deboucedSearchText ? { _or: [{ name: { like: deboucedSearchText } }] } : undefined,
    },
  };
  return findManyQueryKey;
}

export const useGetResourceClassifications = (
  args?: Parameters<typeof getResourceClassificationsQueryKey>[0]
) => {
  const queryKey = getResourceClassificationsQueryKey(args);
  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.resourceClassification.findMany.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};

export function getResourceClassificationQueryKey(id: number) {
  return getQueryKey('resourceClassification', 'findUnique')({ query: {}, params: { id } });
}

/** Get single resourceClassification by id */
export const useGetResourceClassification = (id: number | undefined) => {
  const queryKey = id ? getResourceClassificationQueryKey(id) : [];

  return useQuery({
    enabled: !!id,
    queryKey,
    queryFn: async () => {
      const res = await api.resourceClassification.findUnique.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};

/** Create a resourceClassification */
export const useCreateResourceClassification = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.resourceClassification.create.useMutation({
    async onSuccess() {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([getResourceClassificationsQueryKey()]),
      });
      toast({ description: 'Resource classification was successfully created.' });
      onSuccess?.();
    },
    onError(e) {
      if (e.status === 400 || e.status === 500) {
        toast({
          variant: 'destructive',
          title: 'Unable to create resourceClassification',
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

/** Update a resourceClassification */
export const useUpdateResourceClassification = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.resourceClassification.update.useMutation({
    async onSuccess({ body }) {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([
          [...getResourceClassificationQueryKey(body.id), body.id],
          getResourceClassificationsQueryKey(),
        ]),
      });
      toast({
        description: 'Resource classification was successfully updated.',
      });
      onSuccess?.();
    },
    onError(e) {
      if (e.status === 400 || e.status === 404 || e.status === 500) {
        toast({
          variant: 'destructive',
          title: 'Unable to update resourceClassification.',
          description: e.body.message,
        });
      } else {
        toast({
          variant: 'destructive',
          description: 'Something went wrong while updating resourceClassification.',
        });
      }
      onError?.();
    },
  });
};

/** Delete resourceClassification */
export const useDeleteResourceClassification = ({ onSuccess }: { onSuccess?(): void }) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.resourceClassification.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: invalidateQueries([getResourceClassificationsQueryKey()]),
      });
      toast({
        description: 'Resource classification was successfully deleted.',
      });
      onSuccess?.();
    },
    onError() {
      toast({
        variant: 'destructive',
        description: 'Unable to delete resourceClassification.',
      });
    },
  });
};
