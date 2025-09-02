import type { ModalityCreateBodySchema } from '@/schemas/modality';
import type { ProgramCreateBodySchema } from '@/schemas/program';
import type { Contract } from '@/server/api/contracts';
import type { ClientInferResponseBody } from '@ts-rest/core';
import type { z } from 'zod';

export type ProgramPaginated = ClientInferResponseBody<Contract['program']['findMany'], 200>;

export type Program = ProgramPaginated['data'][number];

export type ProgramFormValues = z.infer<typeof ProgramCreateBodySchema.shape.data>;

export type ProgramModalityFormValues = z.infer<typeof ModalityCreateBodySchema.shape.data>;

export type Modality = NonNullable<Program['modalities']>[number];
