import { db } from '@/server/db';
import { planModalityActivitySchoolProofFiles } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';

const paginate = createPaginator();

export const planModalityActivitySchoolProofFile = tsr.router(
  contract.planModalityActivitySchoolProofFile,
  {
    // -------------------------------------------------------------
    // GET - /plan-modality-activity-school-proof-files
    // -------------------------------------------------------------
    findMany: async ({ query }) => {
      try {
        const q = parseDrizzleFindManyQuery(planModalityActivitySchoolProofFiles)(query);

        const body = await paginate({
          page: query.page,
          limit: query.limit,
          $transaction: ({ limit, offset }) =>
            db.transaction(async (tx) => {
              const a = await tx.query.planModalityActivitySchoolProofFiles.findMany({
                ...q,
                limit,
                offset,
              });
              const c = await tx.select({ count: sql<number>`count(*)` }).from(planModalityActivitySchoolProofFiles).where(q.where) // prettier-ignore
              return [a, c[0]!.count];
            }),
        });

        return { status: 200, body };
      } catch (e) {
        return genTsRestErrorRes(e, {
          genericMsg: 'Something went wrong querying planModalityActivitySchoolProofFiles.',
        });
      }
    },
    // -------------------------------------------------------------
    // GET - /plan-modality-activity-school-proof-files/{id}
    // -------------------------------------------------------------
    findUnique: async ({ params: { id }, query }) => {
      try {
        const planModalityActivitySchoolProofFile =
          await db.query.planModalityActivitySchoolProofFiles.findFirst({
            where: eq(planModalityActivitySchoolProofFiles.id, id),
            with: parseDrizzleFindUniqueQuery(planModalityActivitySchoolProofFiles)(query).with,
          });

        if (!planModalityActivitySchoolProofFile) {
          return {
            status: 404,
            body: {
              message: `Unable to locate 'planModalityActivitySchoolProofFile' with id (${id})`,
            },
          };
        }

        return { status: 200, body: planModalityActivitySchoolProofFile };
      } catch (e) {
        return genTsRestErrorRes(e, {
          genericMsg: `Something went wrong getting 'planModalityActivitySchoolProofFile' with id (${id}).`,
        });
      }
    },
    // -------------------------------------------------------------
    // POST - /plan-modality-activity-school-proof-files
    // -------------------------------------------------------------
    create: async ({ body: { data } }) => {
      try {
        const newPlanModalityActivitySchoolProofFile = await db.transaction(async (tx) => {
          const [{ insertId }] = await tx.insert(planModalityActivitySchoolProofFiles).values(data);
          return (
            await tx
              .select()
              .from(planModalityActivitySchoolProofFiles)
              .where(eq(planModalityActivitySchoolProofFiles.id, insertId))
          ).at(0);
        });

        if (!newPlanModalityActivitySchoolProofFile) {
          return {
            status: 400,
            body: { message: 'Failed to create `planModalityActivitySchoolProofFile`.' },
          };
        }

        return { status: 201, body: newPlanModalityActivitySchoolProofFile };
      } catch (e) {
        return genTsRestErrorRes(e, {
          genericMsg: `Something went wrong creating 'planModalityActivitySchoolProofFile'.`,
        });
      }
    },
    // -------------------------------------------------------------
    // PUT - /plan-modality-activity-school-proof-files/{id}
    // -------------------------------------------------------------
    update: async ({ params: { id }, body: { data } }) => {
      try {
        const updatedPlanModalityActivitySchoolProofFile = await db.transaction(async (tx) => {
          await tx
            .update(planModalityActivitySchoolProofFiles)
            .set(data)
            .where(eq(planModalityActivitySchoolProofFiles.id, id));
          return (
            await tx
              .select()
              .from(planModalityActivitySchoolProofFiles)
              .where(eq(planModalityActivitySchoolProofFiles.id, id))
          ).at(0);
        });

        if (!updatedPlanModalityActivitySchoolProofFile) {
          return {
            status: 400,
            body: { message: 'Failed to update `planModalityActivitySchoolProofFile`.' },
          };
        }

        return { status: 200, body: updatedPlanModalityActivitySchoolProofFile };
      } catch (e) {
        return genTsRestErrorRes(e, {
          genericMsg: `Something went wrong updating 'planModalityActivitySchoolProofFile'.`,
        });
      }
    },
    // -------------------------------------------------------------
    // DELETE - /plan-modality-activity-school-proof-files/{id}
    // -------------------------------------------------------------
    delete: async ({ params: { id } }) => {
      try {
        const [planModalityActivitySchoolProofFile] = await db
          .select()
          .from(planModalityActivitySchoolProofFiles)
          .where(eq(planModalityActivitySchoolProofFiles.id, id));
        if (!planModalityActivitySchoolProofFile) {
          return {
            status: 404,
            body: {
              message: `Unable to locate 'planModalityActivitySchoolProofFile' with id (${id})`,
            },
          };
        }

        await db
          .delete(planModalityActivitySchoolProofFiles)
          .where(eq(planModalityActivitySchoolProofFiles.id, id));
        return { status: 200, body: planModalityActivitySchoolProofFile };
      } catch (e) {
        return genTsRestErrorRes(e, {
          genericMsg: `Something went wrong deleting 'planModalityActivitySchoolProofFile'.`,
        });
      }
    },
  }
);
