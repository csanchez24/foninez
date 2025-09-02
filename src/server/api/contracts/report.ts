import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import type { ReportCoverage, ReportMicrodato, ReportProgramResources } from '../types';

const c = initContract();

export const report = c.router(
  {
    coverage: {
      method: 'GET',
      path: `/coverage`,
      query: z.object({ year: z.coerce.number(), programId: z.coerce.number() }),
      responses: {
        200: c.type<ReportCoverage[]>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    microdato: {
      method: 'GET',
      path: `/microdato`,
      query: z.object({ year: z.coerce.number(), programId: z.coerce.number() }),
      responses: {
        200: c.type<ReportMicrodato[]>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
    resources: {
      method: 'GET',
      path: `/resources`,
      query: z.object({ year: z.coerce.number(), programId: z.coerce.number() }),
      responses: {
        200: c.type<ReportProgramResources[]>(),
        400: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
  },
  { pathPrefix: '/reports' }
);
