import { z } from 'zod';

import {
  NumberOperatorsSchema,
  SortSchema,
  StringOperatorsSchema,
} from '@/server/utils/query/schemas';

const ModalityTypeWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  code: z.union([z.string(), StringOperatorsSchema]).optional(),
  name: z.union([z.string(), StringOperatorsSchema]).optional(),
});

type ModalityTypeWhereSchemaType = z.infer<typeof ModalityTypeWhereBaseSchema> & {
  _and?: ModalityTypeWhereSchemaType[];
  _or?: ModalityTypeWhereSchemaType[];
  _not?: ModalityTypeWhereSchemaType[];
};

const ModalityTypeWhereSchema: z.ZodType<ModalityTypeWhereSchemaType> =
  ModalityTypeWhereBaseSchema.extend({
    _and: z.lazy(() => ModalityTypeWhereSchema.array().optional()),
    _or: z.lazy(() => ModalityTypeWhereSchema.array().optional()),
    _not: z.lazy(() => ModalityTypeWhereSchema.array().optional()),
  });

const ModalityTypeIncludeSchema = z.object({
  children: z.boolean().optional(),
});

const ModalityTypeSortSchema = z.object({
  id: SortSchema.optional(),
  code: SortSchema.optional(),
  name: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const ModalityTypeFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: ModalityTypeWhereSchema.optional(),
  sort: ModalityTypeSortSchema.optional(),
  include: ModalityTypeIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const ModalityTypeFindUniqueSchema = z.object({
  include: ModalityTypeIncludeSchema.optional(),
});

/** Create-body query schema*/
export const ModalityTypeCreateBodySchema = z.object({
  data: z.object({
    code: z.string().min(1),
    name: z.string().min(1),
  }),
});

/** Update-body query schema*/
export const ModalityTypeUpdateBodySchema = z.object({
  data: ModalityTypeCreateBodySchema.shape.data.partial(),
});
