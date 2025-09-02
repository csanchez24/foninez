import { z } from 'zod';

import {
  NumberOperatorsSchema,
  SortSchema,
  StringOperatorsSchema,
} from '@/server/utils/query/schemas';

const SchoolWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  name: z.union([z.string(), StringOperatorsSchema]).optional(),
  infrastructureCode: z.union([z.string(), StringOperatorsSchema]).optional(),
  daneCode: z.union([z.string(), StringOperatorsSchema]).optional(),
  branchCode: z.union([z.string(), StringOperatorsSchema]).optional(),
});

type SchoolWhereSchemaType = z.infer<typeof SchoolWhereBaseSchema> & {
  _and?: SchoolWhereSchemaType[];
  _or?: SchoolWhereSchemaType[];
  _not?: SchoolWhereSchemaType[];
};

const SchoolWhereSchema: z.ZodType<SchoolWhereSchemaType> = SchoolWhereBaseSchema.extend({
  _and: z.lazy(() => SchoolWhereSchema.array().optional()),
  _or: z.lazy(() => SchoolWhereSchema.array().optional()),
  _not: z.lazy(() => SchoolWhereSchema.array().optional()),
});

const SchoolIncludeSchema = z.object({
  city: z.boolean().optional(),
  planModalityActivitySchools: z.object({
    with: z
      .object({
        planModalityActivity: z.boolean().optional(),
        planModalityActivitySchoolChildren: z.boolean().optional(),
        planModalityActivitySchoolProfessionals: z.object({
          with: z.object({
            professional: z.boolean(),
          }),
        }),
      })
      .optional(),
  }),
});

const SchoolSortSchema = z.object({
  id: SortSchema.optional(),
  name: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const SchoolFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: SchoolWhereSchema.optional(),
  sort: SchoolSortSchema.optional(),
  include: SchoolIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const SchoolFindUniqueSchema = z.object({
  include: SchoolIncludeSchema.optional(),
});

/** Create-body query schema*/
export const SchoolCreateBodySchema = z.object({
  data: z.object({
    name: z.string().min(1),
    infrastructureCode: z.string().min(1),
    daneCode: z.string().min(1),
    branchCode: z.string().min(1),
    areaType: z.union([z.literal('urban'), z.literal('rural')]),
    sectorType: z.union([
      z.literal('official / public'),
      z.literal('private'),
      z.literal('mixed'),
      z.literal('not applicable'),
    ]),
    cityId: z.coerce.number(),
  }),
});

/** Update-body query schema*/
export const SchoolUpdateBodySchema = z.object({
  data: SchoolCreateBodySchema.shape.data.partial(),
});
