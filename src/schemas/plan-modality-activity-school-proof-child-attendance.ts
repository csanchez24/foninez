import { z } from 'zod';

import {
  BooleanOperatorsSchema,
  NumberOperatorsSchema,
  SortSchema,
} from '@/server/utils/query/schemas';

const PlanModalityActivitySchoolProofChildAttendanceWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  planModalityActivitySchoolProofId: z.union([z.number(), NumberOperatorsSchema]).optional(),
  planModalityActivitySchoolChildId: z.union([z.number(), NumberOperatorsSchema]).optional(),
  attended: z.union([z.boolean(), BooleanOperatorsSchema]).optional(),
});

type PlanModalityActivitySchoolProofChildAttendanceWhereSchemaType = z.infer<
  typeof PlanModalityActivitySchoolProofChildAttendanceWhereBaseSchema
> & {
  _and?: PlanModalityActivitySchoolProofChildAttendanceWhereSchemaType[];
  _or?: PlanModalityActivitySchoolProofChildAttendanceWhereSchemaType[];
  _not?: PlanModalityActivitySchoolProofChildAttendanceWhereSchemaType[];
};

const PlanModalityActivitySchoolProofChildAttendanceWhereSchema: z.ZodType<PlanModalityActivitySchoolProofChildAttendanceWhereSchemaType> =
  PlanModalityActivitySchoolProofChildAttendanceWhereBaseSchema.extend({
    _and: z.lazy(() =>
      PlanModalityActivitySchoolProofChildAttendanceWhereSchema.array().optional()
    ),
    _or: z.lazy(() => PlanModalityActivitySchoolProofChildAttendanceWhereSchema.array().optional()),
    _not: z.lazy(() =>
      PlanModalityActivitySchoolProofChildAttendanceWhereSchema.array().optional()
    ),
  });

const PlanModalityActivitySchoolProofChildAttendanceIncludeSchema = z.object({
  planModalityActivitySchoolProof: z.boolean().optional(),
  planModalityActivitySchoolChild: z.boolean().optional(),
});

const PlanModalityActivitySchoolProofChildAttendanceSortSchema = z.object({
  id: SortSchema.optional(),
  planModalityActivitySchoolProofId: SortSchema.optional(),
  planModalityActivitySchoolChildId: SortSchema.optional(),
  attended: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const PlanModalityActivitySchoolProofChildAttendanceFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: PlanModalityActivitySchoolProofChildAttendanceWhereSchema.optional(),
  sort: PlanModalityActivitySchoolProofChildAttendanceSortSchema.optional(),
  include: PlanModalityActivitySchoolProofChildAttendanceIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const PlanModalityActivitySchoolProofChildAttendanceFindUniqueSchema = z.object({
  include: PlanModalityActivitySchoolProofChildAttendanceIncludeSchema.optional(),
});

/** Create-body query schema*/
export const PlanModalityActivitySchoolProofChildAttendanceCreateBodySchema = z.object({
  data: z.object({
    planModalityActivitySchoolProofId: z.coerce.number(),
    planModalityActivitySchoolChildId: z.coerce.number(),
    attended: z.boolean(),
  }),
});

/** Update-body query schema*/
export const PlanModalityActivitySchoolProofChildAttendanceUpdateBodySchema = z.object({
  data: PlanModalityActivitySchoolProofChildAttendanceCreateBodySchema.shape.data.partial(),
});
