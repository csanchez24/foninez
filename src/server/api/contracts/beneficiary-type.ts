import type { BeneficiaryType } from '@/server/db/schema';
import type { PaginateReturn } from '@/server/utils/paginate';

import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import {
  BeneficiaryTypeCreateBodySchema,
  BeneficiaryTypeFindManyQuerySchema,
  BeneficiaryTypeFindUniqueSchema,
  BeneficiaryTypeUpdateBodySchema,
} from '@/schemas/beneficiary-type';

const c = initContract();

export const beneficiaryType = c.router(
  {
    findUnique: {
      method: 'GET',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      query: BeneficiaryTypeFindUniqueSchema.optional(),
      responses: {
        200: c.type<BeneficiaryType>(),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    findMany: {
      method: 'GET',
      path: `/`,
      query: BeneficiaryTypeFindManyQuerySchema,
      responses: {
        200: c.type<PaginateReturn<BeneficiaryType>>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    create: {
      method: 'POST',
      path: `/`,
      body: BeneficiaryTypeCreateBodySchema,
      responses: {
        201: c.type<BeneficiaryType>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    update: {
      method: 'PUT',
      path: `/:id`,
      pathParams: z.object({ id: z.coerce.number() }),
      body: BeneficiaryTypeUpdateBodySchema,
      responses: {
        200: c.type<BeneficiaryType>(),
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
        200: c.type<BeneficiaryType>(),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
  },
  { pathPrefix: '/beneficiary-types' }
);
