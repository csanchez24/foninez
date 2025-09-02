import { z } from 'zod';

import {
  DateOperatorsSchema,
  NumberOperatorsSchema,
  SortSchema,
  StringOperatorsSchema,
} from '@/server/utils/query/schemas';
import { PlanModalityActivityResourceCreateBodySchema } from './plan-modality-activity-resource';
import { PlanModalityActivityProofFileCreateBodySchema } from './plan-modality-activity-proof-file';
import { PlanModalityActivitySchoolCreateBodySchema } from './plan-modality-activity-school';
import { ResourceUpdateBodySchema } from './resource';
import { ProofFileClassificationUpdateBodySchema } from './proof-file-classification';
import { SchoolUpdateBodySchema } from './school';

const PlanModalityActivityWhereBaseSchema = z.object({
  id: z.union([z.number(), NumberOperatorsSchema]).optional(),
  name: z.union([z.string(), StringOperatorsSchema]).optional(),
  description: z.union([z.string(), StringOperatorsSchema]).optional(),
  requiredProofOfCompletionCount: z.union([z.number(), NumberOperatorsSchema]).optional(),
  planModalityId: z.union([z.number(), NumberOperatorsSchema]).optional(),
  planId: z.union([z.number(), NumberOperatorsSchema]).optional(),
  startDate: z.union([z.date(), DateOperatorsSchema]).optional(),
  endDate: z.union([z.date(), DateOperatorsSchema]).optional(),
});

type PlanModalityActivityWhereSchemaType = z.infer<typeof PlanModalityActivityWhereBaseSchema> & {
  _and?: PlanModalityActivityWhereSchemaType[];
  _or?: PlanModalityActivityWhereSchemaType[];
  _not?: PlanModalityActivityWhereSchemaType[];
};

const PlanModalityActivityWhereSchema: z.ZodType<PlanModalityActivityWhereSchemaType> =
  PlanModalityActivityWhereBaseSchema.extend({
    _and: z.lazy(() => PlanModalityActivityWhereSchema.array().optional()),
    _or: z.lazy(() => PlanModalityActivityWhereSchema.array().optional()),
    _not: z.lazy(() => PlanModalityActivityWhereSchema.array().optional()),
  });

const PlanModalityActivityIncludeSchema = z.object({
  planModality: z.union([
    z.boolean(),
    z.object({
      with: z.object({
        modality: z.boolean(),
      }),
    }),
  ]),
  plan: z.boolean().optional(),
  planModalityActivityProofFiles: z.union([
    z.boolean().optional(),
    z.object({
      with: z.object({
        proofFileClassification: z.boolean(),
      }),
    }),
  ]),
  planModalityActivityResources: z.union([
    z.boolean().optional(),
    z.object({
      with: z.object({
        resource: z.boolean(),
      }),
    }),
  ]),
  planModalityActivitySchools: z.union([
    z.boolean(),
    z.object({
      with: z.object({
        school: z.boolean(),
      }),
    }),
  ]),
});

const PlanModalityActivitySortSchema = z.object({
  id: SortSchema.optional(),
  name: SortSchema.optional(),
  requiredProofOfCompletionCount: SortSchema.optional(),
  planModalityId: SortSchema.optional(),
  planId: SortSchema.optional(),
  startDate: SortSchema.optional(),
  endDate: SortSchema.optional(),
  createdAt: SortSchema.optional(),
  updatedAt: SortSchema.optional(),
});

/** Find-many query schema*/
export const PlanModalityActivityFindManyQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  where: PlanModalityActivityWhereSchema.optional(),
  sort: PlanModalityActivitySortSchema.optional(),
  include: PlanModalityActivityIncludeSchema.optional(),
});

/** Find-unique query schema*/
export const PlanModalityActivityFindUniqueSchema = z.object({
  include: PlanModalityActivityIncludeSchema.optional(),
});

/** Create-body query schema*/
export const PlanModalityActivityCreateBodySchema = z.object({
  data: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    requiredProofOfCompletionCount: z.coerce.number(),
    planModalityId: z.coerce.number(),
    planId: z.coerce.number(),
    serviceAipiId: z.coerce.number(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    schools: z
      .lazy(() =>
        PlanModalityActivitySchoolCreateBodySchema.shape.data
          .omit({ planModalityActivityId: true, schoolId: true, endDate: true, startDate: true })
          .extend({
            school: z.lazy(() => SchoolUpdateBodySchema.shape.data.extend({ id: z.number() })),
          })
          .array()
      )
      .optional(),
    resources: z
      .lazy(() =>
        PlanModalityActivityResourceCreateBodySchema.shape.data
          .omit({ planModalityActivityId: true, resourceId: true })
          .extend({
            resource: z.lazy(() =>
              ResourceUpdateBodySchema.shape.data
                .omit({ resourcesToSuppliers: true })
                .extend({ id: z.number() })
            ),
          })
          .array()
      )
      .optional(),
    proofFiles: z
      .lazy(() =>
        PlanModalityActivityProofFileCreateBodySchema.shape.data
          .omit({ planModalityActivityId: true, proofFileClassificationId: true })
          .extend({
            proofFileClassification: z.lazy(() =>
              ProofFileClassificationUpdateBodySchema.shape.data.extend({ id: z.number() })
            ),
          })
          .array()
      )
      .optional(),
  }),
});

/** Update-body query schema*/
export const PlanModalityActivityUpdateBodySchema = z.object({
  data: PlanModalityActivityCreateBodySchema.shape.data.partial(),
});
