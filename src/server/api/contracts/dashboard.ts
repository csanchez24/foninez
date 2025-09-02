import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import type { DashboardResponse } from '../types';

const c = initContract();

export const dashboard = c.router(
  {
    dashboard: {
      method: 'GET',
      path: `/:year`,
      pathParams: z.object({ year: z.coerce.number() }),
      responses: {
        200: c.type<DashboardResponse>(),
        400: c.type<{ message: string }>(),
        404: c.type<{ message: string }>(),
        500: c.type<{ message: string }>(),
      },
    },
  },
  { pathPrefix: '/dashboards' }
);
