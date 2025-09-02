import { z } from 'zod';

import {
  NumberOperatorsSchema,
  SortSchema,
  StringOperatorsSchema,
} from '@/server/utils/query/schemas';

const ShiftWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  code: z.union([z.string(), StringOperatorsSchema]).optional(),
  name: z.union([z.string(), StringOperatorsSchema]).optional(),
});

type ShiftWhereSchemaType = z.infer<typeof ShiftWhereBaseSchema> & {
  _and?: ShiftWhereSchemaType[];
  _or?: ShiftWhereSchemaType[];
  _not?: ShiftWhereSchemaType[];
};

const ShiftWhereSchema: z.ZodType<ShiftWhereSchemaType> = ShiftWhereBaseSchema.extend({
  _and: z.lazy(() => ShiftWhereSchema.array().optional()),
  _or: z.lazy(() => ShiftWhereSchema.array().optional()),
  _not: z.lazy(() => ShiftWhereSchema.array().optional()),
});

const ShiftIncludeSchema = z.object({
  children: z.boolean().optional(),
});

const ShiftSortSchema = z.object({
  id: SortSchema.optional(),
  code: SortSchema.optional(),
  name: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const ShiftFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: ShiftWhereSchema.optional(),
  sort: ShiftSortSchema.optional(),
  include: ShiftIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const ShiftFindUniqueSchema = z.object({
  include: ShiftIncludeSchema.optional(),
});

/** Create-body query schema*/
export const ShiftCreateBodySchema = z.object({
  data: z.object({
    code: z.string().min(1),
    name: z.string().min(1),
  }),
});

/** Update-body query schema*/
export const ShiftUpdateBodySchema = z.object({
  data: ShiftCreateBodySchema.shape.data.partial(),
});
