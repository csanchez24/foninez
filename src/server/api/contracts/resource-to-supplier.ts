import type { ResourceToSupplier } from '@/server/db/schema';
import type { PaginateReturn } from '@/server/utils/paginate';

import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import {
  ResourceToSupplierCreateBodySchema,
  ResourceToSupplierFindManyQuerySchema,
  ResourceToSupplierFindUniqueSchema,
  ResourceToSupplierUpdateBodySchema,
} from '@/schemas/resourceToSupplier';

const c = initContract();

export const resourceToSupplier = c.router(
  {
    findUnique: {
      method: 'GET',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      query: ResourceToSupplierFindUniqueSchema.optional(),
      responses: {
        200: c.type<ResourceToSupplier>(),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    findMany: {
      method: 'GET',
      path: `/`,
      query: ResourceToSupplierFindManyQuerySchema,
      responses: {
        200: c.type<PaginateReturn<ResourceToSupplier>>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    create: {
      method: 'POST',
      path: `/`,
      body: ResourceToSupplierCreateBodySchema,
      responses: {
        201: c.type<ResourceToSupplier>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    update: {
      method: 'PUT',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      body: ResourceToSupplierUpdateBodySchema,
      responses: {
        200: c.type<ResourceToSupplier>(),
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
        200: c.type<ResourceToSupplier>(),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
  },
  { pathPrefix: '/resources-to-suppliers' }
);
