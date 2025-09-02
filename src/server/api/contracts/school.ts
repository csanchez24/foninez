import type { School } from '@/server/db/schema';
import type { PaginateReturn } from '@/server/utils/paginate';

import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import {
  SchoolCreateBodySchema,
  SchoolFindManyQuerySchema,
  SchoolFindUniqueSchema,
  SchoolUpdateBodySchema,
} from '@/schemas/school';
import type { ReportSchool } from '../types';

const c = initContract();

export const school = c.router(
  {
    findUnique: {
      method: 'GET',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      query: SchoolFindUniqueSchema.optional(),
      responses: {
        200: c.type<School>(),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    findMany: {
      method: 'GET',
      path: `/`,
      query: SchoolFindManyQuerySchema,
      responses: {
        200: c.type<PaginateReturn<School>>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    create: {
      method: 'POST',
      path: `/`,
      body: SchoolCreateBodySchema,
      responses: {
        201: c.type<School>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    update: {
      method: 'PUT',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      body: SchoolUpdateBodySchema,
      responses: {
        200: c.type<School>(),
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
        200: c.type<School>(),
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
        200: c.type<ReportSchool[]>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
  },
  { pathPrefix: '/schools' }
);
