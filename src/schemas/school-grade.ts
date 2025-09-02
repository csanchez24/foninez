import { z } from 'zod';

import {
  NumberOperatorsSchema,
  SortSchema,
  StringOperatorsSchema,
} from '@/server/utils/query/schemas';

const SchoolGradeWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  code: z.union([z.string(), StringOperatorsSchema]).optional(),
  name: z.union([z.string(), StringOperatorsSchema]).optional(),
});

type SchoolGradeWhereSchemaType = z.infer<typeof SchoolGradeWhereBaseSchema> & {
  _and?: SchoolGradeWhereSchemaType[];
  _or?: SchoolGradeWhereSchemaType[];
  _not?: SchoolGradeWhereSchemaType[];
};

const SchoolGradeWhereSchema: z.ZodType<SchoolGradeWhereSchemaType> =
  SchoolGradeWhereBaseSchema.extend({
    _and: z.lazy(() => SchoolGradeWhereSchema.array().optional()),
    _or: z.lazy(() => SchoolGradeWhereSchema.array().optional()),
    _not: z.lazy(() => SchoolGradeWhereSchema.array().optional()),
  });

const SchoolGradeIncludeSchema = z.object({
  children: z.boolean().optional(),
});

const SchoolGradeSortSchema = z.object({
  id: SortSchema.optional(),
  code: SortSchema.optional(),
  name: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const SchoolGradeFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: SchoolGradeWhereSchema.optional(),
  sort: SchoolGradeSortSchema.optional(),
  include: SchoolGradeIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const SchoolGradeFindUniqueSchema = z.object({
  include: SchoolGradeIncludeSchema.optional(),
});

/** Create-body query schema*/
export const SchoolGradeCreateBodySchema = z.object({
  data: z.object({
    code: z.string().min(1),
    name: z.string().min(1),
  }),
});

/** Update-body query schema*/
export const SchoolGradeUpdateBodySchema = z.object({
  data: SchoolGradeCreateBodySchema.shape.data.partial(),
});
