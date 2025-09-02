import type { ParseServerSearchParamsReturnType } from '@/utils/query';

import { api } from '@/clients/api';
import { useToast } from '@/components/ui/use-toast';
import { getQueryKey } from '@/utils/get-query-key';
import { invalidateQueries } from '@/utils/query';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const findManyQueryKey = getQueryKey(
  'child',
  'findMany'
)({
  query: {
    include: {
      guardian: true,
      identification: true,
      planModalityActivitySchoolChildren: {
        with: {
          planModalityActivitySchoolProofChildrenAttendances: true,
          planModalityActivitySchool: {
            with: {
              school: true,
              planModalityActivity: true,
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

type GetChildrenQueryKeyParams = (typeof findManyQueryKey)[2]['query'] &
  Pick<ParseServerSearchParamsReturnType, 'deboucedSearchText'>;

/** Get paginated shools response */
export function getChildrenQueryKey(
  { deboucedSearchText, ...args }: GetChildrenQueryKeyParams = findManyQueryKey[2].query
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

export const useGetChildren = (args?: Parameters<typeof getChildrenQueryKey>[0]) => {
  const queryKey = getChildrenQueryKey(args);
  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.child.findMany.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};

export function getChildQueryKey(id: number) {
  return getQueryKey('child', 'findUnique')({ query: {}, params: { id } });
}

/** Get single child by id */
export const useGetChild = (id: number | undefined) => {
  const queryKey = id ? getChildQueryKey(id) : [];

  return useQuery({
    enabled: !!id,
    queryKey,
    queryFn: async () => {
      const res = await api.child.findUnique.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};

/** Create a child */
export const useCreateChild = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.child.create.useMutation({
    async onSuccess() {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([getChildrenQueryKey()]),
      });
      toast({ description: 'Child was successfully created.' });
      onSuccess?.();
    },
    onError(e) {
      if (e.status === 400 || e.status === 500) {
        toast({
          variant: 'destructive',
          title: 'Unable to create child',
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

/** Update a child */
export const useUpdateChild = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.child.update.useMutation({
    async onSuccess({ body }) {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([
          [...getChildQueryKey(body.id), body.id],
          getChildrenQueryKey(),
        ]),
      });
      toast({
        description: 'Child was successfully updated.',
      });
      onSuccess?.();
    },
    onError(e) {
      if (e.status === 400 || e.status === 404 || e.status === 500) {
        toast({
          variant: 'destructive',
          title: 'Unable to update child.',
          description: e.body.message,
        });
      } else {
        toast({
          variant: 'destructive',
          description: 'Something went wrong while updating child.',
        });
      }
      onError?.();
    },
  });
};

/** Delete child */
export const useDeleteChild = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.child.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: invalidateQueries([getChildrenQueryKey()]),
      });
      toast({
        description: 'Child was successfully deleted.',
      });
    },
    onError() {
      toast({
        variant: 'destructive',
        description: 'Unable to delete child.',
      });
    },
  });
};
