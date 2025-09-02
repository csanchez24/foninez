import type { PlanModalityActivitySchoolChild } from '@/server/db/schema';
import type { PaginateReturn } from '@/server/utils/paginate';

import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import {
  PlanModalityActivitySchoolChildCreateBodySchema,
  PlanModalityActivitySchoolChildFindManyQuerySchema,
  PlanModalityActivitySchoolChildFindUniqueSchema,
  PlanModalityActivitySchoolChildUpdateBodySchema,
} from '@/schemas/plan-modality-activity-school-child';

const c = initContract();

export const planModalityActivitySchoolChild = c.router(
  {
    findUnique: {
      method: 'GET',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      query: PlanModalityActivitySchoolChildFindUniqueSchema.optional(),
      responses: {
        200: c.type<PlanModalityActivitySchoolChild>(),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    findMany: {
      method: 'GET',
      path: `/`,
      query: PlanModalityActivitySchoolChildFindManyQuerySchema,
      responses: {
        200: c.type<PaginateReturn<PlanModalityActivitySchoolChild>>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    create: {
      method: 'POST',
      path: `/`,
      body: PlanModalityActivitySchoolChildCreateBodySchema,
      responses: {
        201: c.type<PlanModalityActivitySchoolChild>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    sync: {
      method: 'POST',
      path: `/sync`,
      body: z.array(PlanModalityActivitySchoolChildCreateBodySchema.shape.data),
      responses: {
        200: c.type<null>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    resync: {
      method: 'POST',
      path: `/resync/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      body: null,
      responses: {
        200: c.type<null>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    update: {
      method: 'PUT',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      body: PlanModalityActivitySchoolChildUpdateBodySchema,
      responses: {
        200: c.type<PlanModalityActivitySchoolChild>(),
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
        200: c.type<PlanModalityActivitySchoolChild>(),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
  },
  { pathPrefix: '/plan-modality-activity-school-children' }
);
