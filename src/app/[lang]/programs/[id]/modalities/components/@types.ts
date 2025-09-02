import type { ModalityCreateBodySchema } from '@/schemas/modality';
import type { Contract } from '@/server/api/contracts';
import type { ClientInferResponseBody } from '@ts-rest/core';
import type { z } from 'zod';

export type ProgramPaginated = ClientInferResponseBody<Contract['program']['findMany'], 200>;

export type Program = ProgramPaginated['data'][number];

export type ProgramModalityFormValues = Omit<
  z.infer<typeof ModalityCreateBodySchema.shape.data>,
  'programId'
> & { programId?: number };

export type ModalityPaginated = ClientInferResponseBody<Contract['modality']['findMany'], 200>;

export type Modality = ModalityPaginated['data'][number];
