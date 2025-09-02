import type { PlanModalityActivitySchoolProof } from '@/server/db/schema';
import type { PaginateReturn } from '@/server/utils/paginate';

import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import {
  type PlanModalityActivitySchoolProofCreateBodySchema,
  PlanModalityActivitySchoolProofFindManyQuerySchema,
  PlanModalityActivitySchoolProofFindUniqueSchema,
  PlanModalityActivitySchoolProofUpdateBodySchema,
} from '@/schemas/plan-modality-activity-school-proof';

const c = initContract();

export const planModalityActivitySchoolProof = c.router(
  {
    findUnique: {
      method: 'GET',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      query: PlanModalityActivitySchoolProofFindUniqueSchema.optional(),
      responses: {
        200: c.type<PlanModalityActivitySchoolProof>(),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    findMany: {
      method: 'GET',
      path: `/`,
      query: PlanModalityActivitySchoolProofFindManyQuerySchema,
      responses: {
        200: c.type<PaginateReturn<PlanModalityActivitySchoolProof>>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    create: {
      method: 'POST',
      path: `/`,
      contentType: 'multipart/form-data',
      //body: PlanModalityActivitySchoolProofCreateBodySchema,
      body: c.type<z.infer<typeof PlanModalityActivitySchoolProofCreateBodySchema.shape.data>>(),
      responses: {
        201: c.type<PlanModalityActivitySchoolProof>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    update: {
      method: 'PUT',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      body: PlanModalityActivitySchoolProofUpdateBodySchema,
      responses: {
        200: c.type<PlanModalityActivitySchoolProof>(),
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
        200: c.type<PlanModalityActivitySchoolProof>(),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
  },
  { pathPrefix: '/plan-modality-activity-school-proofs' }
);
