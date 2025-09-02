import type { ChildCreateBodySchema } from '@/schemas/child';
import type { Contract } from '@/server/api/contracts';
import type { ClientInferResponseBody } from '@ts-rest/core';
import type { z } from 'zod';

export type ChildPaginated = ClientInferResponseBody<Contract['child']['findMany'], 200>;

export type Child = ChildPaginated['data'][number];

export type ChildFormValues = Omit<
  z.infer<typeof ChildCreateBodySchema.shape.data>,
  'guardianId' | 'identificationId'
> & { guardianId?: number; identificationId?: number };

export type Activities = ClientInferResponseBody<
  Contract['planModalityActivitySchoolChild']['findMany'],
  200
>['data'];
export type Activity = Activities[number];
