import { z } from 'zod';

import { NumberOperatorsSchema, SortSchema } from '@/server/utils/query/schemas';

const PlanModalityActivityProofFileWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  proofFileClassificationId: z.union([z.number(), NumberOperatorsSchema]).optional(),
  planModalityActivityId: z.union([z.number(), NumberOperatorsSchema]).optional(),
});

type PlanModalityActivityProofFileWhereSchemaType = z.infer<
  typeof PlanModalityActivityProofFileWhereBaseSchema
> & {
  _and?: PlanModalityActivityProofFileWhereSchemaType[];
  _or?: PlanModalityActivityProofFileWhereSchemaType[];
  _not?: PlanModalityActivityProofFileWhereSchemaType[];
};

const PlanModalityActivityProofFileWhereSchema: z.ZodType<PlanModalityActivityProofFileWhereSchemaType> =
  PlanModalityActivityProofFileWhereBaseSchema.extend({
    _and: z.lazy(() => PlanModalityActivityProofFileWhereSchema.array().optional()),
    _or: z.lazy(() => PlanModalityActivityProofFileWhereSchema.array().optional()),
    _not: z.lazy(() => PlanModalityActivityProofFileWhereSchema.array().optional()),
  });

const PlanModalityActivityProofFileIncludeSchema = z.object({
  proofFileClassification: z.boolean().optional(),
  planModalityActivity: z.boolean().optional(),
});

const PlanModalityActivityProofFileSortSchema = z.object({
  id: SortSchema.optional(),
  planModalityActivityId: SortSchema.optional(),
  proofFileClassificationId: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const PlanModalityActivityProofFileFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: PlanModalityActivityProofFileWhereSchema.optional(),
  sort: PlanModalityActivityProofFileSortSchema.optional(),
  include: PlanModalityActivityProofFileIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const PlanModalityActivityProofFileFindUniqueSchema = z.object({
  include: PlanModalityActivityProofFileIncludeSchema.optional(),
});

/** Create-body query schema*/
export const PlanModalityActivityProofFileCreateBodySchema = z.object({
  data: z.object({
    proofFileClassificationId: z.coerce.number(),
    planModalityActivityId: z.coerce.number(),
  }),
});

/** Update-body query schema*/
export const PlanModalityActivityProofFileUpdateBodySchema = z.object({
  data: PlanModalityActivityProofFileCreateBodySchema.shape.data.partial(),
});
