import type { ParseServerSearchParamsReturnType } from '@/utils/query';

import { api } from '@/clients/api';
import { useToast } from '@/components/ui/use-toast';
import { getQueryKey } from '@/utils/get-query-key';
import { invalidateQueries } from '@/utils/query';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const findManyQueryKey = getQueryKey(
  'professional',
  'findMany'
)({
  query: {
    sort: { createdAt: 'desc' },
    page: 1,
    limit: 10,
    include: {
      identification: true,
      planModalityActivitySchoolProfessionals: {
        with: {
          planModalityActivitySchool: {
            with: {
              planModalityActivity: true,
              school: true,
            },
          },
        },
      },
    },
  },
});

type GetProfessionalsQueryKeyParams = (typeof findManyQueryKey)[2]['query'] &
  Pick<ParseServerSearchParamsReturnType, 'deboucedSearchText'>;

/** Get paginated shools response */
export function getProfessionalsQueryKey(
  { deboucedSearchText, ...args }: GetProfessionalsQueryKeyParams = findManyQueryKey[2].query
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

export const useGetProfessionals = (args?: Parameters<typeof getProfessionalsQueryKey>[0]) => {
  const queryKey = getProfessionalsQueryKey(args);
  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.professional.findMany.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};

export function getProfessionalQueryKey(id: number) {
  return getQueryKey('professional', 'findUnique')({ query: {}, params: { id } });
}

/** Get single professional by id */
export const useGetProfessional = (id: number | undefined) => {
  const queryKey = id ? getProfessionalQueryKey(id) : [];

  return useQuery({
    enabled: !!id,
    queryKey,
    queryFn: async () => {
      const res = await api.professional.findUnique.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};

/** Create a professional */
export const useCreateProfessional = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.professional.create.useMutation({
    async onSuccess() {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([getProfessionalsQueryKey()]),
      });
      toast({ description: 'Professional was successfully created.' });
      onSuccess?.();
    },
    onError(e) {
      if (e.status === 400 || e.status === 500) {
        toast({
          variant: 'destructive',
          title: 'Unable to create professional',
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

/** Update a professional */
export const useUpdateProfessional = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.professional.update.useMutation({
    async onSuccess({ body }) {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([
          [...getProfessionalQueryKey(body.id), body.id],
          getProfessionalsQueryKey(),
        ]),
      });
      toast({
        description: 'Professional was successfully updated.',
      });
      onSuccess?.();
    },
    onError(e) {
      if (e.status === 400 || e.status === 404 || e.status === 500) {
        toast({
          variant: 'destructive',
          title: 'Unable to update professional.',
          description: e.body.message,
        });
      } else {
        toast({
          variant: 'destructive',
          description: 'Something went wrong while updating professional.',
        });
      }
      onError?.();
    },
  });
};

/** Delete professional */
export const useDeleteProfessional = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.professional.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: invalidateQueries([getProfessionalsQueryKey()]),
      });
      toast({
        description: 'Professional was successfully deleted.',
      });
    },
    onError() {
      toast({
        variant: 'destructive',
        description: 'Unable to delete professional.',
      });
    },
  });
};
