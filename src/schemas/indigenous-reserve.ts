import { z } from 'zod';

import {
  NumberOperatorsSchema,
  SortSchema,
  StringOperatorsSchema,
} from '@/server/utils/query/schemas';

const IndigenousReserveWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  code: z.union([z.string(), StringOperatorsSchema]).optional(),
  name: z.union([z.string(), StringOperatorsSchema]).optional(),
});

type IndigenousReserveWhereSchemaType = z.infer<typeof IndigenousReserveWhereBaseSchema> & {
  _and?: IndigenousReserveWhereSchemaType[];
  _or?: IndigenousReserveWhereSchemaType[];
  _not?: IndigenousReserveWhereSchemaType[];
};

const IndigenousReserveWhereSchema: z.ZodType<IndigenousReserveWhereSchemaType> =
  IndigenousReserveWhereBaseSchema.extend({
    _and: z.lazy(() => IndigenousReserveWhereSchema.array().optional()),
    _or: z.lazy(() => IndigenousReserveWhereSchema.array().optional()),
    _not: z.lazy(() => IndigenousReserveWhereSchema.array().optional()),
  });

const IndigenousReserveIncludeSchema = z.object({
  children: z.boolean().optional(),
});

const IndigenousReserveSortSchema = z.object({
  id: SortSchema.optional(),
  code: SortSchema.optional(),
  name: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const IndigenousReserveFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: IndigenousReserveWhereSchema.optional(),
  sort: IndigenousReserveSortSchema.optional(),
  include: IndigenousReserveIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const IndigenousReserveFindUniqueSchema = z.object({
  include: IndigenousReserveIncludeSchema.optional(),
});

/** Create-body query schema*/
export const IndigenousReserveCreateBodySchema = z.object({
  data: z.object({
    code: z.string().min(1),
    name: z.string().min(1),
  }),
});

/** Update-body query schema*/
export const IndigenousReserveUpdateBodySchema = z.object({
  data: IndigenousReserveCreateBodySchema.shape.data.partial(),
});
