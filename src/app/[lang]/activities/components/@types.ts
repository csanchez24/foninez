import type { PlanModalityActivitySchoolResourceUpdateMassBodySchema } from '@/schemas/plan-modality-activity-school-resource';
import type { PlanModalityActivitySchoolProfessionalCreateBodySchema } from '@/schemas/plan-modality-activity-school-professional';
import type { PlanModalityActivitySchoolProofCreateBodySchema } from '@/schemas/plan-modality-activity-school-proof';
import type { Contract } from '@/server/api/contracts';
import type { ClientInferResponseBody } from '@ts-rest/core';
import type { z } from 'zod';
import type { PlanModalityActivitySchoolCreateBodySchema } from '@/schemas/plan-modality-activity-school';

export type ActivityPaginated = ClientInferResponseBody<
  Contract['planModalityActivitySchool']['findMany'],
  200
>;

export type Activity = ActivityPaginated['data'][number];

export type PlanModalityActivitySchoolFormValues = z.infer<
  typeof PlanModalityActivitySchoolCreateBodySchema.shape.data
>;

export type PlanModalityActivitySchoolProfessionalFormValues = z.infer<
  typeof PlanModalityActivitySchoolProfessionalCreateBodySchema.shape.data
>;

export type ActivitySchoolProfessionals = ClientInferResponseBody<
  Contract['planModalityActivitySchoolProfessional']['findMany'],
  200
>['data'];
export type ActivitySchoolProfessional = ActivitySchoolProfessionals[number];

export type ActivitySchoolResources = ClientInferResponseBody<
  Contract['planModalityActivitySchoolResource']['findMany'],
  200
>['data'];
export type ActivitySchoolResource = ActivitySchoolResources[number];

export type ActivitySchoolChildren = ClientInferResponseBody<
  Contract['planModalityActivitySchoolChild']['findMany'],
  200
>['data'];
export type ActivitySchoolChild = ActivitySchoolChildren[number];

export type ActivitySchoolProofs = ClientInferResponseBody<
  Contract['planModalityActivitySchoolProof']['findMany'],
  200
>['data'];
export type ActivitySchoolProof = ActivitySchoolProofs[number];

export type ActivitySchoolProofChildAttendances = ClientInferResponseBody<
  Contract['planModalityActivitySchoolProofChildAttendance']['findMany'],
  200
>['data'];
export type ActivitySchoolProofChildAttendance = ActivitySchoolProofChildAttendances[number];

export type ConfirmResourcesFormValues = z.infer<
  typeof PlanModalityActivitySchoolResourceUpdateMassBodySchema
>;

export type ActivityProofFormValues = z.infer<
  typeof PlanModalityActivitySchoolProofCreateBodySchema.shape.data
>;
