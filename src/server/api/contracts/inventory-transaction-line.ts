import type { InventoryTransactionLine } from '@/server/db/schema';
import type { PaginateReturn } from '@/server/utils/paginate';

import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import {
  InventoryTransactionLineCreateBodySchema,
  InventoryTransactionLineFindManyQuerySchema,
  InventoryTransactionLineFindUniqueSchema,
  InventoryTransactionLineUpdateBodySchema,
} from '@/schemas/inventory-transaction-line';

const c = initContract();

export const inventoryTransactionLine = c.router(
  {
    findUnique: {
      method: 'GET',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      query: InventoryTransactionLineFindUniqueSchema.optional(),
      responses: {
        200: c.type<InventoryTransactionLine>(),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    findMany: {
      method: 'GET',
      path: `/`,
      query: InventoryTransactionLineFindManyQuerySchema,
      responses: {
        200: c.type<PaginateReturn<InventoryTransactionLine>>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    create: {
      method: 'POST',
      path: `/`,
      body: InventoryTransactionLineCreateBodySchema,
      responses: {
        201: c.type<InventoryTransactionLine>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    update: {
      method: 'PUT',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      body: InventoryTransactionLineUpdateBodySchema,
      responses: {
        200: c.type<InventoryTransactionLine>(),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    delete: {
      method: 'DELETE',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      body: null,
      responses: {
        200: c.type<InventoryTransactionLine>(),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
  },
  { pathPrefix: '/inventory-transaction-lines' }
);
