import { z } from 'zod';

import {
  NumberOperatorsSchema,
  SortSchema,
  StringOperatorsSchema,
} from '@/server/utils/query/schemas';

const KinshipWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  code: z.union([z.string(), StringOperatorsSchema]).optional(),
  name: z.union([z.string(), StringOperatorsSchema]).optional(),
});

type KinshipWhereSchemaType = z.infer<typeof KinshipWhereBaseSchema> & {
  _and?: KinshipWhereSchemaType[];
  _or?: KinshipWhereSchemaType[];
  _not?: KinshipWhereSchemaType[];
};

const KinshipWhereSchema: z.ZodType<KinshipWhereSchemaType> = KinshipWhereBaseSchema.extend({
  _and: z.lazy(() => KinshipWhereSchema.array().optional()),
  _or: z.lazy(() => KinshipWhereSchema.array().optional()),
  _not: z.lazy(() => KinshipWhereSchema.array().optional()),
});

const KinshipIncludeSchema = z.object({
  children: z.boolean().optional(),
});

const KinshipSortSchema = z.object({
  id: SortSchema.optional(),
  code: SortSchema.optional(),
  name: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const KinshipFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: KinshipWhereSchema.optional(),
  sort: KinshipSortSchema.optional(),
  include: KinshipIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const KinshipFindUniqueSchema = z.object({
  include: KinshipIncludeSchema.optional(),
});

/** Create-body query schema*/
export const KinshipCreateBodySchema = z.object({
  data: z.object({
    code: z.string().min(1),
    name: z.string().min(1),
  }),
});

/** Update-body query schema*/
export const KinshipUpdateBodySchema = z.object({
  data: KinshipCreateBodySchema.shape.data.partial(),
});
