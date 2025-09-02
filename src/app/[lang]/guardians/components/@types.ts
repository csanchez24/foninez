import type { GuardianCreateBodySchema } from '@/schemas/guardian';
import type { Contract } from '@/server/api/contracts';
import type { ClientInferResponseBody } from '@ts-rest/core';
import type { z } from 'zod';

export type GuardianPaginated = ClientInferResponseBody<Contract['guardian']['findMany'], 200>;

export type Guardian = GuardianPaginated['data'][number];

export type GuardianFormValues = Omit<
  z.infer<typeof GuardianCreateBodySchema.shape.data>,
  'identificationId'
> & { identificationId?: number };

export type Children = ClientInferResponseBody<Contract['child']['findMany'], 200>['data'];
export type Child = Children[number];
