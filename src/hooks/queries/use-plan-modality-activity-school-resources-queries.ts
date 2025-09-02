import type { ParseServerSearchParamsReturnType } from '@/utils/query';

import { api } from '@/clients/api';
import { useToast } from '@/components/ui/use-toast';
import { getQueryKey } from '@/utils/get-query-key';
import { invalidateQueries } from '@/utils/query';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const findManyQueryKey = getQueryKey(
  'planModalityActivitySchoolResource',
  'findMany'
)({
  query: {
    sort: { createdAt: 'desc' },
    page: 1,
    limit: 10,
    include: {
      planModalityActivityResource: {
        with: {
          resource: true,
          planModalityActivitySchoolResources: true,
        },
      },
    },
  },
});

type GetActivitySchoolResourcesQueryKeyParams = (typeof findManyQueryKey)[2]['query'] &
  Pick<ParseServerSearchParamsReturnType, 'deboucedSearchText'>;

/** Get paginated planModalityActivitySchoolResources response */
export function getPlanModalityActivitySchoolResourcesQueryKey(
  { deboucedSearchText: _, ...args }: GetActivitySchoolResourcesQueryKeyParams = findManyQueryKey[2]
    .query
): typeof findManyQueryKey {
  findManyQueryKey[2] = {
    query: {
      ...findManyQueryKey[2].query,
      ...args,
      //where: deboucedSearchText ? { _or: [{ id: { like: deboucedSearchText } }] } : undefined,
    },
  };
  return findManyQueryKey;
}

export const useGetPlanModalityActivitySchoolResources = (
  args?: Parameters<typeof getPlanModalityActivitySchoolResourcesQueryKey>[0]
) => {
  const queryKey = getPlanModalityActivitySchoolResourcesQueryKey(args);
  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.planModalityActivitySchoolResource.findMany.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};

export function getPlanModalityActivitySchoolResourceQueryKey(id: number) {
  return getQueryKey(
    'planModalityActivitySchoolResource',
    'findUnique'
  )({
    query: {
      include: {
        planModalityActivityResource: {
          with: {
            resource: true,
            planModalityActivitySchoolResources: true,
          },
        },
      },
    },
    params: { id },
  });
}

/** Get single activity by id */
export const useGetPlanModalityActivitySchoolResource = (id: number | undefined) => {
  const queryKey = id ? getPlanModalityActivitySchoolResourceQueryKey(id) : [];

  return useQuery({
    enabled: !!id,
    queryKey,
    queryFn: async () => {
      const res = await api.planModalityActivitySchoolResource.findUnique.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};

/** Create a activity */
export const useCreatePlanModalityActivitySchoolResource = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.planModalityActivitySchoolResource.create.useMutation({
    async onSuccess() {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([getPlanModalityActivitySchoolResourcesQueryKey()]),
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
export const useUpdatePlanModalityActivitySchoolResource = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.planModalityActivitySchoolResource.update.useMutation({
    async onSuccess({ body }) {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([
          [...getPlanModalityActivitySchoolResourceQueryKey(body.id), body.id],
          getPlanModalityActivitySchoolResourcesQueryKey(),
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

/** UpdateMas a activity */
export const useUpdateMassPlanModalityActivitySchoolResource = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.planModalityActivitySchoolResource.updateMass.useMutation({
    async onSuccess() {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([getPlanModalityActivitySchoolResourcesQueryKey()]),
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
export const useDeletePlanModalityActivitySchoolResource = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.planModalityActivitySchoolResource.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: invalidateQueries([getPlanModalityActivitySchoolResourcesQueryKey()]),
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
