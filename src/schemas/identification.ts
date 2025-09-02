import { z } from 'zod';

import {
  NumberOperatorsSchema,
  SortSchema,
  StringOperatorsSchema,
} from '@/server/utils/query/schemas';

const IdentificationWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  name: z.union([z.string(), StringOperatorsSchema]).optional(),
});

type IdentificationWhereSchemaType = z.infer<typeof IdentificationWhereBaseSchema> & {
  _and?: IdentificationWhereSchemaType[];
  _or?: IdentificationWhereSchemaType[];
  _not?: IdentificationWhereSchemaType[];
};

const IdentificationWhereSchema: z.ZodType<IdentificationWhereSchemaType> =
  IdentificationWhereBaseSchema.extend({
    _and: z.lazy(() => IdentificationWhereSchema.array().optional()),
    _or: z.lazy(() => IdentificationWhereSchema.array().optional()),
    _not: z.lazy(() => IdentificationWhereSchema.array().optional()),
  });

const IdentificationIncludeSchema = z.object({
  children: z.boolean().optional(),
  guardians: z.boolean().optional(),
});

const IdentificationSortSchema = z.object({
  id: SortSchema.optional(),
  name: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const IdentificationFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: IdentificationWhereSchema.optional(),
  sort: IdentificationSortSchema.optional(),
  include: IdentificationIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const IdentificationFindUniqueSchema = z.object({
  include: IdentificationIncludeSchema.optional(),
});

/** Create-body query schema*/
export const IdentificationCreateBodySchema = z.object({
  data: z.object({
    code: z.string().min(1),
    name: z.string().min(1),
  }),
});

/** Update-body query schema*/
export const IdentificationUpdateBodySchema = z.object({
  data: IdentificationCreateBodySchema.shape.data.partial(),
});
