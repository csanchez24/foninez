import { z } from 'zod';

import {
  NumberOperatorsSchema,
  SortSchema,
  StringOperatorsSchema,
} from '@/server/utils/query/schemas';

const InventoryWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  name: z.union([z.string(), StringOperatorsSchema]).optional(),
  resourceId: z.union([z.number(), NumberOperatorsSchema]).optional(),
});

type InventoryWhereSchemaType = z.infer<typeof InventoryWhereBaseSchema> & {
  _and?: InventoryWhereSchemaType[];
  _or?: InventoryWhereSchemaType[];
  _not?: InventoryWhereSchemaType[];
};

const InventoryWhereSchema: z.ZodType<InventoryWhereSchemaType> = InventoryWhereBaseSchema.extend({
  _and: z.lazy(() => InventoryWhereSchema.array().optional()),
  _or: z.lazy(() => InventoryWhereSchema.array().optional()),
  _not: z.lazy(() => InventoryWhereSchema.array().optional()),
});

const InventoryIncludeSchema = z.object({
  resource: z.boolean().optional(),
});

const InventorySortSchema = z.object({
  id: SortSchema.optional(),
  name: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const InventoryFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: InventoryWhereSchema.optional(),
  sort: InventorySortSchema.optional(),
  include: InventoryIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const InventoryFindUniqueSchema = z.object({
  include: InventoryIncludeSchema.optional(),
});

/** Create-body query schema*/
export const InventoryCreateBodySchema = z.object({
  data: z.object({
    name: z.string().min(1),
    qty: z.coerce.number(),
    resourceId: z.coerce.number(),
  }),
});

/** Update-body query schema*/
export const InventoryUpdateBodySchema = z.object({
  data: InventoryCreateBodySchema.shape.data.partial(),
});
