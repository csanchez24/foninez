import type { ParseServerSearchParamsReturnType } from '@/utils/query';

import { api } from '@/clients/api';
import { useToast } from '@/components/ui/use-toast';
import { getQueryKey } from '@/utils/get-query-key';
import { invalidateQueries } from '@/utils/query';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const findManyQueryKey = getQueryKey(
  'program',
  'findMany'
)({
  query: {
    include: { modalities: true },
    sort: { createdAt: 'desc' },
    page: 1,
    limit: 10,
  },
});

type GetProgramsQueryKeyParams = (typeof findManyQueryKey)[2]['query'] &
  Pick<ParseServerSearchParamsReturnType, 'deboucedSearchText'>;

/** Get paginated shools response */
export function getProgramsQueryKey(
  { deboucedSearchText, ...args }: GetProgramsQueryKeyParams = findManyQueryKey[2].query
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

export const useGetPrograms = (args?: Parameters<typeof getProgramsQueryKey>[0]) => {
  const queryKey = getProgramsQueryKey(args);
  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.program.findMany.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};

export function getProgramQueryKey(id: number) {
  return getQueryKey('program', 'findUnique')({ query: {}, params: { id } });
}

/** Get single program by id */
export const useGetProgram = (id: number | undefined) => {
  const queryKey = id ? getProgramQueryKey(id) : [];

  return useQuery({
    enabled: !!id,
    queryKey,
    queryFn: async () => {
      const res = await api.program.findUnique.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};

/** Create a program */
export const useCreateProgram = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.program.create.useMutation({
    async onSuccess() {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([getProgramsQueryKey()]),
      });
      toast({ description: 'Program was successfully created.' });
      onSuccess?.();
    },
    onError(e) {
      if (e.status === 400 || e.status === 500) {
        toast({
          variant: 'destructive',
          title: 'Unable to create program',
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

/** Update a program */
export const useUpdateProgram = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.program.update.useMutation({
    async onSuccess({ body }) {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([
          [...getProgramQueryKey(body.id), body.id],
          getProgramsQueryKey(),
        ]),
      });
      toast({
        description: 'Program was successfully updated.',
      });
      onSuccess?.();
    },
    onError(e) {
      if (e.status === 400 || e.status === 404 || e.status === 500) {
        toast({
          variant: 'destructive',
          title: 'Unable to update program.',
          description: e.body.message,
        });
      } else {
        toast({
          variant: 'destructive',
          description: 'Something went wrong while updating program.',
        });
      }
      onError?.();
    },
  });
};

/** Delete program */
export const useDeleteProgram = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.program.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: invalidateQueries([getProgramsQueryKey()]),
      });
      toast({
        description: 'Program was successfully deleted.',
      });
    },
    onError() {
      toast({
        variant: 'destructive',
        description: 'Unable to delete program.',
      });
    },
  });
};
