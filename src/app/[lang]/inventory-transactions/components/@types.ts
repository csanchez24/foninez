import type { InventoryTransactionCreateBodySchema } from '@/schemas/inventory-transaction';
import type { Contract } from '@/server/api/contracts';
import type { ClientInferResponseBody } from '@ts-rest/core';
import type { z } from 'zod';

export type InventoryTransactionPaginated = ClientInferResponseBody<
  Contract['inventoryTransaction']['findMany'],
  200
>;

export type InventoryTransaction = InventoryTransactionPaginated['data'][number];

export type InventoryTransactionFormValues = z.infer<
  typeof InventoryTransactionCreateBodySchema.shape.data
>;

export type InventoryTransactionLines = ClientInferResponseBody<
  Contract['inventoryTransactionLine']['findMany'],
  200
>['data'];
export type InventoryTransactionLine = InventoryTransactionLines[number];
