import { z } from 'zod';

import {
  NumberOperatorsSchema,
  SortSchema,
  StringOperatorsSchema,
} from '@/server/utils/query/schemas';

const BeneficiaryTypeWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  code: z.union([z.string(), StringOperatorsSchema]).optional(),
  name: z.union([z.string(), StringOperatorsSchema]).optional(),
});

type BeneficiaryTypeWhereSchemaType = z.infer<typeof BeneficiaryTypeWhereBaseSchema> & {
  _and?: BeneficiaryTypeWhereSchemaType[];
  _or?: BeneficiaryTypeWhereSchemaType[];
  _not?: BeneficiaryTypeWhereSchemaType[];
};

const BeneficiaryTypeWhereSchema: z.ZodType<BeneficiaryTypeWhereSchemaType> =
  BeneficiaryTypeWhereBaseSchema.extend({
    _and: z.lazy(() => BeneficiaryTypeWhereSchema.array().optional()),
    _or: z.lazy(() => BeneficiaryTypeWhereSchema.array().optional()),
    _not: z.lazy(() => BeneficiaryTypeWhereSchema.array().optional()),
  });

const BeneficiaryTypeIncludeSchema = z.object({
  children: z.boolean().optional(),
});

const BeneficiaryTypeSortSchema = z.object({
  id: SortSchema.optional(),
  code: SortSchema.optional(),
  name: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const BeneficiaryTypeFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: BeneficiaryTypeWhereSchema.optional(),
  sort: BeneficiaryTypeSortSchema.optional(),
  include: BeneficiaryTypeIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const BeneficiaryTypeFindUniqueSchema = z.object({
  include: BeneficiaryTypeIncludeSchema.optional(),
});

/** Create-body query schema*/
export const BeneficiaryTypeCreateBodySchema = z.object({
  data: z.object({
    code: z.string().min(1),
    name: z.string().min(1),
  }),
});

/** Update-body query schema*/
export const BeneficiaryTypeUpdateBodySchema = z.object({
  data: BeneficiaryTypeCreateBodySchema.shape.data.partial(),
});
