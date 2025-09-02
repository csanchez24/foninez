import type { ParseServerSearchParamsReturnType } from '@/utils/query';

import { api } from '@/clients/api';
import { useToast } from '@/components/ui/use-toast';
import { getQueryKey } from '@/utils/get-query-key';
import { invalidateQueries } from '@/utils/query';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const findManyQueryKey = getQueryKey(
  'resource',
  'findMany'
)({
  query: {
    include: {
      resourceClassification: true,
      inventory: true,
      resourcesToSuppliers: {
        with: {
          resource: true,
          supplier: true,
        },
      },
      inventoryTransactionLines: {
        with: {
          inventoryTransaction: {
            with: {
              planModalityActivitySchool: {
                with: {
                  school: true,
                  planModalityActivity: true,
                },
              },
            },
          },
        },
      },
    },
    sort: { createdAt: 'desc' },
    page: 1,
    limit: 10,
  },
});

type GetResourcesQueryKeyParams = (typeof findManyQueryKey)[2]['query'] &
  Pick<ParseServerSearchParamsReturnType, 'deboucedSearchText'>;

/** Get paginated shools response */
export function getResourcesQueryKey(
  { deboucedSearchText, ...args }: GetResourcesQueryKeyParams = findManyQueryKey[2].query
): typeof findManyQueryKey {
  findManyQueryKey[2] = {
    query: {
      ...findManyQueryKey[2].query,
      ...args,
      where: deboucedSearchText
        ? {
            _or: [{ name: { like: deboucedSearchText } }],
          }
        : undefined,
    },
  };
  return findManyQueryKey;
}

export const useGetResources = (args?: Parameters<typeof getResourcesQueryKey>[0]) => {
  const queryKey = getResourcesQueryKey(args);
  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.resource.findMany.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};

export function getResourceQueryKey(id: number) {
  return getQueryKey('resource', 'findUnique')({ query: {}, params: { id } });
}

/** Get single resource by id */
export const useGetResource = (id: number | undefined) => {
  const queryKey = id ? getResourceQueryKey(id) : [];

  return useQuery({
    enabled: !!id,
    queryKey,
    queryFn: async () => {
      const res = await api.resource.findUnique.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};

/** Create a resource */
export const useCreateResource = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.resource.create.useMutation({
    async onSuccess() {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([getResourcesQueryKey()]),
      });
      toast({ description: 'Resource was successfully created.' });
      onSuccess?.();
    },
    onError(e) {
      if (e.status === 400 || e.status === 500) {
        toast({
          variant: 'destructive',
          title: 'Unable to create resource',
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

/** Update a resource */
export const useUpdateResource = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.resource.update.useMutation({
    async onSuccess({ body }) {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([
          [...getResourceQueryKey(body.id), body.id],
          getResourcesQueryKey(),
        ]),
      });
      toast({
        description: 'Resource was successfully updated.',
      });
      onSuccess?.();
    },
    onError(e) {
      if (e.status === 400 || e.status === 404 || e.status === 500) {
        toast({
          variant: 'destructive',
          title: 'Unable to update resource.',
          description: e.body.message,
        });
      } else {
        toast({
          variant: 'destructive',
          description: 'Something went wrong while updating resource.',
        });
      }
      onError?.();
    },
  });
};

/** Delete resource */
export const useDeleteResource = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.resource.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: invalidateQueries([getResourcesQueryKey()]),
      });
      toast({
        description: 'Resource was successfully deleted.',
      });
    },
    onError() {
      toast({
        variant: 'destructive',
        description: 'Unable to delete resource.',
      });
    },
  });
};
