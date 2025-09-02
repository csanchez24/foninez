import type { ProofFileClassificationCreateBodySchema } from '@/schemas/proof-file-classification';
import type { Contract } from '@/server/api/contracts';
import type { ClientInferResponseBody } from '@ts-rest/core';
import type { z } from 'zod';

export type ProofFileClassificationPaginated = ClientInferResponseBody<
  Contract['proofFileClassification']['findMany'],
  200
>;

export type ProofFileClassification = ProofFileClassificationPaginated['data'][number];

export type ProofFileClassificationFormValues = z.infer<
  typeof ProofFileClassificationCreateBodySchema.shape.data
>;
