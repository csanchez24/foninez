import { z } from 'zod';

import {
  NumberOperatorsSchema,
  SortSchema,
  StringOperatorsSchema,
} from '@/server/utils/query/schemas';
import { ResourceToSupplierCreateBodySchema } from './resourceToSupplier';
import { SupplierUpdateBodySchema } from './supplier';

const ResourceWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  name: z.union([z.string(), StringOperatorsSchema]).optional(),
  resourceClassificationId: z.union([z.number(), NumberOperatorsSchema]).optional(),
});

type ResourceWhereSchemaType = z.infer<typeof ResourceWhereBaseSchema> & {
  _and?: ResourceWhereSchemaType[];
  _or?: ResourceWhereSchemaType[];
  _not?: ResourceWhereSchemaType[];
};

const ResourceWhereSchema: z.ZodType<ResourceWhereSchemaType> = ResourceWhereBaseSchema.extend({
  _and: z.lazy(() => ResourceWhereSchema.array().optional()),
  _or: z.lazy(() => ResourceWhereSchema.array().optional()),
  _not: z.lazy(() => ResourceWhereSchema.array().optional()),
});

const ResourceIncludeSchema = z.object({
  inventoryTransactionLines: z
    .object({
      with: z.object({
        inventoryTransaction: z.object({
          with: z.object({
            planModalityActivitySchool: z.object({
              with: z.object({
                planModalityActivity: z.boolean(),
                school: z.boolean(),
              }),
            }),
          }),
        }),
      }),
    })
    .optional(),
  planModalityActivityResources: z.boolean().optional(),
  inventory: z.boolean().optional(),
  resourceClassification: z.boolean().optional(),
  resourcesToSuppliers: z.object({
    with: z.object({
      resource: z.boolean(),
      supplier: z.boolean(),
    }),
  }),
});

const ResourceSortSchema = z.object({
  id: SortSchema.optional(),
  name: SortSchema.optional(),
  price: SortSchema.optional(),
  resourceClassificationId: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const ResourceFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: ResourceWhereSchema.optional(),
  sort: ResourceSortSchema.optional(),
  include: ResourceIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const ResourceFindUniqueSchema = z.object({
  include: ResourceIncludeSchema.optional(),
});

/** Create-body query schema*/
export const ResourceCreateBodySchema = z.object({
  data: z.object({
    name: z.string().min(1),
    price: z.coerce.number(),
    type: z.union([z.literal('internal'), z.literal('external')]),
    usageType: z.union([z.literal('general'), z.literal('individual')]),
    resourceClassificationId: z.coerce.number(),
    resourcesToSuppliers: z
      .lazy(() =>
        ResourceToSupplierCreateBodySchema.shape.data
          .omit({ resourceId: true, supplierId: true })
          .extend({
            supplier: z.lazy(() => SupplierUpdateBodySchema.shape.data.extend({ id: z.number() })),
          })
          .array()
          .optional()
      )
      .optional(),
  }),
});

/** Update-body query schema*/
export const ResourceUpdateBodySchema = z.object({
  data: ResourceCreateBodySchema.shape.data.partial(),
});
