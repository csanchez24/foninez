import { z } from 'zod';

import { NumberOperatorsSchema, SortSchema } from '@/server/utils/query/schemas';

const PlanModalityActivityResourceWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  qty: z.union([z.number(), NumberOperatorsSchema]).optional(),
  resourceId: z.union([z.number(), NumberOperatorsSchema]).optional(),
  planModalityActivityId: z.union([z.number(), NumberOperatorsSchema]).optional(),
});

type PlanModalityActivityResourceWhereSchemaType = z.infer<
  typeof PlanModalityActivityResourceWhereBaseSchema
> & {
  _and?: PlanModalityActivityResourceWhereSchemaType[];
  _or?: PlanModalityActivityResourceWhereSchemaType[];
  _not?: PlanModalityActivityResourceWhereSchemaType[];
};

const PlanModalityActivityResourceWhereSchema: z.ZodType<PlanModalityActivityResourceWhereSchemaType> =
  PlanModalityActivityResourceWhereBaseSchema.extend({
    _and: z.lazy(() => PlanModalityActivityResourceWhereSchema.array().optional()),
    _or: z.lazy(() => PlanModalityActivityResourceWhereSchema.array().optional()),
    _not: z.lazy(() => PlanModalityActivityResourceWhereSchema.array().optional()),
  });

const PlanModalityActivityResourceIncludeSchema = z.object({
  resource: z.boolean().optional(),
  planModalityActivity: z.boolean().optional(),
  planModalityActivitySchoolsResources: z.boolean().optional(),
});

const PlanModalityActivityResourceSortSchema = z.object({
  id: SortSchema.optional(),
  qty: SortSchema.optional(),
  resourceId: SortSchema.optional(),
  planModalityActivityId: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const PlanModalityActivityResourceFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: PlanModalityActivityResourceWhereSchema.optional(),
  sort: PlanModalityActivityResourceSortSchema.optional(),
  include: PlanModalityActivityResourceIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const PlanModalityActivityResourceFindUniqueSchema = z.object({
  include: PlanModalityActivityResourceIncludeSchema.optional(),
});

/** Create-body query schema*/
export const PlanModalityActivityResourceCreateBodySchema = z.object({
  data: z.object({
    qty: z.coerce.number(),
    resourceId: z.coerce.number(),
    planModalityActivityId: z.coerce.number(),
  }),
});

/** Update-body query schema*/
export const PlanModalityActivityResourceUpdateBodySchema = z.object({
  data: PlanModalityActivityResourceCreateBodySchema.shape.data.partial(),
});
