import type { PlanModalityActivitySchoolProofFile } from '@/server/db/schema';
import type { PaginateReturn } from '@/server/utils/paginate';

import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import {
  PlanModalityActivitySchoolProofFileCreateBodySchema,
  PlanModalityActivitySchoolProofFileFindManyQuerySchema,
  PlanModalityActivitySchoolProofFileFindUniqueSchema,
  PlanModalityActivitySchoolProofFileUpdateBodySchema,
} from '@/schemas/plan-modality-activity-school-proof-file';

const c = initContract();

export const planModalityActivitySchoolProofFile = c.router(
  {
    findUnique: {
      method: 'GET',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      query: PlanModalityActivitySchoolProofFileFindUniqueSchema.optional(),
      responses: {
        200: c.type<PlanModalityActivitySchoolProofFile>(),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    findMany: {
      method: 'GET',
      path: `/`,
      query: PlanModalityActivitySchoolProofFileFindManyQuerySchema,
      responses: {
        200: c.type<PaginateReturn<PlanModalityActivitySchoolProofFile>>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    create: {
      method: 'POST',
      path: `/`,
      body: PlanModalityActivitySchoolProofFileCreateBodySchema,
      responses: {
        201: c.type<PlanModalityActivitySchoolProofFile>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    update: {
      method: 'PUT',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      body: PlanModalityActivitySchoolProofFileUpdateBodySchema,
      responses: {
        200: c.type<PlanModalityActivitySchoolProofFile>(),
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
        200: c.type<PlanModalityActivitySchoolProofFile>(),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
  },
  { pathPrefix: '/plan-modality-activity-school-proof-files' }
);
