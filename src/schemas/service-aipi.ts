import { z } from 'zod';

import {
  NumberOperatorsSchema,
  SortSchema,
  StringOperatorsSchema,
} from '@/server/utils/query/schemas';

const ServiceAipiWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  code: z.union([z.string(), StringOperatorsSchema]).optional(),
  name: z.union([z.string(), StringOperatorsSchema]).optional(),
});

type ServiceAipiWhereSchemaType = z.infer<typeof ServiceAipiWhereBaseSchema> & {
  _and?: ServiceAipiWhereSchemaType[];
  _or?: ServiceAipiWhereSchemaType[];
  _not?: ServiceAipiWhereSchemaType[];
};

const ServiceAipiWhereSchema: z.ZodType<ServiceAipiWhereSchemaType> =
  ServiceAipiWhereBaseSchema.extend({
    _and: z.lazy(() => ServiceAipiWhereSchema.array().optional()),
    _or: z.lazy(() => ServiceAipiWhereSchema.array().optional()),
    _not: z.lazy(() => ServiceAipiWhereSchema.array().optional()),
  });

const ServiceAipiIncludeSchema = z.object({
  children: z.boolean().optional(),
});

const ServiceAipiSortSchema = z.object({
  id: SortSchema.optional(),
  code: SortSchema.optional(),
  name: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const ServiceAipiFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: ServiceAipiWhereSchema.optional(),
  sort: ServiceAipiSortSchema.optional(),
  include: ServiceAipiIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const ServiceAipiFindUniqueSchema = z.object({
  include: ServiceAipiIncludeSchema.optional(),
});

/** Create-body query schema*/
export const ServiceAipiCreateBodySchema = z.object({
  data: z.object({
    code: z.string().min(1),
    name: z.string().min(1),
  }),
});

/** Update-body query schema*/
export const ServiceAipiUpdateBodySchema = z.object({
  data: ServiceAipiCreateBodySchema.shape.data.partial(),
});
