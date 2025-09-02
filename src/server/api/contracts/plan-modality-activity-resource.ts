import type { PlanModalityActivityResource } from '@/server/db/schema';
import type { PaginateReturn } from '@/server/utils/paginate';

import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import {
  PlanModalityActivityResourceCreateBodySchema,
  PlanModalityActivityResourceFindManyQuerySchema,
  PlanModalityActivityResourceFindUniqueSchema,
  PlanModalityActivityResourceUpdateBodySchema,
} from '@/schemas/plan-modality-activity-resource';

const c = initContract();

export const planModalityActivityResource = c.router(
  {
    findUnique: {
      method: 'GET',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      query: PlanModalityActivityResourceFindUniqueSchema.optional(),
      responses: {
        200: c.type<PlanModalityActivityResource>(),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    findMany: {
      method: 'GET',
      path: `/`,
      query: PlanModalityActivityResourceFindManyQuerySchema,
      responses: {
        200: c.type<PaginateReturn<PlanModalityActivityResource>>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    create: {
      method: 'POST',
      path: `/`,
      body: PlanModalityActivityResourceCreateBodySchema,
      responses: {
        201: c.type<PlanModalityActivityResource>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    update: {
      method: 'PUT',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      body: PlanModalityActivityResourceUpdateBodySchema,
      responses: {
        200: c.type<PlanModalityActivityResource>(),
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
        200: c.type<PlanModalityActivityResource>(),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
  },
  { pathPrefix: '/plan-modality-activity-resources' }
);
