import { z } from 'zod';

import {
  NumberOperatorsSchema,
  SortSchema,
  StringOperatorsSchema,
} from '@/server/utils/query/schemas';

const PlanModalityActivitySchoolProofFileWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  planModalityActivitySchoolProofId: z.union([z.number(), NumberOperatorsSchema]).optional(),
  proofFileClassificationId: z.union([z.number(), NumberOperatorsSchema]).optional(),
  fileUrl: z.union([z.string(), StringOperatorsSchema]).optional(),
});

type PlanModalityActivitySchoolProofFileWhereSchemaType = z.infer<
  typeof PlanModalityActivitySchoolProofFileWhereBaseSchema
> & {
  _and?: PlanModalityActivitySchoolProofFileWhereSchemaType[];
  _or?: PlanModalityActivitySchoolProofFileWhereSchemaType[];
  _not?: PlanModalityActivitySchoolProofFileWhereSchemaType[];
};

const PlanModalityActivitySchoolProofFileWhereSchema: z.ZodType<PlanModalityActivitySchoolProofFileWhereSchemaType> =
  PlanModalityActivitySchoolProofFileWhereBaseSchema.extend({
    _and: z.lazy(() => PlanModalityActivitySchoolProofFileWhereSchema.array().optional()),
    _or: z.lazy(() => PlanModalityActivitySchoolProofFileWhereSchema.array().optional()),
    _not: z.lazy(() => PlanModalityActivitySchoolProofFileWhereSchema.array().optional()),
  });

const PlanModalityActivitySchoolProofFileIncludeSchema = z.object({
  planModalityActivitySchoolProof: z.boolean().optional(),
  proofFileClassification: z.boolean().optional(),
});

const PlanModalityActivitySchoolProofFileSortSchema = z.object({
  id: SortSchema.optional(),
  planModalityActivitySchoolProofId: SortSchema.optional(),
  proofFileClassificationId: SortSchema.optional(),
  filePath: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const PlanModalityActivitySchoolProofFileFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: PlanModalityActivitySchoolProofFileWhereSchema.optional(),
  sort: PlanModalityActivitySchoolProofFileSortSchema.optional(),
  include: PlanModalityActivitySchoolProofFileIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const PlanModalityActivitySchoolProofFileFindUniqueSchema = z.object({
  include: PlanModalityActivitySchoolProofFileIncludeSchema.optional(),
});

/** Create-body query schema*/
export const PlanModalityActivitySchoolProofFileCreateBodySchema = z.object({
  data: z.object({
    planModalityActivitySchoolProofId: z.coerce.number(),
    proofFileClassificationId: z.coerce.number(),
    filePath: z.string(),
  }),
});

/** Update-body query schema*/
export const PlanModalityActivitySchoolProofFileUpdateBodySchema = z.object({
  data: PlanModalityActivitySchoolProofFileCreateBodySchema.shape.data.partial(),
});
