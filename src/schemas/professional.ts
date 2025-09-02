import { z } from 'zod';

import {
  BooleanOperatorsSchema,
  NumberOperatorsSchema,
  SortSchema,
  StringOperatorsSchema,
} from '@/server/utils/query/schemas';

const ProfessionalWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  authId: z.union([z.number(), NumberOperatorsSchema]).optional(),
  firstName: z.union([z.string(), StringOperatorsSchema]).optional(),
  lastName: z.union([z.string(), StringOperatorsSchema]).optional(),
  middleName: z.union([z.string(), StringOperatorsSchema]).optional(),
  secondLastName: z.union([z.string(), StringOperatorsSchema]).optional(),
  email: z.union([z.string(), StringOperatorsSchema]).optional(),
  isActive: z.union([z.boolean(), BooleanOperatorsSchema]).optional(),
});

type ProfessionalWhereSchemaType = z.infer<typeof ProfessionalWhereBaseSchema> & {
  _and?: ProfessionalWhereSchemaType[];
  _or?: ProfessionalWhereSchemaType[];
  _not?: ProfessionalWhereSchemaType[];
};

const ProfessionalWhereSchema: z.ZodType<ProfessionalWhereSchemaType> =
  ProfessionalWhereBaseSchema.extend({
    _and: z.lazy(() => ProfessionalWhereSchema.array().optional()),
    _or: z.lazy(() => ProfessionalWhereSchema.array().optional()),
    _not: z.lazy(() => ProfessionalWhereSchema.array().optional()),
  });

const ProfessionalIncludeSchema = z.object({
  planModalityActivitySchoolProfessionals: z
    .object({
      with: z.object({
        planModalityActivitySchool: z.object({
          with: z.object({
            planModalityActivity: z.boolean(),
            school: z.boolean(),
          }),
        }),
      }),
    })
    .optional(),
  identification: z.boolean().optional(),
});

const ProfessionalSortSchema = z.object({
  id: SortSchema.optional(),
  firstName: SortSchema.optional(),
  middleName: SortSchema.optional(),
  lastName: SortSchema.optional(),
  secondLastName: SortSchema.optional(),
  email: SortSchema.optional(),
  isActive: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const ProfessionalFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: ProfessionalWhereSchema.optional(),
  sort: ProfessionalSortSchema.optional(),
  include: ProfessionalIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const ProfessionalFindUniqueSchema = z.object({
  include: ProfessionalIncludeSchema.optional(),
});

/** Create-body query schema*/
export const ProfessionalCreateBodySchema = z.object({
  data: z.object({
    idNum: z.string().min(1),
    identificationId: z.coerce.number(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    middleName: z.string().optional(),
    secondLastName: z.string().optional(),
    email: z.string().email(),
    phone: z.string().optional(),
    address: z.string().optional(),
    authId: z.coerce.number().int(),
    isActive: z.boolean(),
  }),
});

/** Update-body query schema*/
export const ProfessionalUpdateBodySchema = z.object({
  data: ProfessionalCreateBodySchema.shape.data.partial(),
});
