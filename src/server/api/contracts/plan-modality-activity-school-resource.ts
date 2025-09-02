import type { PlanModalityActivitySchoolResource } from '@/server/db/schema';
import type { PaginateReturn } from '@/server/utils/paginate';

import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import {
  PlanModalityActivitySchoolResourceCreateBodySchema,
  PlanModalityActivitySchoolResourceFindManyQuerySchema,
  PlanModalityActivitySchoolResourceFindUniqueSchema,
  PlanModalityActivitySchoolResourceUpdateBodySchema,
  PlanModalityActivitySchoolResourceUpdateMassBodySchema,
} from '@/schemas/plan-modality-activity-school-resource';

const c = initContract();

export const planModalityActivitySchoolResource = c.router(
  {
    findUnique: {
      method: 'GET',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      query: PlanModalityActivitySchoolResourceFindUniqueSchema.optional(),
      responses: {
        200: c.type<PlanModalityActivitySchoolResource>(),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    findMany: {
      method: 'GET',
      path: `/`,
      query: PlanModalityActivitySchoolResourceFindManyQuerySchema,
      responses: {
        200: c.type<PaginateReturn<PlanModalityActivitySchoolResource>>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    create: {
      method: 'POST',
      path: `/`,
      body: PlanModalityActivitySchoolResourceCreateBodySchema,
      responses: {
        201: c.type<PlanModalityActivitySchoolResource>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    updateMass: {
      method: 'POST',
      path: `/updateMass`,
      body: PlanModalityActivitySchoolResourceUpdateMassBodySchema,
      responses: {
        200: c.type<null>(),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    update: {
      method: 'PUT',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      body: PlanModalityActivitySchoolResourceUpdateBodySchema,
      responses: {
        200: c.type<PlanModalityActivitySchoolResource>(),
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
        200: c.type<PlanModalityActivitySchoolResource>(),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
  },
  { pathPrefix: '/plan-modality-activity-school-resources' }
);
