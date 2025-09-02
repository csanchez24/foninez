import { z } from 'zod';

import {
  NumberOperatorsSchema,
  SortSchema,
  StringOperatorsSchema,
} from '@/server/utils/query/schemas';

const ResourceClassificationWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  name: z.union([z.string(), StringOperatorsSchema]).optional(),
});

type ResourceClassificationWhereSchemaType = z.infer<typeof ResourceClassificationWhereBaseSchema> & {
  _and?: ResourceClassificationWhereSchemaType[];
  _or?: ResourceClassificationWhereSchemaType[];
  _not?: ResourceClassificationWhereSchemaType[];
};

const ResourceClassificationWhereSchema: z.ZodType<ResourceClassificationWhereSchemaType> =
  ResourceClassificationWhereBaseSchema.extend({
    _and: z.lazy(() => ResourceClassificationWhereSchema.array().optional()),
    _or: z.lazy(() => ResourceClassificationWhereSchema.array().optional()),
    _not: z.lazy(() => ResourceClassificationWhereSchema.array().optional()),
  });

const ResourceClassificationIncludeSchema = z.object({
  resources: z.boolean().optional(),
});

const ResourceClassificationSortSchema = z.object({
  id: SortSchema.optional(),
  name: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const ResourceClassificationFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: ResourceClassificationWhereSchema.optional(),
  sort: ResourceClassificationSortSchema.optional(),
  include: ResourceClassificationIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const ResourceClassificationFindUniqueSchema = z.object({
  include: ResourceClassificationIncludeSchema.optional(),
});

/** Create-body query schema*/
export const ResourceClassificationCreateBodySchema = z.object({
  data: z.object({
    name: z.string().min(1),
  }),
});

/** Update-body query schema*/
export const ResourceClassificationUpdateBodySchema = z.object({
  data: ResourceClassificationCreateBodySchema.shape.data.partial(),
});
