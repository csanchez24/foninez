import { z } from 'zod';

import { NumberOperatorsSchema, SortSchema } from '@/server/utils/query/schemas';
import { ChildCreateBodySchema } from './child';
import { GuardianCreateBodySchema } from './guardian';

const PlanModalityActivitySchoolChildStatus = z.enum(['pending', 'confirmed', 'rejected']);

const PlanModalityActivitySchoolChildWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  planModalityActivitySchoolId: z.union([z.number(), NumberOperatorsSchema]).optional(),
  childId: z.union([z.number(), NumberOperatorsSchema]).optional(),
  status: PlanModalityActivitySchoolChildStatus.optional(),
});

type PlanModalityActivitySchoolChildWhereSchemaType = z.infer<
  typeof PlanModalityActivitySchoolChildWhereBaseSchema
> & {
  _and?: PlanModalityActivitySchoolChildWhereSchemaType[];
  _or?: PlanModalityActivitySchoolChildWhereSchemaType[];
  _not?: PlanModalityActivitySchoolChildWhereSchemaType[];
};

const PlanModalityActivitySchoolChildWhereSchema: z.ZodType<PlanModalityActivitySchoolChildWhereSchemaType> =
  PlanModalityActivitySchoolChildWhereBaseSchema.extend({
    _and: z.lazy(() => PlanModalityActivitySchoolChildWhereSchema.array().optional()),
    _or: z.lazy(() => PlanModalityActivitySchoolChildWhereSchema.array().optional()),
    _not: z.lazy(() => PlanModalityActivitySchoolChildWhereSchema.array().optional()),
  });

const PlanModalityActivitySchoolChildIncludeSchema = z.object({
  planModalityActivitySchool: z.boolean().optional(),
  planModalityActivitySchoolProofChildrenAttendances: z.boolean().optional(),
  child: z.object({
    with: z.object({
      identification: z.boolean().optional(),
      guardian: z.object({
        with: z.object({
          identification: z.boolean().optional(),
        }),
      }),
    }),
  }),
});

const PlanModalityActivitySchoolChildSortSchema = z.object({
  id: SortSchema.optional(),
  childId: SortSchema.optional(),
  planModalityActivitySchoolId: SortSchema.optional(),
  status: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const PlanModalityActivitySchoolChildFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: PlanModalityActivitySchoolChildWhereSchema.optional(),
  sort: PlanModalityActivitySchoolChildSortSchema.optional(),
  include: PlanModalityActivitySchoolChildIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const PlanModalityActivitySchoolChildFindUniqueSchema = z.object({
  include: PlanModalityActivitySchoolChildIncludeSchema.optional(),
});

/** Create-body query schema*/
export const PlanModalityActivitySchoolChildCreateBodySchema = z.object({
  data: z.object({
    childId: z.coerce.number(),
    planModalityActivitySchoolId: z.coerce.number(),
    rejectionNote: z.string(),
    status: PlanModalityActivitySchoolChildStatus,
    child: ChildCreateBodySchema.shape.data,
    guardian: GuardianCreateBodySchema.shape.data,
  }),
});

/** Update-body query schema*/
export const PlanModalityActivitySchoolChildUpdateBodySchema = z.object({
  data: PlanModalityActivitySchoolChildCreateBodySchema.shape.data.partial(),
});
