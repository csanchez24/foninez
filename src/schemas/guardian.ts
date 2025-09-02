import { z } from 'zod';

import {
  NumberOperatorsSchema,
  SortSchema,
  StringOperatorsSchema,
} from '@/server/utils/query/schemas';

const GuardianWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  firstName: z.union([z.string(), StringOperatorsSchema]).optional(),
  lastName: z.union([z.string(), StringOperatorsSchema]).optional(),
  middleName: z.union([z.string(), StringOperatorsSchema]).optional(),
  secondLastName: z.union([z.string(), StringOperatorsSchema]).optional(),
  phone: z.union([z.string(), StringOperatorsSchema]).optional(),
  identificationId: z.union([z.number(), NumberOperatorsSchema]).optional(),
});

type GuardianWhereSchemaType = z.infer<typeof GuardianWhereBaseSchema> & {
  _and?: GuardianWhereSchemaType[];
  _or?: GuardianWhereSchemaType[];
  _not?: GuardianWhereSchemaType[];
};

const GuardianWhereSchema: z.ZodType<GuardianWhereSchemaType> = GuardianWhereBaseSchema.extend({
  _and: z.lazy(() => GuardianWhereSchema.array().optional()),
  _or: z.lazy(() => GuardianWhereSchema.array().optional()),
  _not: z.lazy(() => GuardianWhereSchema.array().optional()),
});

const GuardianIncludeSchema = z.object({
  children: z.boolean().optional(),
  identification: z.boolean().optional(),
});

const GuardianSortSchema = z.object({
  id: SortSchema.optional(),
  firstName: SortSchema.optional(),
  middleName: SortSchema.optional(),
  lastName: SortSchema.optional(),
  secondLastName: SortSchema.optional(),
  identificationId: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const GuardianFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: GuardianWhereSchema.optional(),
  sort: GuardianSortSchema.optional(),
  include: GuardianIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const GuardianFindUniqueSchema = z.object({
  include: GuardianIncludeSchema.optional(),
});

/** Create-body query schema*/
export const GuardianCreateBodySchema = z.object({
  data: z.object({
    idNum: z.string().min(1),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    middleName: z.string().optional(),
    secondLastName: z.string().optional(),
    phone: z.string().optional(),
    identificationId: z.coerce.number(),
  }),
});

/** Update-body query schema*/
export const GuardianUpdateBodySchema = z.object({
  data: GuardianCreateBodySchema.shape.data.partial(),
});
