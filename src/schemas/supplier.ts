import { z } from 'zod';

import {
  NumberOperatorsSchema,
  SortSchema,
  StringOperatorsSchema,
} from '@/server/utils/query/schemas';

const SupplierWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  name: z.union([z.string(), StringOperatorsSchema]).optional(),
});

type SupplierWhereSchemaType = z.infer<typeof SupplierWhereBaseSchema> & {
  _and?: SupplierWhereSchemaType[];
  _or?: SupplierWhereSchemaType[];
  _not?: SupplierWhereSchemaType[];
};

const SupplierWhereSchema: z.ZodType<SupplierWhereSchemaType> = SupplierWhereBaseSchema.extend({
  _and: z.lazy(() => SupplierWhereSchema.array().optional()),
  _or: z.lazy(() => SupplierWhereSchema.array().optional()),
  _not: z.lazy(() => SupplierWhereSchema.array().optional()),
});

const SupplierIncludeSchema = z.object({
  resourcesToSuppliers: z.object({
    with: z.object({
      resource: z.boolean(),
      supplier: z.boolean(),
    }),
  }),
});

const SupplierSortSchema = z.object({
  id: SortSchema.optional(),
  name: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const SupplierFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: SupplierWhereSchema.optional(),
  sort: SupplierSortSchema.optional(),
  include: SupplierIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const SupplierFindUniqueSchema = z.object({
  include: SupplierIncludeSchema.optional(),
});

/** Create-body query schema*/
export const SupplierCreateBodySchema = z.object({
  data: z.object({
    name: z.string().min(1),
  }),
});

/** Update-body query schema*/
export const SupplierUpdateBodySchema = z.object({
  data: SupplierCreateBodySchema.shape.data.partial(),
});
