import { z } from 'zod';

import { NumberOperatorsSchema, SortSchema } from '@/server/utils/query/schemas';

const PlanModalityActivitySchoolProfessionalWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  planModalityActivitySchoolId: z.union([z.number(), NumberOperatorsSchema]).optional(),
  professionalId: z.union([z.number(), NumberOperatorsSchema]).optional(),
});

type PlanModalityActivitySchoolProfessionalWhereSchemaType = z.infer<
  typeof PlanModalityActivitySchoolProfessionalWhereBaseSchema
> & {
  _and?: PlanModalityActivitySchoolProfessionalWhereSchemaType[];
  _or?: PlanModalityActivitySchoolProfessionalWhereSchemaType[];
  _not?: PlanModalityActivitySchoolProfessionalWhereSchemaType[];
};

const PlanModalityActivitySchoolProfessionalWhereSchema: z.ZodType<PlanModalityActivitySchoolProfessionalWhereSchemaType> =
  PlanModalityActivitySchoolProfessionalWhereBaseSchema.extend({
    _and: z.lazy(() => PlanModalityActivitySchoolProfessionalWhereSchema.array().optional()),
    _or: z.lazy(() => PlanModalityActivitySchoolProfessionalWhereSchema.array().optional()),
    _not: z.lazy(() => PlanModalityActivitySchoolProfessionalWhereSchema.array().optional()),
  });

const PlanModalityActivitySchoolProfessionalIncludeSchema = z.object({
  planModalityActivitySchool: z.boolean().optional(),
  professional: z.boolean().optional(),
});

const PlanModalityActivitySchoolProfessionalSortSchema = z.object({
  id: SortSchema.optional(),
  professionalId: SortSchema.optional(),
  planModalityActivitySchoolId: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const PlanModalityActivitySchoolProfessionalFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: PlanModalityActivitySchoolProfessionalWhereSchema.optional(),
  sort: PlanModalityActivitySchoolProfessionalSortSchema.optional(),
  include: PlanModalityActivitySchoolProfessionalIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const PlanModalityActivitySchoolProfessionalFindUniqueSchema = z.object({
  include: PlanModalityActivitySchoolProfessionalIncludeSchema.optional(),
});

/** Create-body query schema*/
export const PlanModalityActivitySchoolProfessionalCreateBodySchema = z.object({
  data: z.object({
    professionalId: z.coerce.number(),
    planModalityActivitySchoolId: z.coerce.number(),
  }),
});

/** Update-body query schema*/
export const PlanModalityActivitySchoolProfessionalUpdateBodySchema = z.object({
  data: PlanModalityActivitySchoolProfessionalCreateBodySchema.shape.data.partial(),
});
