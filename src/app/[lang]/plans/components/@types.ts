import type { PlanCreateBodySchema } from '@/schemas/plan';
import type { Contract } from '@/server/api/contracts';
import type { ClientInferResponseBody } from '@ts-rest/core';
import type { z } from 'zod';

export type PlanPaginated = ClientInferResponseBody<Contract['plan']['findMany'], 200>;

export type Plan = PlanPaginated['data'][number];

export type Program = NonNullable<PlanPaginated['data'][number]['program']>;

export type PlanFormValues = Omit<z.infer<typeof PlanCreateBodySchema.shape.data>, 'programId'> & {
  programId?: number;
};
