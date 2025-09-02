import { z } from 'zod';

import {
  NumberOperatorsSchema,
  SortSchema,
  StringOperatorsSchema,
} from '@/server/utils/query/schemas';

const PlanModalityActivitySchoolStatus = z.enum([
  'pending',
  'planning',
  'requested_resources',
  'confirmed_resources',
  'active',
  'completed',
  'verified',
  'rejected',
]);

const PlanModalityActivitySchoolWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  participantsQty: z.union([z.number(), NumberOperatorsSchema]).optional(),
  schoolId: z.union([z.number(), NumberOperatorsSchema]).optional(),
  planModalityActivityId: z.union([z.number(), NumberOperatorsSchema]).optional(),
  status: z
    .union([
      z.union([
        z.literal('pending'),
        z.literal('planning'),
        z.literal('requested_resources'),
        z.literal('confirmed_resources'),
        z.literal('active'),
        z.literal('completed'),
        z.literal('verified'),
        z.literal('rejected'),
      ]),
      StringOperatorsSchema,
    ])
    .optional(),
});

type PlanModalityActivitySchoolWhereSchemaType = z.infer<
  typeof PlanModalityActivitySchoolWhereBaseSchema
> & {
  _and?: PlanModalityActivitySchoolWhereSchemaType[];
  _or?: PlanModalityActivitySchoolWhereSchemaType[];
  _not?: PlanModalityActivitySchoolWhereSchemaType[];
};

const PlanModalityActivitySchoolWhereSchema: z.ZodType<PlanModalityActivitySchoolWhereSchemaType> =
  PlanModalityActivitySchoolWhereBaseSchema.extend({
    _and: z.lazy(() => PlanModalityActivitySchoolWhereSchema.array().optional()),
    _or: z.lazy(() => PlanModalityActivitySchoolWhereSchema.array().optional()),
    _not: z.lazy(() => PlanModalityActivitySchoolWhereSchema.array().optional()),
  });

const PlanModalityActivitySchoolIncludeSchema = z.object({
  school: z.boolean().optional(),
  planModalityActivity: z.union([
    z.boolean().optional(),
    z.object({
      with: z.object({
        planModalityActivityProofFiles: z.union([
          z.boolean().optional(),
          z.object({
            with: z.object({
              proofFileClassification: z.boolean(),
            }),
          }),
        ]),
      }),
    }),
  ]),
  planModalityActivitySchoolsResources: z
    .object({
      with: z.object({
        planModalityActivityResource: z.object({
          with: z.object({
            resource: z.boolean(),
            planModalityActivitySchoolResources: z.boolean(),
          }),
        }),
      }),
    })
    .optional(),
  planModalityActivitySchoolProfessionals: z
    .object({
      with: z.object({
        professional: z.boolean(),
      }),
    })
    .optional(),
  planModalityActivitySchoolChildren: z
    .object({
      with: z.object({
        planModalityActivitySchoolProofChildrenAttendances: z.object({
          with: z.object({
            planModalityActivitySchoolProof: z.boolean(),
          }),
        }),
        child: z.object({
          with: z.object({
            guardian: z.boolean(),
          }),
        }),
      }),
    })
    .optional(),
  planModalityActivitySchoolProofs: z
    .object({
      with: z.object({
        planModalityActivitySchoolProofChildrenAttendances: z
          .object({
            with: z.object({
              planModalityActivitySchoolChild: z.object({
                with: z.object({
                  child: z.boolean(),
                }),
              }),
            }),
          })
          .optional(),
        planModalityActivitySchoolProofFiles: z
          .object({
            with: z.object({
              proofFileClassification: z.boolean(),
            }),
          })
          .optional(),
        planModalityActivitySchoolProofChildrenResources: z
          .object({
            with: z.object({
              planModalityActivitySchoolResource: z.object({
                with: z.object({
                  planModalityActivityResource: z.object({
                    with: z.object({
                      resource: z.boolean(),
                    }),
                  }),
                }),
              }),
            }),
          })
          .optional(),
      }),
    })
    .optional(),
});

const PlanModalityActivitySchoolSortSchema = z.object({
  id: SortSchema.optional(),
  planModalityActivityId: SortSchema.optional(),
  schoolId: SortSchema.optional(),
  participantsQty: SortSchema.optional(),
  status: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const PlanModalityActivitySchoolFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: PlanModalityActivitySchoolWhereSchema.optional(),
  sort: PlanModalityActivitySchoolSortSchema.optional(),
  include: PlanModalityActivitySchoolIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const PlanModalityActivitySchoolFindUniqueSchema = z.object({
  include: PlanModalityActivitySchoolIncludeSchema.optional(),
});

/** Create-body query schema*/
export const PlanModalityActivitySchoolCreateBodySchema = z.object({
  data: z.object({
    participantsQty: z.coerce.number(),
    schoolId: z.coerce.number(),
    planModalityActivityId: z.coerce.number(),
    rejectionNote: z.string().optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    status: PlanModalityActivitySchoolStatus,
  }),
});

/** Update-body query schema*/
export const PlanModalityActivitySchoolUpdateBodySchema = z.object({
  data: PlanModalityActivitySchoolCreateBodySchema.shape.data.partial(),
  options: z
    .object({
      updateStatuses: z.boolean().optional(),
    })
    .optional(),
});
