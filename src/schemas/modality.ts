import { z } from 'zod';

import {
  NumberOperatorsSchema,
  SortSchema,
  StringOperatorsSchema,
} from '@/server/utils/query/schemas';

const ModalityWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  name: z.union([z.string(), StringOperatorsSchema]).optional(),
  programId: z.union([z.number(), NumberOperatorsSchema]).optional(),
});

type ModalityWhereSchemaType = z.infer<typeof ModalityWhereBaseSchema> & {
  _and?: ModalityWhereSchemaType[];
  _or?: ModalityWhereSchemaType[];
  _not?: ModalityWhereSchemaType[];
};

const ModalityWhereSchema: z.ZodType<ModalityWhereSchemaType> = ModalityWhereBaseSchema.extend({
  _and: z.lazy(() => ModalityWhereSchema.array().optional()),
  _or: z.lazy(() => ModalityWhereSchema.array().optional()),
  _not: z.lazy(() => ModalityWhereSchema.array().optional()),
});

const ModalityIncludeSchema = z.object({
  program: z.boolean().optional(),
  planModalities: z.boolean().optional(),
});

const ModalitySortSchema = z.object({
  id: SortSchema.optional(),
  name: SortSchema.optional(),
  programId: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const ModalityFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: ModalityWhereSchema.optional(),
  sort: ModalitySortSchema.optional(),
  include: ModalityIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const ModalityFindUniqueSchema = z.object({
  include: ModalityIncludeSchema.optional(),
});

/** Create-body query schema*/
export const ModalityCreateBodySchema = z.object({
  data: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    programId: z.coerce.number(),
    modalityTypeId: z.coerce.number(),
  }),
});

/** Update-body query schema*/
export const ModalityUpdateBodySchema = z.object({
  data: ModalityCreateBodySchema.shape.data.partial(),
});
