import type { ProfessionalCreateBodySchema } from '@/schemas/professional';
import type { Contract } from '@/server/api/contracts';
import type { ClientInferResponseBody } from '@ts-rest/core';
import type { z } from 'zod';

export type ProfessionalPaginated = ClientInferResponseBody<
  Contract['professional']['findMany'],
  200
>;

export type Professional = ProfessionalPaginated['data'][number];

export type ProfessionalFormValues = z.infer<typeof ProfessionalCreateBodySchema.shape.data>;

export type Activities = ClientInferResponseBody<
  Contract['planModalityActivitySchoolProfessional']['findMany'],
  200
>['data'];
export type Activity = Activities[number];
