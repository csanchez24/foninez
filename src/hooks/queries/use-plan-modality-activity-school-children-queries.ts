import type { ParseServerSearchParamsReturnType } from '@/utils/query';

import { api } from '@/clients/api';
import { useToast } from '@/components/ui/use-toast';
import { getQueryKey } from '@/utils/get-query-key';
import { invalidateQueries } from '@/utils/query';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const findManyQueryKey = getQueryKey(
  'planModalityActivitySchoolChild',
  'findMany'
)({
  query: {
    sort: { createdAt: 'desc' },
    page: 1,
    limit: 10,
    include: {
      child: {
        with: {
          guardian: {
            with: {
              identification: true,
            },
          },
          identification: true,
        },
      },
      planModalityActivitySchool: true,
    },
  },
});

type GetActivitySchoolsQueryKeyParams = (typeof findManyQueryKey)[2]['query'] &
  Pick<ParseServerSearchParamsReturnType, 'deboucedSearchText'> & {
    planModalityActivitySchoolId?: number;
  };

/** Get paginated planModalityActivitySchools response */
export function getPlanModalityActivitySchoolChildrenQueryKey(
  {
    deboucedSearchText: _,
    planModalityActivitySchoolId,
    ...args
  }: GetActivitySchoolsQueryKeyParams = findManyQueryKey[2].query
): typeof findManyQueryKey {
  findManyQueryKey[2] = {
    query: {
      ...findManyQueryKey[2].query,
      ...args,
      where: {
        ...(args?.where ?? {}),
        ...(planModalityActivitySchoolId ? { planModalityActivitySchoolId } : {}),
      },
    },
  };
  return findManyQueryKey;
}

export const useGetPlanModalityActivitySchoolChildren = (
  args?: Parameters<typeof getPlanModalityActivitySchoolChildrenQueryKey>[0]
) => {
  const queryKey = getPlanModalityActivitySchoolChildrenQueryKey(args);
  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.planModalityActivitySchoolChild.findMany.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};

export function getPlanModalityActivitySchoolChildQueryKey(id: number) {
  return getQueryKey(
    'planModalityActivitySchoolChild',
    'findUnique'
  )({ query: {}, params: { id } });
}

/** Get single activity by id */
export const useGetPlanModalityActivitySchoolChild = (id: number | undefined) => {
  const queryKey = id ? getPlanModalityActivitySchoolChildQueryKey(id) : [];

  return useQuery({
    enabled: !!id,
    queryKey,
    queryFn: async () => {
      const res = await api.planModalityActivitySchoolChild.findUnique.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};

/** sync a activity */
export const useSyncPlanModalityActivitySchoolChild = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.planModalityActivitySchoolChild.sync.useMutation({
    async onSuccess() {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([getPlanModalityActivitySchoolChildrenQueryKey()]),
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

/** Create a activity */
export const useCreatePlanModalityActivitySchoolChild = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.planModalityActivitySchoolChild.create.useMutation({
    async onSuccess() {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([getPlanModalityActivitySchoolChildrenQueryKey()]),
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
export const useUpdatePlanModalityActivitySchoolChild = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.planModalityActivitySchoolChild.update.useMutation({
    async onSuccess({ body }) {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([
          [...getPlanModalityActivitySchoolChildQueryKey(body.id), body.id],
          getPlanModalityActivitySchoolChildrenQueryKey({
            planModalityActivitySchoolId: body.planModalityActivitySchoolId,
          }),
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
export const useDeletePlanModalityActivitySchoolChild = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.planModalityActivitySchoolChild.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: invalidateQueries([getPlanModalityActivitySchoolChildrenQueryKey()]),
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

/** sync a activity */
export const useReSyncPlanModalityActivitySchoolChild = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.planModalityActivitySchoolChild.resync.useMutation({
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ['planModalityActivitySchool', 'findUnique'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['planModalityActivitySchoolChild', 'findMany'],
      });
      toast({ description: 'Resync was successfully created.' });
      onSuccess?.();
    },
    onError(e) {
      if (e.status === 400 || e.status === 500) {
        toast({
          variant: 'destructive',
          title: 'Unable to Resync activity',
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
