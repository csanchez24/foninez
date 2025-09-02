import { z } from 'zod';

import {
  NumberOperatorsSchema,
  SortSchema,
  StringOperatorsSchema,
} from '@/server/utils/query/schemas';

const IndigenousCommunityWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  code: z.union([z.string(), StringOperatorsSchema]).optional(),
  name: z.union([z.string(), StringOperatorsSchema]).optional(),
});

type IndigenousCommunityWhereSchemaType = z.infer<typeof IndigenousCommunityWhereBaseSchema> & {
  _and?: IndigenousCommunityWhereSchemaType[];
  _or?: IndigenousCommunityWhereSchemaType[];
  _not?: IndigenousCommunityWhereSchemaType[];
};

const IndigenousCommunityWhereSchema: z.ZodType<IndigenousCommunityWhereSchemaType> =
  IndigenousCommunityWhereBaseSchema.extend({
    _and: z.lazy(() => IndigenousCommunityWhereSchema.array().optional()),
    _or: z.lazy(() => IndigenousCommunityWhereSchema.array().optional()),
    _not: z.lazy(() => IndigenousCommunityWhereSchema.array().optional()),
  });

const IndigenousCommunityIncludeSchema = z.object({
  children: z.boolean().optional(),
});

const IndigenousCommunitySortSchema = z.object({
  id: SortSchema.optional(),
  code: SortSchema.optional(),
  name: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const IndigenousCommunityFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: IndigenousCommunityWhereSchema.optional(),
  sort: IndigenousCommunitySortSchema.optional(),
  include: IndigenousCommunityIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const IndigenousCommunityFindUniqueSchema = z.object({
  include: IndigenousCommunityIncludeSchema.optional(),
});

/** Create-body query schema*/
export const IndigenousCommunityCreateBodySchema = z.object({
  data: z.object({
    code: z.string().min(1),
    name: z.string().min(1),
  }),
});

/** Update-body query schema*/
export const IndigenousCommunityUpdateBodySchema = z.object({
  data: IndigenousCommunityCreateBodySchema.shape.data.partial(),
});
