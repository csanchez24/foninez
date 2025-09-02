import { z } from 'zod';

import {
  NumberOperatorsSchema,
  SortSchema,
  StringOperatorsSchema,
} from '@/server/utils/query/schemas';

const CityWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  name: z.union([z.string(), StringOperatorsSchema]).optional(),
});

type CityWhereSchemaType = z.infer<typeof CityWhereBaseSchema> & {
  _and?: CityWhereSchemaType[];
  _or?: CityWhereSchemaType[];
  _not?: CityWhereSchemaType[];
};

const CityWhereSchema: z.ZodType<CityWhereSchemaType> = CityWhereBaseSchema.extend({
  _and: z.lazy(() => CityWhereSchema.array().optional()),
  _or: z.lazy(() => CityWhereSchema.array().optional()),
  _not: z.lazy(() => CityWhereSchema.array().optional()),
});

const CityIncludeSchema = z.object({
  schools: z.boolean().optional(),
});

const CitySortSchema = z.object({
  id: SortSchema.optional(),
  name: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const CityFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: CityWhereSchema.optional(),
  sort: CitySortSchema.optional(),
  include: CityIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const CityFindUniqueSchema = z.object({
  include: CityIncludeSchema.optional(),
});

/** Create-body query schema*/
export const CityCreateBodySchema = z.object({
  data: z.object({
    code: z.string().min(1),
    name: z.string().min(1),
  }),
});

/** Update-body query schema*/
export const CityUpdateBodySchema = z.object({
  data: CityCreateBodySchema.shape.data.partial(),
});
