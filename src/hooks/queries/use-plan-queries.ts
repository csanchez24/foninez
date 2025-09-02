import type { ParseServerSearchParamsReturnType } from '@/utils/query';

import { api } from '@/clients/api';
import { useToast } from '@/components/ui/use-toast';
import { getQueryKey } from '@/utils/get-query-key';
import { invalidateQueries } from '@/utils/query';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const findManyQueryKey = getQueryKey(
  'plan',
  'findMany'
)({
  query: {
    include: { program: true, planModalities: { with: { modality: true } } },
    sort: { createdAt: 'desc' },
    page: 1,
    limit: 10,
  },
});

type GetPlansQueryKeyParams = (typeof findManyQueryKey)[2]['query'] &
  Pick<ParseServerSearchParamsReturnType, 'deboucedSearchText'>;

/** Get paginated shools response */
export function getPlansQueryKey(
  { deboucedSearchText, ...args }: GetPlansQueryKeyParams = findManyQueryKey[2].query
): typeof findManyQueryKey {
  findManyQueryKey[2] = {
    query: {
      ...findManyQueryKey[2].query,
      ...args,
      where: deboucedSearchText
        ? {
            _or: [
              { justification: { like: deboucedSearchText } },
              { shortTermObjective: { like: deboucedSearchText } },
              { longTermObjective: { like: deboucedSearchText } },
            ],
          }
        : undefined,
    },
  };
  return findManyQueryKey;
}

export const useGetPlans = (args?: Parameters<typeof getPlansQueryKey>[0]) => {
  const queryKey = getPlansQueryKey(args);
  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.plan.findMany.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};

export function getPlanQueryKey(id: number) {
  return getQueryKey('plan', 'findUnique')({ query: {}, params: { id } });
}

/** Get single plan by id */
export const useGetPlan = (id: number | undefined) => {
  const queryKey = id ? getPlanQueryKey(id) : [];

  return useQuery({
    enabled: !!id,
    queryKey,
    queryFn: async () => {
      const res = await api.plan.findUnique.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};

/** Create a plan */
export const useCreatePlan = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.plan.create.useMutation({
    async onSuccess() {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([getPlansQueryKey()]),
      });
      toast({ description: 'Plan was successfully created.' });
      onSuccess?.();
    },
    onError(e) {
      if (e.status === 400 || e.status === 500) {
        toast({
          variant: 'destructive',
          title: 'Unable to create plan',
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

/** Update a plan */
export const useUpdatePlan = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.plan.update.useMutation({
    async onSuccess({ body }) {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([[...getPlanQueryKey(body.id), body.id], getPlansQueryKey()]),
      });
      toast({
        description: 'Plan was successfully updated.',
      });
      onSuccess?.();
    },
    onError(e) {
      if (e.status === 400 || e.status === 404 || e.status === 500) {
        toast({
          variant: 'destructive',
          title: 'Unable to update plan.',
          description: e.body.message,
        });
      } else {
        toast({
          variant: 'destructive',
          description: 'Something went wrong while updating plan.',
        });
      }
      onError?.();
    },
  });
};

/** Update a plan's status */
export const useUpdatePlanStatus = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.plan.updateStatus.useMutation({
    async onSuccess({ body }) {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([[...getPlanQueryKey(body.id), body.id], getPlansQueryKey()]),
      });
      toast({
        description: 'Status was successfully updated.',
      });
      onSuccess?.();
    },
    onError(e) {
      if (e.status === 400 || e.status === 404 || e.status === 500) {
        toast({
          variant: 'destructive',
          title: "Unable to update plan's status.",
          description: e.body.message,
        });
      } else {
        toast({
          variant: 'destructive',
          description: "Something went wrong while updating plan's status.",
        });
      }
      onError?.();
    },
  });
};

/** Delete plan */
export const useDeletePlan = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.plan.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: invalidateQueries([getPlansQueryKey()]),
      });
      toast({
        description: 'Plan was successfully deleted.',
      });
    },
    onError() {
      toast({
        variant: 'destructive',
        description: 'Unable to delete plan.',
      });
    },
  });
};
