import { z } from 'zod';

import {
  NumberOperatorsSchema,
  SortSchema,
  StringOperatorsSchema,
} from '@/server/utils/query/schemas';

const PopulationWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  code: z.union([z.string(), StringOperatorsSchema]).optional(),
  name: z.union([z.string(), StringOperatorsSchema]).optional(),
});

type PopulationWhereSchemaType = z.infer<typeof PopulationWhereBaseSchema> & {
  _and?: PopulationWhereSchemaType[];
  _or?: PopulationWhereSchemaType[];
  _not?: PopulationWhereSchemaType[];
};

const PopulationWhereSchema: z.ZodType<PopulationWhereSchemaType> =
  PopulationWhereBaseSchema.extend({
    _and: z.lazy(() => PopulationWhereSchema.array().optional()),
    _or: z.lazy(() => PopulationWhereSchema.array().optional()),
    _not: z.lazy(() => PopulationWhereSchema.array().optional()),
  });

const PopulationIncludeSchema = z.object({
  children: z.boolean().optional(),
});

const PopulationSortSchema = z.object({
  id: SortSchema.optional(),
  code: SortSchema.optional(),
  name: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const PopulationFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: PopulationWhereSchema.optional(),
  sort: PopulationSortSchema.optional(),
  include: PopulationIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const PopulationFindUniqueSchema = z.object({
  include: PopulationIncludeSchema.optional(),
});

/** Create-body query schema*/
export const PopulationCreateBodySchema = z.object({
  data: z.object({
    code: z.string().min(1),
    name: z.string().min(1),
  }),
});

/** Update-body query schema*/
export const PopulationUpdateBodySchema = z.object({
  data: PopulationCreateBodySchema.shape.data.partial(),
});
