import { z } from 'zod';

import {
  NumberOperatorsSchema,
  SortSchema,
  StringOperatorsSchema,
} from '@/server/utils/query/schemas';

const PlanStatusSchema = z.enum(['draft', 'pending review', 'reviewed', 'rejected', 'approved']);

const PlanWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  year: z.union([z.number(), NumberOperatorsSchema]).optional(),
  programId: z.union([z.number(), NumberOperatorsSchema]).optional(),
  longTermObjective: z.union([z.string(), StringOperatorsSchema]).optional(),
  shortTermObjective: z.union([z.string(), StringOperatorsSchema]).optional(),
  justification: z.union([z.string(), StringOperatorsSchema]).optional(),
  status: PlanStatusSchema.optional(),
});

type PlanWhereSchemaType = z.infer<typeof PlanWhereBaseSchema> & {
  _and?: PlanWhereSchemaType[];
  _or?: PlanWhereSchemaType[];
  _not?: PlanWhereSchemaType[];
};

const PlanWhereSchema: z.ZodType<PlanWhereSchemaType> = PlanWhereBaseSchema.extend({
  _and: z.lazy(() => PlanWhereSchema.array().optional()),
  _or: z.lazy(() => PlanWhereSchema.array().optional()),
  _not: z.lazy(() => PlanWhereSchema.array().optional()),
});

const PlanIncludeSchema = z.object({
  program: z.boolean().optional(),
  planModalities: z.union([
    z.boolean().optional(),
    z.object({
      with: z.object({
        modality: z.boolean(),
      }),
    }),
  ]),
});

const PlanSortSchema = z.object({
  id: SortSchema.optional(),
  year: SortSchema.optional(),
  status: SortSchema.optional(),
  programId: SortSchema.optional(),
  longTermObjective: SortSchema.optional(),
  shortTermObjective: SortSchema.optional(),
  justification: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const PlanFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: PlanWhereSchema.optional(),
  sort: PlanSortSchema.optional(),
  include: PlanIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const PlanFindUniqueSchema = z.object({
  include: PlanIncludeSchema.optional(),
});

/** Create-body query schema*/
export const PlanCreateBodySchema = z.object({
  data: z.object({
    longTermObjective: z.string().optional(),
    shortTermObjective: z.string().optional(),
    justification: z.string().optional(),
    description: z.string().optional(),
    rejectionNote: z.string().optional(),
    year: z.coerce.number(),
    programId: z.coerce.number(),
    status: PlanStatusSchema,
  }),
});

/** Update-body query schema*/
export const PlanUpdateBodySchema = z.object({
  data: PlanCreateBodySchema.shape.data.partial(),
});

/** Update-body query schema*/
export const PlanUpdateStatusBodySchema = z.object({
  data: z.object({ status: PlanStatusSchema, rejectionNote: z.string().optional() }),
});
