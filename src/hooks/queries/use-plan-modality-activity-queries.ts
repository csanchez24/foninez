import type { ParseServerSearchParamsReturnType } from '@/utils/query';

import { api } from '@/clients/api';
import { useToast } from '@/components/ui/use-toast';
import { getQueryKey } from '@/utils/get-query-key';
import { invalidateQueries } from '@/utils/query';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const findManyQueryKey = getQueryKey(
  'planModalityActivity',
  'findMany'
)({
  query: {
    include: {
      plan: true,
      planModality: { with: { modality: true } },
      planModalityActivityResources: { with: { resource: true } },
      planModalityActivitySchools: { with: { school: true } },
      planModalityActivityProofFiles: { with: { proofFileClassification: true } },
    },
    sort: { createdAt: 'desc' },
    page: 1,
    limit: 10,
  },
});

type GetActivitiesQueryKeyParams = (typeof findManyQueryKey)[2]['query'] &
  Pick<ParseServerSearchParamsReturnType, 'deboucedSearchText'> & { planId?: number };

/** Get paginated planModalityActivities response */
export function getPlanModalityActivitiesQueryKey(
  { deboucedSearchText, planId, ...args }: GetActivitiesQueryKeyParams = findManyQueryKey[2].query
): typeof findManyQueryKey {
  findManyQueryKey[2] = {
    query: {
      ...findManyQueryKey[2].query,
      ...args,
      where: deboucedSearchText
        ? {
            ...(typeof planId !== 'undefined'
              ? { planId, _and: [{ name: { like: deboucedSearchText } }] }
              : { _or: [{ name: { like: deboucedSearchText } }] }),
          }
        : planId
          ? { planId }
          : undefined,
    },
  };
  return findManyQueryKey;
}

export const useGetPlanModalityActivities = (
  args?: Parameters<typeof getPlanModalityActivitiesQueryKey>[0]
) => {
  const queryKey = getPlanModalityActivitiesQueryKey(args);
  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.planModalityActivity.findMany.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};

export function getPlanModalityActivityQueryKey(id: number) {
  return getQueryKey('planModalityActivity', 'findUnique')({ query: {}, params: { id } });
}

/** Get single activity by id */
export const useGetPlanModalityActivity = (id: number | undefined) => {
  const queryKey = id ? getPlanModalityActivityQueryKey(id) : [];

  return useQuery({
    enabled: !!id,
    queryKey,
    queryFn: async () => {
      const res = await api.planModalityActivity.findUnique.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};

/** Create a activity */
export const useCreatePlanModalityActivity = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.planModalityActivity.create.useMutation({
    async onSuccess() {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([getPlanModalityActivitiesQueryKey()]),
      });
      toast({ description: 'Activity was successfully created.' });
      onSuccess?.();
    },
    onError(e) {
      if (e.status === 400 || e.status === 500) {
        toast({
          variant: 'destructive',
          title: 'Unable to create activity',
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

/** Update a activity */
export const useUpdatePlanModalityActivity = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.planModalityActivity.update.useMutation({
    async onSuccess({ body }) {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([
          [...getPlanModalityActivityQueryKey(body.id), body.id],
          getPlanModalityActivitiesQueryKey({ planId: body.planId }),
        ]),
      });
      toast({
        description: 'Activity was successfully updated.',
      });
      onSuccess?.();
    },
    onError(e) {
      if (e.status === 400 || e.status === 404 || e.status === 500) {
        toast({
          variant: 'destructive',
          title: 'Unable to update activity.',
          description: e.body.message,
        });
      } else {
        toast({
          variant: 'destructive',
          description: 'Something went wrong while updating activity.',
        });
      }
      onError?.();
    },
  });
};

/** Delete activity */
export const useDeletePlanModalityActivity = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.planModalityActivity.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: invalidateQueries([getPlanModalityActivitiesQueryKey()]),
      });
      toast({
        description: 'Activity was successfully deleted.',
      });
    },
    onError() {
      toast({
        variant: 'destructive',
        description: 'Unable to delete activity.',
      });
    },
  });
};
