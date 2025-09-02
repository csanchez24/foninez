import type { ProofFileClassification } from '@/server/db/schema';
import type { PaginateReturn } from '@/server/utils/paginate';

import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import {
  ProofFileClassificationCreateBodySchema,
  ProofFileClassificationFindManyQuerySchema,
  ProofFileClassificationFindUniqueSchema,
  ProofFileClassificationUpdateBodySchema,
} from '@/schemas/proof-file-classification';

const c = initContract();

export const proofFileClassification = c.router(
  {
    findUnique: {
      method: 'GET',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      query: ProofFileClassificationFindUniqueSchema.optional(),
      responses: {
        200: c.type<ProofFileClassification>(),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    findMany: {
      method: 'GET',
      path: `/`,
      query: ProofFileClassificationFindManyQuerySchema,
      responses: {
        200: c.type<PaginateReturn<ProofFileClassification>>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    create: {
      method: 'POST',
      path: `/`,
      body: ProofFileClassificationCreateBodySchema,
      responses: {
        201: c.type<ProofFileClassification>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    update: {
      method: 'PUT',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      body: ProofFileClassificationUpdateBodySchema,
      responses: {
        200: c.type<ProofFileClassification>(),
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
        200: c.type<ProofFileClassification>(),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
  },
  { pathPrefix: '/proof-file-classifications' }
);
