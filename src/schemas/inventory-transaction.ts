import { z } from 'zod';

import {
  NumberOperatorsSchema,
  SortSchema,
  StringOperatorsSchema,
} from '@/server/utils/query/schemas';
import { InventoryTransactionLineCreateBodySchema } from './inventory-transaction-line';
import { ResourceUpdateBodySchema } from './resource';

const InventoryTransactionWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  note: z.union([z.string(), StringOperatorsSchema]).optional(),
  supplierInvoiceNumber: z.union([z.string(), StringOperatorsSchema]).optional(),
  orderNumber: z.union([z.string(), StringOperatorsSchema]).optional(),
  type: z
    .union([
      z.union([
        z.literal('stock'),
        z.literal('restock'),
        z.literal('consume'),
        z.literal('adjustment'),
      ]),
      StringOperatorsSchema,
    ])
    .optional(),
  status: z
    .union([
      z.union([z.literal('pending'), z.literal('confirmed'), z.literal('rejected')]),
      StringOperatorsSchema,
    ])
    .optional(),
});

type InventoryTransactionWhereSchemaType = z.infer<typeof InventoryTransactionWhereBaseSchema> & {
  _and?: InventoryTransactionWhereSchemaType[];
  _or?: InventoryTransactionWhereSchemaType[];
  _not?: InventoryTransactionWhereSchemaType[];
};

const InventoryTransactionWhereSchema: z.ZodType<InventoryTransactionWhereSchemaType> =
  InventoryTransactionWhereBaseSchema.extend({
    _and: z.lazy(() => InventoryTransactionWhereSchema.array().optional()),
    _or: z.lazy(() => InventoryTransactionWhereSchema.array().optional()),
    _not: z.lazy(() => InventoryTransactionWhereSchema.array().optional()),
  });

const InventoryTransactionIncludeSchema = z.object({
  planModalityActivitySchool: z
    .object({
      with: z.object({
        planModalityActivity: z.boolean(),
        school: z.boolean(),
      }),
    })
    .optional(),
  inventoryTransactionLines: z
    .object({
      with: z.object({
        resource: z.boolean(),
      }),
    })
    .optional(),
});

const InventoryTransactionSortSchema = z.object({
  id: SortSchema.optional(),
  type: SortSchema.optional(),
  supplierInvoiceNumber: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const InventoryTransactionFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: InventoryTransactionWhereSchema.optional(),
  sort: InventoryTransactionSortSchema.optional(),
  include: InventoryTransactionIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const InventoryTransactionFindUniqueSchema = z.object({
  include: InventoryTransactionIncludeSchema.optional(),
});

/** Create-body query schema*/
export const InventoryTransactionCreateBodySchema = z.object({
  data: z.object({
    note: z.string(),
    rejectionNote: z.string().optional(),
    approveNote: z.string().optional(),
    planModalityActivitySchoolId: z.number().optional(),
    supplierInvoiceNumber: z.string(),
    orderNumber: z.string(),
    type: z.union([
      z.literal('stock'),
      z.literal('restock'),
      z.literal('consume'),
      z.literal('adjustment'),
    ]),
    status: z.union([z.literal('pending'), z.literal('confirmed'), z.literal('rejected')]),
    inventoryTransactionLines: z
      .lazy(() =>
        InventoryTransactionLineCreateBodySchema.shape.data
          .omit({ inventoryTransactionId: true, resourceId: true })
          .extend({
            resource: z.lazy(() =>
              ResourceUpdateBodySchema.shape.data
                .omit({ resourcesToSuppliers: true })
                .extend({ id: z.number() })
            ),
          })
          .array()
      )
      .optional(),
  }),
});

/** Update-body query schema*/
export const InventoryTransactionUpdateBodySchema = z.object({
  data: InventoryTransactionCreateBodySchema.shape.data.partial(),
  options: z
    .object({
      updateStatuses: z.boolean().optional(),
    })
    .optional(),
});
