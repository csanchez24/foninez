import { z } from 'zod';

import {
  NumberOperatorsSchema,
  SortSchema,
  StringOperatorsSchema,
} from '@/server/utils/query/schemas';

const ChildWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  firstName: z.union([z.string(), StringOperatorsSchema]).optional(),
  lastName: z.union([z.string(), StringOperatorsSchema]).optional(),
  middleName: z.union([z.string(), StringOperatorsSchema]).optional(),
  secondLastName: z.union([z.string(), StringOperatorsSchema]).optional(),
  guardianId: z.union([z.number(), NumberOperatorsSchema]).optional(),
  identificationId: z.union([z.number(), NumberOperatorsSchema]).optional(),
});

type ChildWhereSchemaType = z.infer<typeof ChildWhereBaseSchema> & {
  _and?: ChildWhereSchemaType[];
  _or?: ChildWhereSchemaType[];
  _not?: ChildWhereSchemaType[];
};

const ChildWhereSchema: z.ZodType<ChildWhereSchemaType> = ChildWhereBaseSchema.extend({
  _and: z.lazy(() => ChildWhereSchema.array().optional()),
  _or: z.lazy(() => ChildWhereSchema.array().optional()),
  _not: z.lazy(() => ChildWhereSchema.array().optional()),
});

const ChildIncludeSchema = z.object({
  guardian: z.boolean().optional(),
  identification: z.boolean().optional(),
  planModalityActivitySchoolChildren: z
    .object({
      with: z.object({
        planModalityActivitySchoolProofChildrenAttendances: z.boolean(),
        planModalityActivitySchool: z.object({
          with: z.object({
            planModalityActivity: z.boolean().optional(),
            school: z.boolean().optional(),
          }),
        }),
      }),
    })
    .optional(),
});

const ChildSortSchema = z.object({
  id: SortSchema.optional(),
  firstName: SortSchema.optional(),
  middleName: SortSchema.optional(),
  lastName: SortSchema.optional(),
  secondLastName: SortSchema.optional(),
  guardianId: SortSchema.optional(),
  identificationId: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const ChildFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: ChildWhereSchema.optional(),
  sort: ChildSortSchema.optional(),
  include: ChildIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const ChildFindUniqueSchema = z.object({
  include: ChildIncludeSchema.optional(),
});

/** Create-body query schema*/
export const ChildCreateBodySchema = z.object({
  data: z.object({
    idNum: z.string().min(1),
    firstName: z.string().min(1),
    middleName: z.string().optional(),
    lastName: z.string().min(1),
    secondLastName: z.string().optional(),
    guardianId: z.coerce.number(),
    identificationId: z.coerce.number(),
    beneficiaryTypeId: z.coerce.number(),
    genderId: z.coerce.number(),
    birthDate: z.coerce.date(),
    affiliationDate: z.coerce.date(),
    deactivationDate: z.coerce.date().nullish(),
    countryId: z.coerce.number(),
    stateId: z.coerce.number(),
    cityId: z.coerce.number(),
    birthStateId: z.coerce.number(),
    birthCityId: z.coerce.number(),
    educationLevelId: z.coerce.number(),
    schoolGradeId: z.coerce.number(),
    areaType: z.union([z.literal('urban'), z.literal('rural')]),
    address: z.string().min(1),
    ethnicityId: z.coerce.number(),
    populationId: z.coerce.number(),
    vulnerabilityFactorId: z.coerce.number(),
    shiftId: z.coerce.number(),
    kinshipId: z.coerce.number(),
    indigenousReserveId: z.coerce.number(),
    indigenousCommunityId: z.coerce.number(),
    deactivationReason: z.coerce.string().nullish(),
  }),
});

/** Update-body query schema*/
export const ChildUpdateBodySchema = z.object({
  data: ChildCreateBodySchema.shape.data.partial(),
});
