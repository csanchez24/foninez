import { z } from 'zod';

import {
  NumberOperatorsSchema,
  SortSchema,
  StringOperatorsSchema,
} from '@/server/utils/query/schemas';

const EthnicityWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  code: z.union([z.string(), StringOperatorsSchema]).optional(),
  name: z.union([z.string(), StringOperatorsSchema]).optional(),
});

type EthnicityWhereSchemaType = z.infer<typeof EthnicityWhereBaseSchema> & {
  _and?: EthnicityWhereSchemaType[];
  _or?: EthnicityWhereSchemaType[];
  _not?: EthnicityWhereSchemaType[];
};

const EthnicityWhereSchema: z.ZodType<EthnicityWhereSchemaType> = EthnicityWhereBaseSchema.extend({
  _and: z.lazy(() => EthnicityWhereSchema.array().optional()),
  _or: z.lazy(() => EthnicityWhereSchema.array().optional()),
  _not: z.lazy(() => EthnicityWhereSchema.array().optional()),
});

const EthnicityIncludeSchema = z.object({
  children: z.boolean().optional(),
});

const EthnicitySortSchema = z.object({
  id: SortSchema.optional(),
  code: SortSchema.optional(),
  name: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const EthnicityFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: EthnicityWhereSchema.optional(),
  sort: EthnicitySortSchema.optional(),
  include: EthnicityIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const EthnicityFindUniqueSchema = z.object({
  include: EthnicityIncludeSchema.optional(),
});

/** Create-body query schema*/
export const EthnicityCreateBodySchema = z.object({
  data: z.object({
    code: z.string().min(1),
    name: z.string().min(1),
  }),
});

/** Update-body query schema*/
export const EthnicityUpdateBodySchema = z.object({
  data: EthnicityCreateBodySchema.shape.data.partial(),
});
