import type { IndigenousReserve } from '@/server/db/schema';
import type { PaginateReturn } from '@/server/utils/paginate';

import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import {
  IndigenousReserveCreateBodySchema,
  IndigenousReserveFindManyQuerySchema,
  IndigenousReserveFindUniqueSchema,
  IndigenousReserveUpdateBodySchema,
} from '@/schemas/indigenous-reserve';

const c = initContract();

export const indigenousReserve = c.router(
  {
    findUnique: {
      method: 'GET',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      query: IndigenousReserveFindUniqueSchema.optional(),
      responses: {
        200: c.type<IndigenousReserve>(),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    findMany: {
      method: 'GET',
      path: `/`,
      query: IndigenousReserveFindManyQuerySchema,
      responses: {
        200: c.type<PaginateReturn<IndigenousReserve>>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    create: {
      method: 'POST',
      path: `/`,
      body: IndigenousReserveCreateBodySchema,
      responses: {
        201: c.type<IndigenousReserve>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    update: {
      method: 'PUT',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      body: IndigenousReserveUpdateBodySchema,
      responses: {
        200: c.type<IndigenousReserve>(),
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
        200: c.type<IndigenousReserve>(),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
  },
  { pathPrefix: '/indigenous-reserves' }
);
