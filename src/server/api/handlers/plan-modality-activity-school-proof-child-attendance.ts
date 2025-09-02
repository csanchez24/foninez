import { db } from '@/server/db';
import { planModalityActivitySchoolProofChildrenAttendances } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';

const paginate = createPaginator();

export const planModalityActivitySchoolProofChildAttendance = tsr.router(
  contract.planModalityActivitySchoolProofChildAttendance,
  {
    // ----------------------------------------------------------------------------
    // GET - /plan-modality-activity-school-proof-children-attendances
    // ----------------------------------------------------------------------------
    findMany: async ({ query }) => {
      try {
        const q = parseDrizzleFindManyQuery(planModalityActivitySchoolProofChildrenAttendances)(
          query
        );

        const body = await paginate({
          page: query.page,
          limit: query.limit,
          $transaction: ({ limit, offset }) =>
            db.transaction(async (tx) => {
              const a = await tx.query.planModalityActivitySchoolProofChildrenAttendances.findMany({
                ...q,
                limit,
                offset,
              });
              const c = await tx.select({ count: sql<number>`count(*)` }).from(planModalityActivitySchoolProofChildrenAttendances).where(q.where) // prettier-ignore
              return [a, c[0]!.count];
            }),
        });

        return { status: 200, body };
      } catch (e) {
        return genTsRestErrorRes(e, {
          genericMsg:
            'Something went wrong querying `planModalityActivitySchoolProofChildrenAttendances`.',
        });
      }
    },
    // ----------------------------------------------------------------------------
    // GET - /plan-modality-activity-school-proof-children-attendances/{id}
    // ----------------------------------------------------------------------------
    findUnique: async ({ params: { id }, query }) => {
      try {
        const planModalityActivitySchoolProofChidlrenAttendance =
          await db.query.planModalityActivitySchoolProofChildrenAttendances.findFirst({
            where: eq(planModalityActivitySchoolProofChildrenAttendances.id, id),
            with: parseDrizzleFindUniqueQuery(planModalityActivitySchoolProofChildrenAttendances)(
              query
            ).with,
          });

        if (!planModalityActivitySchoolProofChidlrenAttendance) {
          return {
            status: 404,
            body: {
              message: `Unable to locate 'planModalityActivitySchoolProofChidlrenAttendance' with id (${id})`,
            },
          };
        }

        return { status: 200, body: planModalityActivitySchoolProofChidlrenAttendance };
      } catch (e) {
        return genTsRestErrorRes(e, {
          genericMsg: `Something went wrong getting 'planModalityActivitySchoolProofChidlrenAttendance' with id (${id}).`,
        });
      }
    },
    // ----------------------------------------------------------------------------
    // POST - /plan-modality-activity-school-proof-children-attendances
    // ----------------------------------------------------------------------------
    create: async ({ body: { data } }) => {
      try {
        const newPlanModalityActivitySchoolProofChidlrenAttendance = await db.transaction(
          async (tx) => {
            const [{ insertId }] = await tx
              .insert(planModalityActivitySchoolProofChildrenAttendances)
              .values(data);
            return (
              await tx
                .select()
                .from(planModalityActivitySchoolProofChildrenAttendances)
                .where(eq(planModalityActivitySchoolProofChildrenAttendances.id, insertId))
            ).at(0);
          }
        );

        if (!newPlanModalityActivitySchoolProofChidlrenAttendance) {
          return {
            status: 400,
            body: {
              message: 'Failed to create `planModalityActivitySchoolProofChidlrenAttendance`.',
            },
          };
        }

        return { status: 201, body: newPlanModalityActivitySchoolProofChidlrenAttendance };
      } catch (e) {
        return genTsRestErrorRes(e, {
          genericMsg: `Something went wrong creating 'planModalityActivitySchoolProofChidlrenAttendance'.`,
        });
      }
    },
    // ----------------------------------------------------------------------------
    // PUT - /plan-modality-activity-school-proof-children-attendances/{id}
    // ----------------------------------------------------------------------------
    update: async ({ params: { id }, body: { data } }) => {
      try {
        const updatedPlanModalityActivitySchoolProofChidlrenAttendance = await db.transaction(
          async (tx) => {
            await tx
              .update(planModalityActivitySchoolProofChildrenAttendances)
              .set(data)
              .where(eq(planModalityActivitySchoolProofChildrenAttendances.id, id));
            return (
              await tx
                .select()
                .from(planModalityActivitySchoolProofChildrenAttendances)
                .where(eq(planModalityActivitySchoolProofChildrenAttendances.id, id))
            ).at(0);
          }
        );

        if (!updatedPlanModalityActivitySchoolProofChidlrenAttendance) {
          return {
            status: 400,
            body: {
              message: 'Failed to update `planModalityActivitySchoolProofChidlrenAttendance`.',
            },
          };
        }

        return { status: 200, body: updatedPlanModalityActivitySchoolProofChidlrenAttendance };
      } catch (e) {
        return genTsRestErrorRes(e, {
          genericMsg: `Something went wrong updating 'planModalityActivitySchoolProofChidlrenAttendance'.`,
        });
      }
    },
    // ----------------------------------------------------------------------------
    // DELETE - /plan-modality-activity-school-proof-children-attendances/{id}
    // ----------------------------------------------------------------------------
    delete: async ({ params: { id } }) => {
      try {
        const [planModalityActivitySchoolProofChidlrenAttendance] = await db
          .select()
          .from(planModalityActivitySchoolProofChildrenAttendances)
          .where(eq(planModalityActivitySchoolProofChildrenAttendances.id, id));
        if (!planModalityActivitySchoolProofChidlrenAttendance) {
          return {
            status: 404,
            body: {
              message: `Unable to locate 'planModalityActivitySchoolProofChidlrenAttendance' with id (${id})`,
            },
          };
        }

        await db
          .delete(planModalityActivitySchoolProofChildrenAttendances)
          .where(eq(planModalityActivitySchoolProofChildrenAttendances.id, id));
        return { status: 200, body: planModalityActivitySchoolProofChidlrenAttendance };
      } catch (e) {
        return genTsRestErrorRes(e, {
          genericMsg: `Something went wrong deleting 'planModalityActivitySchoolProofChidlrenAttendance'.`,
        });
      }
    },
  }
);
