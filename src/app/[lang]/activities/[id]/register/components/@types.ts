import type { PlanModalityActivitySchoolChildCreateBodySchema } from '@/schemas/plan-modality-activity-school-child';
import type { Contract } from '@/server/api/contracts';
import type { ClientInferResponseBody } from '@ts-rest/core';
import type { z } from 'zod';

export type SchoolChildPaginated = ClientInferResponseBody<
  Contract['planModalityActivitySchoolChild']['findMany'],
  200
>;
export type SchoolChild = SchoolChildPaginated['data'][number];

export type SchoolActivityPaginated = ClientInferResponseBody<
  Contract['planModalityActivitySchool']['findMany'],
  200
>;
export type SchoolActivity = SchoolActivityPaginated['data'][number];

export type SchoolChildFormValues = Omit<
  z.infer<typeof PlanModalityActivitySchoolChildCreateBodySchema.shape.data>,
  ''
>;
