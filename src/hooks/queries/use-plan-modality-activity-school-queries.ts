import type { ParseServerSearchParamsReturnType } from '@/utils/query';

import { api } from '@/clients/api';
import { useToast } from '@/components/ui/use-toast';
import { getQueryKey } from '@/utils/get-query-key';
import { invalidateQueries } from '@/utils/query';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const findManyQueryKey = getQueryKey(
  'planModalityActivitySchool',
  'findMany'
)({
  query: {
    sort: { createdAt: 'desc' },
    page: 1,
    limit: 10,
    include: {
      school: true,
      planModalityActivity: {
        with: {
          planModalityActivityProofFiles: {
            with: {
              proofFileClassification: true,
            },
          },
        },
      },
      planModalityActivitySchoolProofs: {
        with: {
          planModalityActivitySchoolProofFiles: {
            with: {
              proofFileClassification: true,
            },
          },
          planModalityActivitySchoolProofChildrenAttendances: {
            with: {
              planModalityActivitySchoolChild: {
                with: {
                  child: true,
                },
              },
            },
          },
          planModalityActivitySchoolProofChildrenResources: {
            with: {
              planModalityActivitySchoolResource: {
                with: {
                  planModalityActivityResource: {
                    with: {
                      resource: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      planModalityActivitySchoolChildren: {
        with: {
          child: {
            with: {
              guardian: true,
            },
          },
          planModalityActivitySchoolProofChildrenAttendances: {
            with: {
              planModalityActivitySchoolProof: true,
            },
          },
        },
      },
      planModalityActivitySchoolsResources: {
        with: {
          planModalityActivityResource: {
            with: {
              resource: true,
              planModalityActivitySchoolResources: true,
            },
          },
        },
      },
      planModalityActivitySchoolProfessionals: {
        with: {
          professional: true,
        },
      },
    },
  },
});

type GetActivitySchoolsQueryKeyParams = (typeof findManyQueryKey)[2]['query'] &
  Pick<ParseServerSearchParamsReturnType, 'deboucedSearchText'>;

/** Get paginated planModalityActivitySchools response */
export function getPlanModalityActivitySchoolsQueryKey(
  { deboucedSearchText: _, ...args }: GetActivitySchoolsQueryKeyParams = findManyQueryKey[2].query
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

export const useGetPlanModalityActivitySchools = (
  args?: Parameters<typeof getPlanModalityActivitySchoolsQueryKey>[0]
) => {
  const queryKey = getPlanModalityActivitySchoolsQueryKey(args);
  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.planModalityActivitySchool.findMany.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};

export function getPlanModalityActivitySchoolQueryKey(id: number) {
  return getQueryKey(
    'planModalityActivitySchool',
    'findUnique'
  )({
    query: {
      include: {
        school: true,
        planModalityActivity: {
          with: {
            planModalityActivityProofFiles: {
              with: {
                proofFileClassification: true,
              },
            },
          },
        },
        planModalityActivitySchoolProofs: {
          with: {
            planModalityActivitySchoolProofFiles: {
              with: {
                proofFileClassification: true,
              },
            },
            planModalityActivitySchoolProofChildrenAttendances: {
              with: {
                planModalityActivitySchoolChild: {
                  with: {
                    child: true,
                  },
                },
              },
            },
            planModalityActivitySchoolProofChildrenResources: {
              with: {
                planModalityActivitySchoolResource: {
                  with: {
                    planModalityActivityResource: {
                      with: {
                        resource: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        planModalityActivitySchoolChildren: {
          with: {
            child: {
              with: {
                guardian: true,
              },
            },
            planModalityActivitySchoolProofChildrenAttendances: {
              with: {
                planModalityActivitySchoolProof: true,
              },
            },
          },
        },
        planModalityActivitySchoolsResources: {
          with: {
            planModalityActivityResource: {
              with: {
                resource: true,
                planModalityActivitySchoolResources: true,
              },
            },
          },
        },
        planModalityActivitySchoolProfessionals: {
          with: {
            professional: true,
          },
        },
      },
    },
    params: { id },
  });
}

/** Get single activity by id */
export const useGetPlanModalityActivitySchool = (id: number | undefined) => {
  const queryKey = id ? getPlanModalityActivitySchoolQueryKey(id) : [];

  return useQuery({
    enabled: !!id,
    queryKey,
    queryFn: async () => {
      const res = await api.planModalityActivitySchool.findUnique.query(queryKey[2]);
      return res.status === 200 ? res : null;
    },
  });
};

/** Create a activity */
export const useCreatePlanModalityActivitySchool = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.planModalityActivitySchool.create.useMutation({
    async onSuccess() {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([getPlanModalityActivitySchoolsQueryKey()]),
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
export const useUpdatePlanModalityActivitySchool = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.planModalityActivitySchool.update.useMutation({
    async onSuccess({ body }) {
      await queryClient.invalidateQueries({
        predicate: invalidateQueries([
          [...getPlanModalityActivitySchoolQueryKey(body.id), body.id],
          getPlanModalityActivitySchoolsQueryKey(),
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
export const useDeletePlanModalityActivitySchool = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return api.planModalityActivitySchool.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: invalidateQueries([getPlanModalityActivitySchoolsQueryKey()]),
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
