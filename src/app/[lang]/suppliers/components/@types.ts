import type { SupplierCreateBodySchema } from '@/schemas/supplier';
import type { Contract } from '@/server/api/contracts';
import type { ClientInferResponseBody } from '@ts-rest/core';
import type { z } from 'zod';

export type SupplierPaginated = ClientInferResponseBody<Contract['supplier']['findMany'], 200>;

export type Supplier = SupplierPaginated['data'][number];

export type SupplierFormValues = z.infer<typeof SupplierCreateBodySchema.shape.data>;

export type ResourcesToSuppliers = ClientInferResponseBody<
  Contract['resourceToSupplier']['findMany'],
  200
>['data'];
export type ResourceToSupplier = ResourcesToSuppliers[number];
