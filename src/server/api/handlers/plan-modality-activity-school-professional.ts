import { db } from '@/server/db';
import { planModalityActivitySchoolProfessionals } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';

const paginate = createPaginator();

export const planModalityActivitySchoolProfessional = tsr.router(
  contract.planModalityActivitySchoolProfessional,
  {
    // -------------------------------------------------------------
    // GET - /plan-modality-activity-school-professionals
    // -------------------------------------------------------------
    findMany: async ({ query }) => {
      try {
        const q = parseDrizzleFindManyQuery(planModalityActivitySchoolProfessionals)(query);

        const body = await paginate({
          page: query.page,
          limit: query.limit,
          $transaction: ({ limit, offset }) =>
            db.transaction(async (tx) => {
              const a = await tx.query.planModalityActivitySchoolProfessionals.findMany({
                ...q,
                limit,
                offset,
              });
              const c = await tx.select({ count: sql<number>`count(*)` }).from(planModalityActivitySchoolProfessionals).where(q.where) // prettier-ignore
              return [a, c[0]!.count];
            }),
        });

        return { status: 200, body };
      } catch (e) {
        return genTsRestErrorRes(e, {
          genericMsg: 'Something went wrong querying `planModalityActivitySchoolProfessionals`.',
        });
      }
    },
    // -------------------------------------------------------------
    // GET - /plan-modality-activity-school-professionals/{id}
    // -------------------------------------------------------------
    findUnique: async ({ params: { id }, query }) => {
      try {
        const planModalityActivitySchoolProfessional =
          await db.query.planModalityActivitySchoolProfessionals.findFirst({
            where: eq(planModalityActivitySchoolProfessionals.id, id),
            with: parseDrizzleFindUniqueQuery(planModalityActivitySchoolProfessionals)(query).with,
          });

        if (!planModalityActivitySchoolProfessional) {
          return {
            status: 404,
            body: {
              message: `Unable to locate 'planModalityActivitySchoolProfessional' with id (${id})`,
            },
          };
        }

        return { status: 200, body: planModalityActivitySchoolProfessional };
      } catch (e) {
        return genTsRestErrorRes(e, {
          genericMsg: `Something went wrong getting 'planModalityActivitySchoolProfessional' with id (${id}).`,
        });
      }
    },
    // -------------------------------------------------------------
    // POST - /plan-modality-activity-school-professionals
    // -------------------------------------------------------------
    create: async ({ body: { data } }) => {
      try {
        const newPlanModalityActivitySchoolProfessional = await db.transaction(async (tx) => {
          const [{ insertId }] = await tx
            .insert(planModalityActivitySchoolProfessionals)
            .values(data);
          return (
            await tx
              .select()
              .from(planModalityActivitySchoolProfessionals)
              .where(eq(planModalityActivitySchoolProfessionals.id, insertId))
          ).at(0);
        });

        if (!newPlanModalityActivitySchoolProfessional) {
          return {
            status: 400,
            body: { message: 'Failed to create `planModalityActivitySchoolProfessional`.' },
          };
        }

        return { status: 201, body: newPlanModalityActivitySchoolProfessional };
      } catch (e) {
        return genTsRestErrorRes(e, {
          genericMsg: `Something went wrong creating 'planModalityActivitySchoolProfessional'.`,
        });
      }
    },
    // -------------------------------------------------------------
    // PUT - /plan-modality-activity-school-professionals/{id}
    // -------------------------------------------------------------
    update: async ({ params: { id }, body: { data } }) => {
      try {
        const updatedPlanModalityActivitySchoolProfessional = await db.transaction(async (tx) => {
          await tx
            .update(planModalityActivitySchoolProfessionals)
            .set(data)
            .where(eq(planModalityActivitySchoolProfessionals.id, id));
          return (
            await tx
              .select()
              .from(planModalityActivitySchoolProfessionals)
              .where(eq(planModalityActivitySchoolProfessionals.id, id))
          ).at(0);
        });

        if (!updatedPlanModalityActivitySchoolProfessional) {
          return {
            status: 400,
            body: { message: 'Failed to update `planModalityActivitySchoolProfessional`.' },
          };
        }

        return { status: 200, body: updatedPlanModalityActivitySchoolProfessional };
      } catch (e) {
        return genTsRestErrorRes(e, {
          genericMsg: `Something went wrong updating 'planModalityActivitySchoolProfessional'.`,
        });
      }
    },
    // -------------------------------------------------------------
    // DELETE - /plan-modality-activity-school-professionals/{id}
    // -------------------------------------------------------------
    delete: async ({ params: { id } }) => {
      try {
        const [planModalityActivitySchoolProfessional] = await db
          .select()
          .from(planModalityActivitySchoolProfessionals)
          .where(eq(planModalityActivitySchoolProfessionals.id, id));
        if (!planModalityActivitySchoolProfessional) {
          return {
            status: 404,
            body: {
              message: `Unable to locate 'planModalityActivitySchoolProfessional' with id (${id})`,
            },
          };
        }

        await db
          .delete(planModalityActivitySchoolProfessionals)
          .where(eq(planModalityActivitySchoolProfessionals.id, id));
        return { status: 200, body: planModalityActivitySchoolProfessional };
      } catch (e) {
        return genTsRestErrorRes(e, {
          genericMsg: `Something went wrong deleting 'planModalityActivitySchoolProfessional'.`,
        });
      }
    },
  }
);
