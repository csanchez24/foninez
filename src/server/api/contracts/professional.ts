import type { Professional } from '@/server/db/schema';
import type { PaginateReturn } from '@/server/utils/paginate';

import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import {
  ProfessionalCreateBodySchema,
  ProfessionalFindManyQuerySchema,
  ProfessionalFindUniqueSchema,
  ProfessionalUpdateBodySchema,
} from '@/schemas/professional';
import type { ReportProfessional } from '../types';

const c = initContract();

export const professional = c.router(
  {
    findUnique: {
      method: 'GET',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      query: ProfessionalFindUniqueSchema.optional(),
      responses: {
        200: c.type<Professional>(),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    findMany: {
      method: 'GET',
      path: `/`,
      query: ProfessionalFindManyQuerySchema,
      responses: {
        200: c.type<PaginateReturn<Professional>>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    create: {
      method: 'POST',
      path: `/`,
      body: ProfessionalCreateBodySchema,
      responses: {
        201: c.type<Professional>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    update: {
      method: 'PUT',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      body: ProfessionalUpdateBodySchema,
      responses: {
        200: c.type<Professional>(),
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
        200: c.type<Professional>(),
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
        200: c.type<ReportProfessional[]>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
  },
  { pathPrefix: '/professionals' }
);
