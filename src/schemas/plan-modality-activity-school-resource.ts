import { z } from 'zod';

import { NumberOperatorsSchema, SortSchema } from '@/server/utils/query/schemas';

const PlanModalityActivitySchoolResourceWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  resourcesQty: z.union([z.number(), NumberOperatorsSchema]).optional(),
  resourcesReceivedQty: z.union([z.number(), NumberOperatorsSchema]).optional(),
  resourcesUsedQty: z.union([z.number(), NumberOperatorsSchema]).optional(),
  planModalityActivitySchoolId: z.union([z.number(), NumberOperatorsSchema]).optional(),
  planModalityActivityResourceId: z.union([z.number(), NumberOperatorsSchema]).optional(),
});

type PlanModalityActivitySchoolResourceWhereSchemaType = z.infer<
  typeof PlanModalityActivitySchoolResourceWhereBaseSchema
> & {
  _and?: PlanModalityActivitySchoolResourceWhereSchemaType[];
  _or?: PlanModalityActivitySchoolResourceWhereSchemaType[];
  _not?: PlanModalityActivitySchoolResourceWhereSchemaType[];
};

const PlanModalityActivitySchoolResourceWhereSchema: z.ZodType<PlanModalityActivitySchoolResourceWhereSchemaType> =
  PlanModalityActivitySchoolResourceWhereBaseSchema.extend({
    _and: z.lazy(() => PlanModalityActivitySchoolResourceWhereSchema.array().optional()),
    _or: z.lazy(() => PlanModalityActivitySchoolResourceWhereSchema.array().optional()),
    _not: z.lazy(() => PlanModalityActivitySchoolResourceWhereSchema.array().optional()),
  });

const PlanModalityActivitySchoolResourceIncludeSchema = z.object({
  planModalityActivitySchool: z.boolean().optional(),
  planModalityActivityResource: z
    .object({
      with: z.object({
        resource: z.boolean(),
        planModalityActivitySchoolResources: z.boolean(),
      }),
    })
    .optional(),
});

const PlanModalityActivitySchoolResourceSortSchema = z.object({
  id: SortSchema.optional(),
  planModalityActivityResourceId: SortSchema.optional(),
  planModalityActivitySchoolId: SortSchema.optional(),
  resourcesQty: SortSchema.optional(),
  resourcesReceivedQty: SortSchema.optional(),
  resourcesUsedQty: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const PlanModalityActivitySchoolResourceFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: PlanModalityActivitySchoolResourceWhereSchema.optional(),
  sort: PlanModalityActivitySchoolResourceSortSchema.optional(),
  include: PlanModalityActivitySchoolResourceIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const PlanModalityActivitySchoolResourceFindUniqueSchema = z.object({
  include: PlanModalityActivitySchoolResourceIncludeSchema.optional(),
});

/** Create-body query schema*/
export const PlanModalityActivitySchoolResourceCreateBodySchema = z.object({
  data: z.object({
    resourcesQty: z.coerce.number(),
    resourcesReceivedQty: z.coerce.number(),
    resourcesUsedQty: z.coerce.number(),
    planModalityActivitySchoolId: z.coerce.number(),
    planModalityActivityResourceId: z.coerce.number(),
    note: z.string().nullish(),
  }),
});

/** Update-body query schema*/
export const PlanModalityActivitySchoolResourceUpdateBodySchema = z.object({
  data: PlanModalityActivitySchoolResourceCreateBodySchema.shape.data.partial(),
});

export const PlanModalityActivitySchoolResourceUpdateMassBodySchema = z.object({
  data: z.array(
    PlanModalityActivitySchoolResourceCreateBodySchema.shape.data.extend({
      id: z.number(),
    })
  ),
});
