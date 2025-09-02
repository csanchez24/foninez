import { z } from 'zod';

import { NumberOperatorsSchema, SortSchema } from '@/server/utils/query/schemas';

const InventoryTransactionLineWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  inventoryTransactionId: z.union([z.number(), NumberOperatorsSchema]).optional(),
  resourceId: z.union([z.number(), NumberOperatorsSchema]).optional(),
  qty: z.union([z.number(), NumberOperatorsSchema]).optional(),
});

type InventoryTransactionLineWhereSchemaType = z.infer<
  typeof InventoryTransactionLineWhereBaseSchema
> & {
  _and?: InventoryTransactionLineWhereSchemaType[];
  _or?: InventoryTransactionLineWhereSchemaType[];
  _not?: InventoryTransactionLineWhereSchemaType[];
};

const InventoryTransactionLineWhereSchema: z.ZodType<InventoryTransactionLineWhereSchemaType> =
  InventoryTransactionLineWhereBaseSchema.extend({
    _and: z.lazy(() => InventoryTransactionLineWhereSchema.array().optional()),
    _or: z.lazy(() => InventoryTransactionLineWhereSchema.array().optional()),
    _not: z.lazy(() => InventoryTransactionLineWhereSchema.array().optional()),
  });

const InventoryTransactionLineIncludeSchema = z.object({
  resource: z.boolean().optional(),
  inventoryTransaction: z.boolean().optional(),
});

const InventoryTransactionLineSortSchema = z.object({
  id: SortSchema.optional(),
  resourceId: SortSchema.optional(),
  inventoryTransactionId: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const InventoryTransactionLineFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: InventoryTransactionLineWhereSchema.optional(),
  sort: InventoryTransactionLineSortSchema.optional(),
  include: InventoryTransactionLineIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const InventoryTransactionLineFindUniqueSchema = z.object({
  include: InventoryTransactionLineIncludeSchema.optional(),
});

/** Create-body query schema*/
export const InventoryTransactionLineCreateBodySchema = z.object({
  data: z.object({
    qty: z.coerce.number().min(1),
    resourceId: z.coerce.number(),
    inventoryTransactionId: z.coerce.number(),
  }),
});

/** Update-body query schema*/
export const InventoryTransactionLineUpdateBodySchema = z.object({
  data: InventoryTransactionLineCreateBodySchema.shape.data.partial(),
});
