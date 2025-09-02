import type { PlanUpdateStatusBodySchema } from '@/schemas/plan';
import type { PlanModalityActivityCreateBodySchema } from '@/schemas/plan-modality-activity';
import type { ProofFileClassificationCreateBodySchema } from '@/schemas/proof-file-classification';
import type { Contract } from '@/server/api/contracts';
import type { ClientInferResponseBody } from '@ts-rest/core';
import type { z } from 'zod';

export type PlanPaginated = ClientInferResponseBody<Contract['plan']['findMany'], 200>;

export type Plan = PlanPaginated['data'][number];

export type PlanModalityActivityPaginated = ClientInferResponseBody<
  Contract['planModalityActivity']['findMany'],
  200
>;

export type PlanModalityActivity = PlanModalityActivityPaginated['data'][number];

export type PlanModalityActivityFormValues = Omit<
  z.infer<typeof PlanModalityActivityCreateBodySchema.shape.data>,
  'planModalityId' | 'planId'
> & {
  planModalityId?: number;
  planId?: number;
};

export type PlanUpdateStatusFormValues = z.infer<typeof PlanUpdateStatusBodySchema.shape.data>;

export type ProofFileClassificationFormValues = z.infer<
  typeof ProofFileClassificationCreateBodySchema.shape.data
>;
