import { z } from 'zod';

import {
  NumberOperatorsSchema,
  SortSchema,
  StringOperatorsSchema,
} from '@/server/utils/query/schemas';

const ProgramWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  name: z.union([z.string(), StringOperatorsSchema]).optional(),
});

type ProgramWhereSchemaType = z.infer<typeof ProgramWhereBaseSchema> & {
  _and?: ProgramWhereSchemaType[];
  _or?: ProgramWhereSchemaType[];
  _not?: ProgramWhereSchemaType[];
};

const ProgramWhereSchema: z.ZodType<ProgramWhereSchemaType> = ProgramWhereBaseSchema.extend({
  _and: z.lazy(() => ProgramWhereSchema.array().optional()),
  _or: z.lazy(() => ProgramWhereSchema.array().optional()),
  _not: z.lazy(() => ProgramWhereSchema.array().optional()),
});

const ProgramIncludeSchema = z.object({
  modalities: z.boolean().optional(),
  plans: z.boolean().optional(),
});

const ProgramSortSchema = z.object({
  id: SortSchema.optional(),
  name: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const ProgramFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: ProgramWhereSchema.optional(),
  sort: ProgramSortSchema.optional(),
  include: ProgramIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const ProgramFindUniqueSchema = z.object({
  include: ProgramIncludeSchema.optional(),
});

/** Create-body query schema*/
export const ProgramCreateBodySchema = z.object({
  data: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
  }),
});

/** Update-body query schema*/
export const ProgramUpdateBodySchema = z.object({
  data: ProgramCreateBodySchema.shape.data.partial(),
});
