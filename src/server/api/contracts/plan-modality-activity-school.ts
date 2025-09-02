import type { PlanModalityActivitySchool } from '@/server/db/schema';
import type { PaginateReturn } from '@/server/utils/paginate';

import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import {
  PlanModalityActivitySchoolCreateBodySchema,
  PlanModalityActivitySchoolFindManyQuerySchema,
  PlanModalityActivitySchoolFindUniqueSchema,
  PlanModalityActivitySchoolUpdateBodySchema,
} from '@/schemas/plan-modality-activity-school';
import type { ReportActivities } from '../types';

const c = initContract();

export const planModalityActivitySchool = c.router(
  {
    professionals: {
      method: 'GET',
      path: `/professional/:professionalId`,
      pathParams: z.object({ professionalId: z.coerce.number() }),
      responses: {
        200: c.type<PaginateReturn<PlanModalityActivitySchool>>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    findUnique: {
      method: 'GET',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      query: PlanModalityActivitySchoolFindUniqueSchema.optional(),
      responses: {
        200: c.type<PlanModalityActivitySchool>(),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    findMany: {
      method: 'GET',
      path: `/`,
      query: PlanModalityActivitySchoolFindManyQuerySchema,
      responses: {
        200: c.type<PaginateReturn<PlanModalityActivitySchool>>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    create: {
      method: 'POST',
      path: `/`,
      body: PlanModalityActivitySchoolCreateBodySchema,
      responses: {
        201: c.type<PlanModalityActivitySchool>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    update: {
      method: 'PUT',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      body: PlanModalityActivitySchoolUpdateBodySchema,
      responses: {
        200: c.type<PlanModalityActivitySchool>(),
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
        200: c.type<PlanModalityActivitySchool>(),
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
        200: c.type<ReportActivities[]>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
  },
  { pathPrefix: '/plan-modality-activity-schools' }
);
