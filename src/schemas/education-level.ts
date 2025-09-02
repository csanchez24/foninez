import { z } from 'zod';

import {
  NumberOperatorsSchema,
  SortSchema,
  StringOperatorsSchema,
} from '@/server/utils/query/schemas';

const EducationLevelWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  code: z.union([z.string(), StringOperatorsSchema]).optional(),
  name: z.union([z.string(), StringOperatorsSchema]).optional(),
});

type EducationLevelWhereSchemaType = z.infer<typeof EducationLevelWhereBaseSchema> & {
  _and?: EducationLevelWhereSchemaType[];
  _or?: EducationLevelWhereSchemaType[];
  _not?: EducationLevelWhereSchemaType[];
};

const EducationLevelWhereSchema: z.ZodType<EducationLevelWhereSchemaType> =
  EducationLevelWhereBaseSchema.extend({
    _and: z.lazy(() => EducationLevelWhereSchema.array().optional()),
    _or: z.lazy(() => EducationLevelWhereSchema.array().optional()),
    _not: z.lazy(() => EducationLevelWhereSchema.array().optional()),
  });

const EducationLevelIncludeSchema = z.object({
  children: z.boolean().optional(),
});

const EducationLevelSortSchema = z.object({
  id: SortSchema.optional(),
  code: SortSchema.optional(),
  name: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const EducationLevelFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: EducationLevelWhereSchema.optional(),
  sort: EducationLevelSortSchema.optional(),
  include: EducationLevelIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const EducationLevelFindUniqueSchema = z.object({
  include: EducationLevelIncludeSchema.optional(),
});

/** Create-body query schema*/
export const EducationLevelCreateBodySchema = z.object({
  data: z.object({
    code: z.string().min(1),
    name: z.string().min(1),
  }),
});

/** Update-body query schema*/
export const EducationLevelUpdateBodySchema = z.object({
  data: EducationLevelCreateBodySchema.shape.data.partial(),
});
