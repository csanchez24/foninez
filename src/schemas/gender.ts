import { z } from 'zod';

import {
  NumberOperatorsSchema,
  SortSchema,
  StringOperatorsSchema,
} from '@/server/utils/query/schemas';

const GenderWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  code: z.union([z.string(), StringOperatorsSchema]).optional(),
  name: z.union([z.string(), StringOperatorsSchema]).optional(),
});

type GenderWhereSchemaType = z.infer<typeof GenderWhereBaseSchema> & {
  _and?: GenderWhereSchemaType[];
  _or?: GenderWhereSchemaType[];
  _not?: GenderWhereSchemaType[];
};

const GenderWhereSchema: z.ZodType<GenderWhereSchemaType> = GenderWhereBaseSchema.extend({
  _and: z.lazy(() => GenderWhereSchema.array().optional()),
  _or: z.lazy(() => GenderWhereSchema.array().optional()),
  _not: z.lazy(() => GenderWhereSchema.array().optional()),
});

const GenderIncludeSchema = z.object({
  children: z.boolean().optional(),
});

const GenderSortSchema = z.object({
  id: SortSchema.optional(),
  code: SortSchema.optional(),
  name: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const GenderFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: GenderWhereSchema.optional(),
  sort: GenderSortSchema.optional(),
  include: GenderIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const GenderFindUniqueSchema = z.object({
  include: GenderIncludeSchema.optional(),
});

/** Create-body query schema*/
export const GenderCreateBodySchema = z.object({
  data: z.object({
    code: z.string().min(1),
    name: z.string().min(1),
  }),
});

/** Update-body query schema*/
export const GenderUpdateBodySchema = z.object({
  data: GenderCreateBodySchema.shape.data.partial(),
});
