import type { SchoolCreateBodySchema } from '@/schemas/school';
import type { Contract } from '@/server/api/contracts';
import type { ClientInferResponseBody } from '@ts-rest/core';
import type { z } from 'zod';

export type SchoolPaginated = ClientInferResponseBody<Contract['school']['findMany'], 200>;

export type School = SchoolPaginated['data'][number];

export type Activities = ClientInferResponseBody<
  Contract['planModalityActivitySchool']['findMany'],
  200
>['data'];
export type Activity = Activities[number];

export type SchoolFormValues = Omit<z.infer<typeof SchoolCreateBodySchema.shape.data>, 'cityId'> & {
  cityId?: number;
};
