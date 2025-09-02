import type { ParseServerSearchParamsReturnType } from '@/utils/query';

import { api } from '@/clients/api';
import { useToast } from '@/components/ui/use-toast';
import { getQueryKey } from '@/utils/get-query-key';
import { invalidateQueries } from '@/utils/query';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPlanModalityActivitySchoolsQueryKey } from './use-plan-modality-activity-school-queries';

const findManyQueryKey = getQueryKey(
  'planModalityActivitySchoolProof',
  'findMany'
)({
  query: {
    sort: { createdAt: 'desc' },
    page: 1,
    limit: 10,
    include: {
      planModalityActivitySchool: true,
      planModalityActivitySchoolProofFiles: true,
      planModalityActivitySchoolProofChildrenAttendances: true,
    },
  },
});

type GetActivitySchoolProofsQueryKeyParams = (typeof findManyQueryKey)[2]['query'] &
  Pick<ParseServerSearchParamsReturnType, 'deboucedSearchText'>;

/** Get paginated planModalityActivitySchoolProofs response */
export function getPlanModalityActivitySchoolProofsQueryKey(
  { deboucedSearchText: _, ...args }: GetActivitySchoolProofsQueryKeyParams = findManyQueryKey[2]
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

export const useGetPlanModalityActivitySchoolProofs = (
  args?: Parameters<typeof getPlanModalityActivitySchoolProofsQueryKey>[0]
) => {
  const queryKey = getPlanModalityActivitySchoolProofsQueryKey(args);
  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.planModalityActivitySchoolProof.findMany.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};

export function getPlanModalityActivitySchoolProofQueryKey(id: number) {
  return getQueryKey(
    'planModalityActivitySchoolProof',
    'findUnique'
  )({
    query: {
      include: {
        planModalityActivitySchool: true,
        planModalityActivitySchoolProofFiles: true,
        planModalityActivitySchoolProofChildrenAttendances: true,
      },
    },
    params: { id },
  });
}

/** Get single activity by id */
export const useGetPlanModalityActivitySchoolProof = (id: number | undefined) => {
  const queryKey = id ? getPlanModalityActivitySchoolProofQueryKey(id) : [];

  return useQuery({
    enabled: !!id,
    queryKey,
    queryFn: async () => {
      const res = await api.planModalityActivitySchoolProof.findUnique.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};

/** Create a activity */
export const useCreatePlanModalityActivitySchoolProof = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.planModalityActivitySchoolProof.create.useMutation({
    async onSuccess() {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([
          getPlanModalityActivitySchoolProofsQueryKey(),
          getPlanModalityActivitySchoolsQueryKey(),
        ]),
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
export const useUpdatePlanModalityActivitySchoolProof = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.planModalityActivitySchoolProof.update.useMutation({
    async onSuccess({ body }) {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([
          [...getPlanModalityActivitySchoolProofQueryKey(body.id), body.id],
          getPlanModalityActivitySchoolProofsQueryKey(),
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
export const useDeletePlanModalityActivitySchoolProof = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.planModalityActivitySchoolProof.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: invalidateQueries([getPlanModalityActivitySchoolProofsQueryKey()]),
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
