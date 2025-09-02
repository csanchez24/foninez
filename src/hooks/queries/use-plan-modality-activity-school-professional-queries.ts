import type { ParseServerSearchParamsReturnType } from '@/utils/query';

import { api } from '@/clients/api';
import { useToast } from '@/components/ui/use-toast';
import { getQueryKey } from '@/utils/get-query-key';
import { invalidateQueries } from '@/utils/query';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPlanModalityActivitySchoolsQueryKey } from './use-plan-modality-activity-school-queries';

const findManyQueryKey = getQueryKey(
  'planModalityActivitySchoolProfessional',
  'findMany'
)({
  query: {
    sort: { createdAt: 'desc' },
    page: 1,
    limit: 10,
    include: {
      professional: true,
    },
  },
});

type GetActivitySchoolProfessionalsQueryKeyParams = (typeof findManyQueryKey)[2]['query'] &
  Pick<ParseServerSearchParamsReturnType, 'deboucedSearchText'>;

/** Get paginated planModalityActivitySchoolProfessionals response */
export function getPlanModalityActivitySchoolProfessionalsQueryKey(
  {
    deboucedSearchText: _,
    ...args
  }: GetActivitySchoolProfessionalsQueryKeyParams = findManyQueryKey[2].query
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

export const useGetPlanModalityActivitySchoolProfessionals = (
  args?: Parameters<typeof getPlanModalityActivitySchoolProfessionalsQueryKey>[0]
) => {
  const queryKey = getPlanModalityActivitySchoolProfessionalsQueryKey(args);
  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.planModalityActivitySchoolProfessional.findMany.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};

export function getPlanModalityActivitySchoolProfessionalQueryKey(id: number) {
  return getQueryKey(
    'planModalityActivitySchoolProfessional',
    'findUnique'
  )({
    query: {
      include: {
        professional: true,
      },
    },
    params: { id },
  });
}

/** Get single activity by id */
export const useGetPlanModalityActivitySchoolProfessional = (id: number | undefined) => {
  const queryKey = id ? getPlanModalityActivitySchoolProfessionalQueryKey(id) : [];

  return useQuery({
    enabled: !!id,
    queryKey,
    queryFn: async () => {
      const res = await api.planModalityActivitySchoolProfessional.findUnique.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};

/** Create a activity */
export const useCreatePlanModalityActivitySchoolProfessional = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.planModalityActivitySchoolProfessional.create.useMutation({
    async onSuccess() {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([
          getPlanModalityActivitySchoolProfessionalsQueryKey(),
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
export const useUpdatePlanModalityActivitySchoolProfessional = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.planModalityActivitySchoolProfessional.update.useMutation({
    async onSuccess({ body }) {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([
          [...getPlanModalityActivitySchoolProfessionalQueryKey(body.id), body.id],
          getPlanModalityActivitySchoolProfessionalsQueryKey(),
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
export const useDeletePlanModalityActivitySchoolProfessional = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.planModalityActivitySchoolProfessional.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: invalidateQueries([getPlanModalityActivitySchoolProfessionalsQueryKey()]),
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
