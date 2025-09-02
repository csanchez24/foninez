import { db } from '@/server/db';
import {
  planModalityActivitySchoolResources,
  planModalityActivitySchools,
} from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { and, eq, ne, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';

const paginate = createPaginator();

export const planModalityActivitySchoolResource = tsr.router(
  contract.planModalityActivitySchoolResource,
  {
    // ----------------------------------------------------
    // GET - /plan-modality-activity-school-resources
    // ----------------------------------------------------
    findMany: async ({ query }) => {
      try {
        const q = parseDrizzleFindManyQuery(planModalityActivitySchoolResources)(query);

        const body = await paginate({
          page: query.page,
          limit: query.limit,
          $transaction: ({ limit, offset }) =>
            db.transaction(async (tx) => {
              const a = await tx.query.planModalityActivitySchoolResources.findMany({
                ...q,
                limit,
                offset,
              });
              const c = await tx.select({ count: sql<number>`count(*)` }).from(planModalityActivitySchoolResources).where(q.where) // prettier-ignore
              return [a, c[0]!.count];
            }),
        });

        return { status: 200, body };
      } catch (e) {
        return genTsRestErrorRes(e, {
          genericMsg: 'Something went wrong querying `planModalityActivitySchoolResources`.',
        });
      }
    },
    // ----------------------------------------------------
    // GET - /plan-modality-activity-school-resources/{id}
    // ----------------------------------------------------
    findUnique: async ({ params: { id }, query }) => {
      try {
        const planModalityActivitySchoolResource =
          await db.query.planModalityActivitySchoolResources.findFirst({
            where: eq(planModalityActivitySchoolResources.id, id),
            with: parseDrizzleFindUniqueQuery(planModalityActivitySchoolResources)(query).with,
          });

        if (!planModalityActivitySchoolResource) {
          return {
            status: 404,
            body: {
              message: `Unable to locate 'planModalityActivitySchoolResource' with id (${id})`,
            },
          };
        }

        return { status: 200, body: planModalityActivitySchoolResource };
      } catch (e) {
        return genTsRestErrorRes(e, {
          genericMsg: `Something went wrong getting 'planModalityActivitySchoolResource' with id (${id}).`,
        });
      }
    },
    // ----------------------------------------------------
    // POST - /plan-modality-activity-school-resources
    // ----------------------------------------------------
    create: async ({ body: { data } }) => {
      try {
        const newPlanModalityActivitySchoolResource = await db.transaction(async (tx) => {
          const [{ insertId }] = await tx.insert(planModalityActivitySchoolResources).values(data);
          return (
            await tx
              .select()
              .from(planModalityActivitySchoolResources)
              .where(eq(planModalityActivitySchoolResources.id, insertId))
          ).at(0);
        });

        if (!newPlanModalityActivitySchoolResource) {
          return {
            status: 400,
            body: { message: 'Failed to create `planModalityActivitySchoolResource`.' },
          };
        }

        return { status: 201, body: newPlanModalityActivitySchoolResource };
      } catch (e) {
        return genTsRestErrorRes(e, {
          genericMsg: `Something went wrong creating 'planModalityActivitySchoolResource'.`,
        });
      }
    },
    // ----------------------------------------------------
    // PUT - /plan-modality-activity-school-resources/{id}
    // ----------------------------------------------------
    update: async ({ params: { id }, body: { data } }) => {
      try {
        const updatedPlanModalityActivitySchoolResource = await db.transaction(async (tx) => {
          await tx
            .update(planModalityActivitySchoolResources)
            .set(data)
            .where(eq(planModalityActivitySchoolResources.id, id));
          return (
            await tx
              .select()
              .from(planModalityActivitySchoolResources)
              .where(eq(planModalityActivitySchoolResources.id, id))
          ).at(0);
        });

        if (!updatedPlanModalityActivitySchoolResource) {
          return {
            status: 400,
            body: { message: 'Failed to update `planModalityActivitySchoolResource`.' },
          };
        }

        return { status: 200, body: updatedPlanModalityActivitySchoolResource };
      } catch (e) {
        return genTsRestErrorRes(e, {
          genericMsg: `Something went wrong updating 'planModalityActivitySchoolResource'.`,
        });
      }
    },
    // ----------------------------------------------------
    // PUT - /plan-modality-activity-school-resources/{id}
    // ----------------------------------------------------
    updateMass: async ({ body: { data } }) => {
      try {
        await db.transaction(async (tx) => {
          for (const row of data) {
            await tx
              .update(planModalityActivitySchoolResources)
              .set(row)
              .where(eq(planModalityActivitySchoolResources.id, row.id));
          }
          const firstRow = data.at(0);
          const [planModalityActivitySchoolResource] = await tx
            .select()
            .from(planModalityActivitySchoolResources)
            .where(
              and(
                eq(
                  planModalityActivitySchoolResources.planModalityActivitySchoolId,
                  firstRow?.planModalityActivitySchoolId ?? 0
                ),
                ne(
                  planModalityActivitySchoolResources.resourcesQty,
                  planModalityActivitySchoolResources.resourcesReceivedQty
                )
              )
            );
          if (!planModalityActivitySchoolResource) {
            await tx
              .update(planModalityActivitySchools)
              .set({ status: 'confirmed_resources' })
              .where(
                eq(planModalityActivitySchools.id, firstRow?.planModalityActivitySchoolId ?? 0)
              );
          }
        });
        return { status: 200, body: null };
      } catch (e) {
        return genTsRestErrorRes(e, {
          genericMsg: `Something went wrong updating 'planModalityActivitySchoolResource'.`,
        });
      }
    },
    // ----------------------------------------------------
    // DELETE - /plan-modality-activity-school-resources/{id}
    // ----------------------------------------------------
    delete: async ({ params: { id } }) => {
      try {
        const [planModalityActivitySchoolResource] = await db
          .select()
          .from(planModalityActivitySchoolResources)
          .where(eq(planModalityActivitySchoolResources.id, id));
        if (!planModalityActivitySchoolResource) {
          return {
            status: 404,
            body: {
              message: `Unable to locate 'planModalityActivitySchoolResource' with id (${id})`,
            },
          };
        }

        await db
          .delete(planModalityActivitySchoolResources)
          .where(eq(planModalityActivitySchoolResources.id, id));
        return { status: 200, body: planModalityActivitySchoolResource };
      } catch (e) {
        return genTsRestErrorRes(e, {
          genericMsg: `Something went wrong deleting 'planModalityActivitySchoolResource'.`,
        });
      }
    },
  }
);
