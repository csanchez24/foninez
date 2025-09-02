import { z } from 'zod';

import { NumberOperatorsSchema, SortSchema } from '@/server/utils/query/schemas';

const PlanModalityWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  planId: z.union([z.number(), NumberOperatorsSchema]).optional(),
  modalityId: z.union([z.number(), NumberOperatorsSchema]).optional(),
});

type PlanModalityWhereSchemaType = z.infer<typeof PlanModalityWhereBaseSchema> & {
  _and?: PlanModalityWhereSchemaType[];
  _or?: PlanModalityWhereSchemaType[];
  _not?: PlanModalityWhereSchemaType[];
};

const PlanModalityWhereSchema: z.ZodType<PlanModalityWhereSchemaType> =
  PlanModalityWhereBaseSchema.extend({
    _and: z.lazy(() => PlanModalityWhereSchema.array().optional()),
    _or: z.lazy(() => PlanModalityWhereSchema.array().optional()),
    _not: z.lazy(() => PlanModalityWhereSchema.array().optional()),
  });

const PlanModalityIncludeSchema = z.object({
  plan: z.boolean().optional(),
  modality: z.boolean().optional(),
  planModalityActivities: z.boolean().optional(),
});

const PlanModalitySortSchema = z.object({
  id: SortSchema.optional(),
  planId: SortSchema.optional(),
  modalityId: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const PlanModalityFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: PlanModalityWhereSchema.optional(),
  sort: PlanModalitySortSchema.optional(),
  include: PlanModalityIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const PlanModalityFindUniqueSchema = z.object({
  include: PlanModalityIncludeSchema.optional(),
});

/** Create-body query schema*/
export const PlanModalityCreateBodySchema = z.object({
  data: z.object({
    name: z.string().min(1),
    planId: z.coerce.number(),
    modalityId: z.coerce.number(),
  }),
});

/** Update-body query schema*/
export const PlanModalityUpdateBodySchema = z.object({
  data: PlanModalityCreateBodySchema.shape.data.partial(),
});
