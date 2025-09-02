import { z } from 'zod';

import { NumberOperatorsSchema, SortSchema } from '@/server/utils/query/schemas';
import { PlanModalityActivitySchoolProofChildAttendanceCreateBodySchema } from './plan-modality-activity-school-proof-child-attendance';

const PlanModalityActivitySchoolProofWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  planModalityActivitySchoolId: z.union([z.number(), NumberOperatorsSchema]).optional(),
});

type PlanModalityActivitySchoolProofWhereSchemaType = z.infer<
  typeof PlanModalityActivitySchoolProofWhereBaseSchema
> & {
  _and?: PlanModalityActivitySchoolProofWhereSchemaType[];
  _or?: PlanModalityActivitySchoolProofWhereSchemaType[];
  _not?: PlanModalityActivitySchoolProofWhereSchemaType[];
};

const PlanModalityActivitySchoolProofWhereSchema: z.ZodType<PlanModalityActivitySchoolProofWhereSchemaType> =
  PlanModalityActivitySchoolProofWhereBaseSchema.extend({
    _and: z.lazy(() => PlanModalityActivitySchoolProofWhereSchema.array().optional()),
    _or: z.lazy(() => PlanModalityActivitySchoolProofWhereSchema.array().optional()),
    _not: z.lazy(() => PlanModalityActivitySchoolProofWhereSchema.array().optional()),
  });

const PlanModalityActivitySchoolProofIncludeSchema = z.object({
  planModalityActivitySchool: z.boolean().optional(),
  planModalityActivitySchoolProofFiles: z.boolean().optional(),
  planModalityActivitySchoolProofChildrenAttendances: z.boolean().optional(),
});

const PlanModalityActivitySchoolProofSortSchema = z.object({
  id: SortSchema.optional(),
  planModalityActivitySchoolId: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const PlanModalityActivitySchoolProofFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: PlanModalityActivitySchoolProofWhereSchema.optional(),
  sort: PlanModalityActivitySchoolProofSortSchema.optional(),
  include: PlanModalityActivitySchoolProofIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const PlanModalityActivitySchoolProofFindUniqueSchema = z.object({
  include: PlanModalityActivitySchoolProofIncludeSchema.optional(),
});

/** Create-body query schema*/
export const PlanModalityActivitySchoolProofCreateBodySchema = z.object({
  data: z.object({
    planModalityActivitySchoolId: z.coerce.number(),
    note: z.string().min(1),
    planModalityActivitySchoolProofChildAttendance: z
      .lazy(() =>
        PlanModalityActivitySchoolProofChildAttendanceCreateBodySchema.shape.data
          .omit({ planModalityActivitySchoolProofId: true })
          .extend({
            name: z.string(),
            planModalityActivitySchoolProofResourcesId: z.array(z.number()).optional(),
          })
          .array()
      )
      .optional(),
    planModalityActivitySchoolProofFilesId: z.array(z.number()).optional(),
    planModalityActivitySchoolProofFiles: z.array(z.instanceof(File)).optional(),
  }),
});

/** Update-body query schema*/
export const PlanModalityActivitySchoolProofUpdateBodySchema = z.object({
  data: PlanModalityActivitySchoolProofCreateBodySchema.shape.data.partial(),
});
