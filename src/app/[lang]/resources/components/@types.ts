import type { ResourceCreateBodySchema } from '@/schemas/resource';
import type { ResourceClassificationCreateBodySchema } from '@/schemas/resource-classification';
import type { Contract } from '@/server/api/contracts';
import type { ClientInferResponseBody } from '@ts-rest/core';
import type { z } from 'zod';

export type ResourcePaginated = ClientInferResponseBody<Contract['resource']['findMany'], 200>;

export type Resource = ResourcePaginated['data'][number];

export type ResourceFormValues = Omit<
  z.infer<typeof ResourceCreateBodySchema.shape.data>,
  'resourceClassificationId'
> & {
  resourceClassificationId?: number;
};

export type InventoryTransactionLines = ClientInferResponseBody<
  Contract['inventoryTransactionLine']['findMany'],
  200
>['data'];
export type InventoryTransactionLine = InventoryTransactionLines[number];

export type ResourceClassifications = ClientInferResponseBody<
  Contract['resourceClassification']['findMany'],
  200
>;

export type ResourceClassification = ResourceClassifications['data'][number];

export type ResourceClassificationFormValues = z.infer<
  typeof ResourceClassificationCreateBodySchema.shape.data
>;
