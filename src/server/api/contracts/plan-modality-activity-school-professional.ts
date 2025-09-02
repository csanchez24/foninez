import type { PlanModalityActivitySchoolProfessional } from '@/server/db/schema';
import type { PaginateReturn } from '@/server/utils/paginate';

import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import {
  PlanModalityActivitySchoolProfessionalCreateBodySchema,
  PlanModalityActivitySchoolProfessionalFindManyQuerySchema,
  PlanModalityActivitySchoolProfessionalFindUniqueSchema,
  PlanModalityActivitySchoolProfessionalUpdateBodySchema,
} from '@/schemas/plan-modality-activity-school-professional';

const c = initContract();

export const planModalityActivitySchoolProfessional = c.router(
  {
    findUnique: {
      method: 'GET',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      query: PlanModalityActivitySchoolProfessionalFindUniqueSchema.optional(),
      responses: {
        200: c.type<PlanModalityActivitySchoolProfessional>(),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    findMany: {
      method: 'GET',
      path: `/`,
      query: PlanModalityActivitySchoolProfessionalFindManyQuerySchema,
      responses: {
        200: c.type<PaginateReturn<PlanModalityActivitySchoolProfessional>>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    create: {
      method: 'POST',
      path: `/`,
      body: PlanModalityActivitySchoolProfessionalCreateBodySchema,
      responses: {
        201: c.type<PlanModalityActivitySchoolProfessional>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    update: {
      method: 'PUT',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      body: PlanModalityActivitySchoolProfessionalUpdateBodySchema,
      responses: {
        200: c.type<PlanModalityActivitySchoolProfessional>(),
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
        200: c.type<PlanModalityActivitySchoolProfessional>(),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
  },
  { pathPrefix: '/plan-modality-activity-school-professionals' }
);
