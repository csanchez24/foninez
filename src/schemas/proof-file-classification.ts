import { z } from 'zod';

import {
  NumberOperatorsSchema,
  SortSchema,
  StringOperatorsSchema,
} from '@/server/utils/query/schemas';

const ProofFileClassificationWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  name: z.union([z.string(), StringOperatorsSchema]).optional(),
});

type ProofFileClassificationWhereSchemaType = z.infer<
  typeof ProofFileClassificationWhereBaseSchema
> & {
  _and?: ProofFileClassificationWhereSchemaType[];
  _or?: ProofFileClassificationWhereSchemaType[];
  _not?: ProofFileClassificationWhereSchemaType[];
};

const ProofFileClassificationWhereSchema: z.ZodType<ProofFileClassificationWhereSchemaType> =
  ProofFileClassificationWhereBaseSchema.extend({
    _and: z.lazy(() => ProofFileClassificationWhereSchema.array().optional()),
    _or: z.lazy(() => ProofFileClassificationWhereSchema.array().optional()),
    _not: z.lazy(() => ProofFileClassificationWhereSchema.array().optional()),
  });

const ProofFileClassificationIncludeSchema = z.object({
  planModalityActivitySchoolProofFiles: z.boolean().optional(),
});

const ProofFileClassificationSortSchema = z.object({
  id: SortSchema.optional(),
  name: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const ProofFileClassificationFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: ProofFileClassificationWhereSchema.optional(),
  sort: ProofFileClassificationSortSchema.optional(),
  include: ProofFileClassificationIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const ProofFileClassificationFindUniqueSchema = z.object({
  include: ProofFileClassificationIncludeSchema.optional(),
});

/** Create-body query schema*/
export const ProofFileClassificationCreateBodySchema = z.object({
  data: z.object({
    name: z.string().min(1),
  }),
});

/** Update-body query schema*/
export const ProofFileClassificationUpdateBodySchema = z.object({
  data: ProofFileClassificationCreateBodySchema.shape.data.partial(),
});
