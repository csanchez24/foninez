import type { Child } from '@/server/db/schema';
import type { PaginateReturn } from '@/server/utils/paginate';

import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import {
  ChildCreateBodySchema,
  ChildFindManyQuerySchema,
  ChildFindUniqueSchema,
  ChildUpdateBodySchema,
} from '@/schemas/child';
import type { ReportChildren } from '../types';

const c = initContract();

export const child = c.router(
  {
    findUnique: {
      method: 'GET',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      query: ChildFindUniqueSchema.optional(),
      responses: {
        200: c.type<Child>(),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    findMany: {
      method: 'GET',
      path: `/`,
      query: ChildFindManyQuerySchema,
      responses: {
        200: c.type<PaginateReturn<Child>>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    create: {
      method: 'POST',
      path: `/`,
      body: ChildCreateBodySchema,
      responses: {
        201: c.type<Child>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    update: {
      method: 'PUT',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      body: ChildUpdateBodySchema,
      responses: {
        200: c.type<Child>(),
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
        200: c.type<Child>(),
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
        200: c.type<ReportChildren[]>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
  },
  { pathPrefix: '/children' }
);
