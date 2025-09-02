import { z } from 'zod';

import {
  NumberOperatorsSchema,
  SortSchema,
  StringOperatorsSchema,
} from '@/server/utils/query/schemas';

const CountryWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  code: z.union([z.string(), StringOperatorsSchema]).optional(),
  name: z.union([z.string(), StringOperatorsSchema]).optional(),
});

type CountryWhereSchemaType = z.infer<typeof CountryWhereBaseSchema> & {
  _and?: CountryWhereSchemaType[];
  _or?: CountryWhereSchemaType[];
  _not?: CountryWhereSchemaType[];
};

const CountryWhereSchema: z.ZodType<CountryWhereSchemaType> = CountryWhereBaseSchema.extend({
  _and: z.lazy(() => CountryWhereSchema.array().optional()),
  _or: z.lazy(() => CountryWhereSchema.array().optional()),
  _not: z.lazy(() => CountryWhereSchema.array().optional()),
});

const CountryIncludeSchema = z.object({
  children: z.boolean().optional(),
});

const CountrySortSchema = z.object({
  id: SortSchema.optional(),
  code: SortSchema.optional(),
  name: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const CountryFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: CountryWhereSchema.optional(),
  sort: CountrySortSchema.optional(),
  include: CountryIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const CountryFindUniqueSchema = z.object({
  include: CountryIncludeSchema.optional(),
});

/** Create-body query schema*/
export const CountryCreateBodySchema = z.object({
  data: z.object({
    code: z.string().min(1),
    name: z.string().min(1),
  }),
});

/** Update-body query schema*/
export const CountryUpdateBodySchema = z.object({
  data: CountryCreateBodySchema.shape.data.partial(),
});
