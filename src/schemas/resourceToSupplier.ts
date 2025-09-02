import { z } from 'zod';

import { NumberOperatorsSchema, SortSchema } from '@/server/utils/query/schemas';

const ResourceToSupplierWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  supplierId: z.union([z.number(), NumberOperatorsSchema]).optional(),
  resourceId: z.union([z.number(), NumberOperatorsSchema]).optional(),
  resourceClassificationId: z.union([z.number(), NumberOperatorsSchema]).optional(),
});

type ResourceToSupplierWhereSchemaType = z.infer<typeof ResourceToSupplierWhereBaseSchema> & {
  _and?: ResourceToSupplierWhereSchemaType[];
  _or?: ResourceToSupplierWhereSchemaType[];
  _not?: ResourceToSupplierWhereSchemaType[];
};

const ResourceToSupplierWhereSchema: z.ZodType<ResourceToSupplierWhereSchemaType> =
  ResourceToSupplierWhereBaseSchema.extend({
    _and: z.lazy(() => ResourceToSupplierWhereSchema.array().optional()),
    _or: z.lazy(() => ResourceToSupplierWhereSchema.array().optional()),
    _not: z.lazy(() => ResourceToSupplierWhereSchema.array().optional()),
  });

const ResourceToSupplierIncludeSchema = z.object({
  resource: z.boolean(),
  supplier: z.boolean(),
});

const ResourceToSupplierSortSchema = z.object({
  id: SortSchema.optional(),
  supplierId: SortSchema.optional(),
  resourceId: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const ResourceToSupplierFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: ResourceToSupplierWhereSchema.optional(),
  sort: ResourceToSupplierSortSchema.optional(),
  include: ResourceToSupplierIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const ResourceToSupplierFindUniqueSchema = z.object({
  include: ResourceToSupplierIncludeSchema.optional(),
});

/** Create-body query schema*/
export const ResourceToSupplierCreateBodySchema = z.object({
  data: z.object({
    supplierId: z.coerce.number(),
    resourceId: z.coerce.number(),
  }),
});

/** Update-body query schema*/
export const ResourceToSupplierUpdateBodySchema = z.object({
  data: ResourceToSupplierCreateBodySchema.shape.data.partial(),
});
