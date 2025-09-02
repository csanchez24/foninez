import { db } from '@/server/db';
import {
  planModalityActivitySchoolProofChildrenAttendances,
  planModalityActivitySchoolProofChildrenResources,
  planModalityActivitySchoolProofFiles,
  planModalityActivitySchoolProofs,
} from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';
import { saveFile } from '@/utils/comfenalco';

const paginate = createPaginator();

export const planModalityActivitySchoolProof = tsr.router(
  contract.planModalityActivitySchoolProof,
  {
    // -------------------------------------------------------------
    // GET - /plan-modality-activity-school-proofs
    // -------------------------------------------------------------
    findMany: async ({ query }) => {
      try {
        const q = parseDrizzleFindManyQuery(planModalityActivitySchoolProofs)(query);

        const body = await paginate({
          page: query.page,
          limit: query.limit,
          $transaction: ({ limit, offset }) =>
            db.transaction(async (tx) => {
              const a = await tx.query.planModalityActivitySchoolProofs.findMany({
                ...q,
                limit,
                offset,
              });
              const c = await tx.select({ count: sql<number>`count(*)` }).from(planModalityActivitySchoolProofs).where(q.where) // prettier-ignore
              return [a, c[0]!.count];
            }),
        });

        return { status: 200, body };
      } catch (e) {
        return genTsRestErrorRes(e, {
          genericMsg: 'Something went wrong querying planModalityActivitySchoolProofs.',
        });
      }
    },
    // -------------------------------------------------------------
    // GET - /plan-modality-activity-school-proofs/{id}
    // -------------------------------------------------------------
    findUnique: async ({ params: { id }, query }) => {
      try {
        const planModalityActivitySchoolProof =
          await db.query.planModalityActivitySchoolProofs.findFirst({
            where: eq(planModalityActivitySchoolProofs.id, id),
            with: parseDrizzleFindUniqueQuery(planModalityActivitySchoolProofs)(query).with,
          });

        if (!planModalityActivitySchoolProof) {
          return {
            status: 404,
            body: { message: `Unable to locate 'planModalityActivitySchoolProof' with id (${id})` },
          };
        }

        return { status: 200, body: planModalityActivitySchoolProof };
      } catch (e) {
        return genTsRestErrorRes(e, {
          genericMsg: `Something went wrong getting 'planModalityActivitySchoolProof' with id (${id}).`,
        });
      }
    },
    // -------------------------------------------------------------
    // POST - /plan-modality-activity-school-proofs
    // -------------------------------------------------------------
    create: async (_, { request }) => {
      try {
        const formData = await request.formData();

        const planModalityActivitySchoolId = Number(formData.get('planModalityActivitySchoolId'));
        const note = JSON.parse(formData.get('note') as string) as string;
        const childAttendanceData = formData
          .getAll('planModalityActivitySchoolProofChildAttendance')
          .map(
            (item) =>
              JSON.parse(item as string) as {
                planModalityActivitySchoolChildId: number;
                attended: boolean;
                planModalityActivitySchoolProofResourcesId?: number[];
                name: string;
              }
          );
        const proofFilesIds = formData
          .getAll('planModalityActivitySchoolProofFilesId')
          .map((id) => Number(id));
        const proofFiles = formData.getAll('planModalityActivitySchoolProofFiles') as File[];

        const newPlanModalityActivitySchoolProof = await db.transaction(async (tx) => {
          const [{ insertId: proofId }] = await tx.insert(planModalityActivitySchoolProofs).values({
            note,
            planModalityActivitySchoolId,
          });

          const childrenAttendances =
            childAttendanceData?.map((c) => {
              return {
                planModalityActivitySchoolChildId: c.planModalityActivitySchoolChildId,
                attended: c.attended,
                planModalityActivitySchoolProofId: proofId,
              };
            }) ?? [];

          await tx
            .insert(planModalityActivitySchoolProofChildrenAttendances)
            .values(childrenAttendances);

          const childrenResources =
            childAttendanceData?.flatMap((c) => {
              return (
                c.planModalityActivitySchoolProofResourcesId?.map((r) => {
                  return {
                    planModalityActivitySchoolChildId: c.planModalityActivitySchoolChildId,
                    planModalityActivitySchoolProofId: proofId,
                    given: true,
                    planModalityActivitySchoolResourceId: r,
                  };
                }) ?? []
              );
            }) ?? [];

          await tx
            .insert(planModalityActivitySchoolProofChildrenResources)
            .values(childrenResources);

          const filesData = await Promise.all(
            proofFiles?.map(async (f, index) => {
              const res = await saveFile({
                file: f,
                path: 'foninez/actividades/soporte/',
              });
              const fileId = res ? res.data.at(0)?.llaveArchivo : null;

              return {
                planModalityActivitySchoolProofId: proofId,
                filePath: fileId ?? '',
                proofFileClassificationId: proofFilesIds[index] ?? 0,
              };
            }) ?? []
          );

          if (filesData.some((f) => !f.filePath)) {
            throw new Error('No se adjuntaron todos los archivos');
          }

          await tx.insert(planModalityActivitySchoolProofFiles).values(filesData);

          return (
            await tx
              .select()
              .from(planModalityActivitySchoolProofs)
              .where(eq(planModalityActivitySchoolProofs.id, proofId))
          ).at(0);
        });

        if (!newPlanModalityActivitySchoolProof) {
          return {
            status: 400,
            body: { message: 'Failed to create `planModalityActivitySchoolProof`.' },
          };
        }

        return { status: 201, body: newPlanModalityActivitySchoolProof };
      } catch (e) {
        return genTsRestErrorRes(e, {
          genericMsg: `Something went wrong creating 'planModalityActivitySchoolProof'.`,
        });
      }
    },
    // -------------------------------------------------------------
    // PUT - /plan-modality-activity-school-proofs/{id}
    // -------------------------------------------------------------
    update: async ({ params: { id }, body: { data } }) => {
      try {
        const updatedPlanModalityActivitySchoolProof = await db.transaction(async (tx) => {
          await tx
            .update(planModalityActivitySchoolProofs)
            .set(data)
            .where(eq(planModalityActivitySchoolProofs.id, id));
          return (
            await tx
              .select()
              .from(planModalityActivitySchoolProofs)
              .where(eq(planModalityActivitySchoolProofs.id, id))
          ).at(0);
        });

        if (!updatedPlanModalityActivitySchoolProof) {
          return {
            status: 400,
            body: { message: 'Failed to update `planModalityActivitySchoolProof`.' },
          };
        }

        return { status: 200, body: updatedPlanModalityActivitySchoolProof };
      } catch (e) {
        return genTsRestErrorRes(e, {
          genericMsg: `Something went wrong updating 'planModalityActivitySchoolProof'.`,
        });
      }
    },
    // -------------------------------------------------------------
    // DELETE - /plan-modality-activity-school-proofs/{id}
    // -------------------------------------------------------------
    delete: async ({ params: { id } }) => {
      try {
        const [planModalityActivitySchoolProof] = await db
          .select()
          .from(planModalityActivitySchoolProofs)
          .where(eq(planModalityActivitySchoolProofs.id, id));
        if (!planModalityActivitySchoolProof) {
          return {
            status: 404,
            body: { message: `Unable to locate 'planModalityActivitySchoolProof' with id (${id})` },
          };
        }

        await db
          .delete(planModalityActivitySchoolProofs)
          .where(eq(planModalityActivitySchoolProofs.id, id));
        return { status: 200, body: planModalityActivitySchoolProof };
      } catch (e) {
        return genTsRestErrorRes(e, {
          genericMsg: `Something went wrong deleting 'planModalityActivitySchoolProof'.`,
        });
      }
    },
  }
);
