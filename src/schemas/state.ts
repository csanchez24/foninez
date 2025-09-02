import { z } from 'zod';

import {
  NumberOperatorsSchema,
  SortSchema,
  StringOperatorsSchema,
} from '@/server/utils/query/schemas';

const StateWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  code: z.union([z.string(), StringOperatorsSchema]).optional(),
  name: z.union([z.string(), StringOperatorsSchema]).optional(),
});

type StateWhereSchemaType = z.infer<typeof StateWhereBaseSchema> & {
  _and?: StateWhereSchemaType[];
  _or?: StateWhereSchemaType[];
  _not?: StateWhereSchemaType[];
};

const StateWhereSchema: z.ZodType<StateWhereSchemaType> = StateWhereBaseSchema.extend({
  _and: z.lazy(() => StateWhereSchema.array().optional()),
  _or: z.lazy(() => StateWhereSchema.array().optional()),
  _not: z.lazy(() => StateWhereSchema.array().optional()),
});

const StateIncludeSchema = z.object({
  children: z.boolean().optional(),
});

const StateSortSchema = z.object({
  id: SortSchema.optional(),
  code: SortSchema.optional(),
  name: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const StateFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: StateWhereSchema.optional(),
  sort: StateSortSchema.optional(),
  include: StateIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const StateFindUniqueSchema = z.object({
  include: StateIncludeSchema.optional(),
});

/** Create-body query schema*/
export const StateCreateBodySchema = z.object({
  data: z.object({
    code: z.string().min(1),
    name: z.string().min(1),
  }),
});

/** Update-body query schema*/
export const StateUpdateBodySchema = z.object({
  data: StateCreateBodySchema.shape.data.partial(),
});
