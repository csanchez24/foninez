import type { ParseServerSearchParamsReturnType } from '@/utils/query';

import { api } from '@/clients/api';
import { useToast } from '@/components/ui/use-toast';
import { getQueryKey } from '@/utils/get-query-key';
import { invalidateQueries } from '@/utils/query';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const findManyQueryKey = getQueryKey(
  'inventoryTransaction',
  'findMany'
)({
  query: {
    sort: { createdAt: 'desc' },
    page: 1,
    limit: 10,
    include: {
      planModalityActivitySchool: {
        with: {
          school: true,
          planModalityActivity: true,
        },
      },
      inventoryTransactionLines: {
        with: {
          resource: true,
        },
      },
    },
  },
});

type GetInventoryTransactionsQueryKeyParams = (typeof findManyQueryKey)[2]['query'] &
  Pick<ParseServerSearchParamsReturnType, 'deboucedSearchText'>;

/** Get paginated shools response */
export function getInventoryTransactionsQueryKey(
  { deboucedSearchText, ...args }: GetInventoryTransactionsQueryKeyParams = findManyQueryKey[2]
    .query
): typeof findManyQueryKey {
  findManyQueryKey[2] = {
    query: {
      ...findManyQueryKey[2].query,
      ...args,
      where: {
        ...args.where,
        ...(deboucedSearchText
          ? {
              _or: [
                { supplierInvoiceNumber: { like: deboucedSearchText } },
                { orderNumber: { like: deboucedSearchText } },
              ],
            }
          : {}),
      },
    },
  };
  return findManyQueryKey;
}

export const useGetInventoryTransactions = (
  args?: Parameters<typeof getInventoryTransactionsQueryKey>[0]
) => {
  const queryKey = getInventoryTransactionsQueryKey(args);
  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.inventoryTransaction.findMany.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};

export function getInventoryTransactionQueryKey(id: number) {
  return getQueryKey('inventoryTransaction', 'findUnique')({ query: {}, params: { id } });
}

/** Get single inventoryTransaction by id */
export const useGetInventoryTransaction = (id: number | undefined) => {
  const queryKey = id ? getInventoryTransactionQueryKey(id) : [];

  return useQuery({
    enabled: !!id,
    queryKey,
    queryFn: async () => {
      const res = await api.inventoryTransaction.findUnique.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};

/** Create a inventoryTransaction */
export const useCreateInventoryTransaction = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.inventoryTransaction.create.useMutation({
    async onSuccess() {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([getInventoryTransactionsQueryKey()]),
      });
      toast({ description: 'Inventory transaction was successfully created.' });
      onSuccess?.();
    },
    onError(e) {
      if (e.status === 400 || e.status === 500) {
        toast({
          variant: 'destructive',
          title: 'Unable to create inventory transaction',
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

/** Update a inventoryTransaction */
export const useUpdateInventoryTransaction = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.inventoryTransaction.update.useMutation({
    async onSuccess({ body }) {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([
          [...getInventoryTransactionQueryKey(body.id), body.id],
          getInventoryTransactionsQueryKey(),
        ]),
      });
      toast({
        description: 'Inventory transaction was successfully updated.',
      });
      onSuccess?.();
    },
    onError(e) {
      if (e.status === 400 || e.status === 404 || e.status === 500) {
        toast({
          variant: 'destructive',
          title: 'Unable to update inventory transaction.',
          description: e.body.message,
        });
      } else {
        toast({
          variant: 'destructive',
          description: 'Something went wrong while updating inventory transaction.',
        });
      }
      onError?.();
    },
  });
};

/** Delete inventoryTransaction */
export const useDeleteInventoryTransaction = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.inventoryTransaction.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: invalidateQueries([getInventoryTransactionsQueryKey()]),
      });
      toast({
        description: 'Inventory transaction was successfully deleted.',
      });
    },
    onError() {
      toast({
        variant: 'destructive',
        description: 'Unable to delete inventory transaction.',
      });
    },
  });
};
