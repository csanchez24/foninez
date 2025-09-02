import { db } from '@/server/db';
import { planModalityActivityResources } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';

const paginate = createPaginator();

export const planModalityActivityResource = tsr.router(contract.planModalityActivityResource, {
  // ----------------------------------------------------
  // GET - /plan-modality-activity-resources
  // ----------------------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(planModalityActivityResources)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.planModalityActivityResources.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(planModalityActivityResources).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying planModalityActivityResources.',
      });
    }
  },
  // ----------------------------------------------------
  // GET - /plan-modality-activity-resources/{id}
  // ----------------------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const planModalityActivityResource = await db.query.planModalityActivityResources.findFirst({
        where: eq(planModalityActivityResources.id, id),
        with: parseDrizzleFindUniqueQuery(planModalityActivityResources)(query).with,
      });

      if (!planModalityActivityResource) {
        return {
          status: 404,
          body: { message: `Unable to locate 'planModalityActivityResource' with id (${id})` },
        };
      }

      return { status: 200, body: planModalityActivityResource };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting 'planModalityActivityResource' with id (${id}).`,
      });
    }
  },
  // ----------------------------------------------------
  // POST - /plan-modality-activity-resources
  // ----------------------------------------------------
  create: async ({ body: { data } }) => {
    try {
      const newPlanModalityActivityResource = await db.transaction(async (tx) => {
        const [{ insertId }] = await tx.insert(planModalityActivityResources).values(data);
        return (
          await tx
            .select()
            .from(planModalityActivityResources)
            .where(eq(planModalityActivityResources.id, insertId))
        ).at(0);
      });

      if (!newPlanModalityActivityResource) {
        return {
          status: 400,
          body: { message: 'Failed to create `planModalityActivityResource`.' },
        };
      }

      return { status: 201, body: newPlanModalityActivityResource };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating 'planModalityActivityResource'.`,
      });
    }
  },
  // ----------------------------------------------------
  // PUT - /plan-modality-activity-resources/{id}
  // ----------------------------------------------------
  update: async ({ params: { id }, body: { data } }) => {
    try {
      const updatedPlanModalityActivityResource = await db.transaction(async (tx) => {
        await tx
          .update(planModalityActivityResources)
          .set(data)
          .where(eq(planModalityActivityResources.id, id));
        return (
          await tx
            .select()
            .from(planModalityActivityResources)
            .where(eq(planModalityActivityResources.id, id))
        ).at(0);
      });

      if (!updatedPlanModalityActivityResource) {
        return {
          status: 400,
          body: { message: 'Failed to update `planModalityActivityResource`.' },
        };
      }

      return { status: 200, body: updatedPlanModalityActivityResource };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating 'planModalityActivityResource'.`,
      });
    }
  },
  // ----------------------------------------------------
  // DELETE - /plan-modality-activity-resources/{id}
  // ----------------------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [planModalityActivityResource] = await db
        .select()
        .from(planModalityActivityResources)
        .where(eq(planModalityActivityResources.id, id));
      if (!planModalityActivityResource) {
        return {
          status: 404,
          body: { message: `Unable to locate 'planModalityActivityResource' with id (${id})` },
        };
      }

      await db.delete(planModalityActivityResources).where(eq(planModalityActivityResources.id, id));
      return { status: 200, body: planModalityActivityResource };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong deleting 'planModalityActivityResource'.`,
      });
    }
  },
});
