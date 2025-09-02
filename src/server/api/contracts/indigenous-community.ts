import type { IndigenousCommunity } from '@/server/db/schema';
import type { PaginateReturn } from '@/server/utils/paginate';

import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import {
  IndigenousCommunityCreateBodySchema,
  IndigenousCommunityFindManyQuerySchema,
  IndigenousCommunityFindUniqueSchema,
  IndigenousCommunityUpdateBodySchema,
} from '@/schemas/indigenous-community';

const c = initContract();

export const indigenousCommunity = c.router(
  {
    findUnique: {
      method: 'GET',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      query: IndigenousCommunityFindUniqueSchema.optional(),
      responses: {
        200: c.type<IndigenousCommunity>(),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    findMany: {
      method: 'GET',
      path: `/`,
      query: IndigenousCommunityFindManyQuerySchema,
      responses: {
        200: c.type<PaginateReturn<IndigenousCommunity>>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    create: {
      method: 'POST',
      path: `/`,
      body: IndigenousCommunityCreateBodySchema,
      responses: {
        201: c.type<IndigenousCommunity>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    update: {
      method: 'PUT',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      body: IndigenousCommunityUpdateBodySchema,
      responses: {
        200: c.type<IndigenousCommunity>(),
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
        200: c.type<IndigenousCommunity>(),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
  },
  { pathPrefix: '/indigenous-communities' }
);
