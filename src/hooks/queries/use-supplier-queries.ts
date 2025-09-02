import type { ParseServerSearchParamsReturnType } from '@/utils/query';

import { api } from '@/clients/api';
import { useToast } from '@/components/ui/use-toast';
import { getQueryKey } from '@/utils/get-query-key';
import { invalidateQueries } from '@/utils/query';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const findManyQueryKey = getQueryKey(
  'supplier',
  'findMany'
)({
  query: {
    sort: { createdAt: 'desc' },
    page: 1,
    limit: 10,
    include: {
      resourcesToSuppliers: {
        with: {
          resource: true,
          supplier: true,
        },
      },
    },
  },
});

type GetSuppliersQueryKeyParams = (typeof findManyQueryKey)[2]['query'] &
  Pick<ParseServerSearchParamsReturnType, 'deboucedSearchText'>;

/** Get paginated shools response */
export function getSuppliersQueryKey(
  { deboucedSearchText, ...args }: GetSuppliersQueryKeyParams = findManyQueryKey[2].query
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

export const useGetSuppliers = (args?: Parameters<typeof getSuppliersQueryKey>[0]) => {
  const queryKey = getSuppliersQueryKey(args);
  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.supplier.findMany.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};

export function getSupplierQueryKey(id: number) {
  return getQueryKey('supplier', 'findUnique')({ query: {}, params: { id } });
}

/** Get single supplier by id */
export const useGetSupplier = (id: number | undefined) => {
  const queryKey = id ? getSupplierQueryKey(id) : [];

  return useQuery({
    enabled: !!id,
    queryKey,
    queryFn: async () => {
      const res = await api.supplier.findUnique.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};

/** Create a supplier */
export const useCreateSupplier = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.supplier.create.useMutation({
    async onSuccess() {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([getSuppliersQueryKey()]),
      });
      toast({ description: 'Supplier was successfully created.' });
      onSuccess?.();
    },
    onError(e) {
      if (e.status === 400 || e.status === 500) {
        toast({
          variant: 'destructive',
          title: 'Unable to create supplier',
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

/** Update a supplier */
export const useUpdateSupplier = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.supplier.update.useMutation({
    async onSuccess({ body }) {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([
          [...getSupplierQueryKey(body.id), body.id],
          getSuppliersQueryKey(),
        ]),
      });
      toast({
        description: 'Supplier was successfully updated.',
      });
      onSuccess?.();
    },
    onError(e) {
      if (e.status === 400 || e.status === 404 || e.status === 500) {
        toast({
          variant: 'destructive',
          title: 'Unable to update supplier.',
          description: e.body.message,
        });
      } else {
        toast({
          variant: 'destructive',
          description: 'Something went wrong while updating supplier.',
        });
      }
      onError?.();
    },
  });
};

/** Delete supplier */
export const useDeleteSupplier = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.supplier.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: invalidateQueries([getSuppliersQueryKey()]),
      });
      toast({
        description: 'Supplier was successfully deleted.',
      });
    },
    onError() {
      toast({
        variant: 'destructive',
        description: 'Unable to delete supplier.',
      });
    },
  });
};
