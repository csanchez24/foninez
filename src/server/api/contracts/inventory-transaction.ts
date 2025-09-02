import type { InventoryTransaction } from '@/server/db/schema';
import type { PaginateReturn } from '@/server/utils/paginate';

import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import {
  InventoryTransactionCreateBodySchema,
  InventoryTransactionFindManyQuerySchema,
  InventoryTransactionFindUniqueSchema,
  InventoryTransactionUpdateBodySchema,
} from '@/schemas/inventory-transaction';
import type { ReportInventoryTransaction } from '../types';

const c = initContract();

export const inventoryTransaction = c.router(
  {
    findUnique: {
      method: 'GET',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      query: InventoryTransactionFindUniqueSchema.optional(),
      responses: {
        200: c.type<InventoryTransaction>(),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    findMany: {
      method: 'GET',
      path: `/`,
      query: InventoryTransactionFindManyQuerySchema,
      responses: {
        200: c.type<PaginateReturn<InventoryTransaction>>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    create: {
      method: 'POST',
      path: `/`,
      body: InventoryTransactionCreateBodySchema,
      responses: {
        201: c.type<InventoryTransaction>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    update: {
      method: 'PUT',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      body: InventoryTransactionUpdateBodySchema,
      responses: {
        200: c.type<InventoryTransaction>(),
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
        200: c.type<InventoryTransaction>(),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    report: {
      method: 'POST',
      path: `/report`,
      body: z.object({ startDate: z.coerce.date(), endDate: z.coerce.date() }),
      responses: {
        200: c.type<ReportInventoryTransaction[]>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
  },
  { pathPrefix: '/inventory-transactions' }
);
