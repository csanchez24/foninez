import { db } from '@/server/db';
import { plans } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';

const paginate = createPaginator();

export const plan = tsr.router(contract.plan, {
  // ----------------------------------------------------
  // GET - /plans
  // ----------------------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(plans)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.plans.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(plans).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying plans.',
      });
    }
  },
  // ----------------------------------------------------
  // GET - /plans/{id}
  // ----------------------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const plan = await db.query.plans.findFirst({
        where: eq(plans.id, id),
        with: parseDrizzleFindUniqueQuery(plans)(query).with,
      });

      if (!plan) {
        return {
          status: 404,
          body: { message: `Unable to locate 'plan' with id (${id})` },
        };
      }

      return { status: 200, body: plan };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting 'plan' with id (${id}).`,
      });
    }
  },
  // ----------------------------------------------------
  // POST - /plans
  // ----------------------------------------------------
  create: async ({ body: { data } }) => {
    try {
      const newPlan = await db.transaction(async (tx) => {
        const [{ insertId }] = await tx.insert(plans).values(data);
        return (await tx.select().from(plans).where(eq(plans.id, insertId))).at(0);
      });

      if (!newPlan) {
        return { status: 400, body: { message: 'Failed to create `plan`.' } };
      }

      return { status: 201, body: newPlan };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating 'plan'.`,
      });
    }
  },
  // ----------------------------------------------------
  // PUT - /plans/{id}
  // ----------------------------------------------------
  update: async ({ params: { id }, body: { data } }) => {
    try {
      const updatedPlan = await db.transaction(async (tx) => {
        await tx.update(plans).set(data).where(eq(plans.id, id));
        return (await tx.select().from(plans).where(eq(plans.id, id))).at(0);
      });

      if (!updatedPlan) {
        return { status: 400, body: { message: 'Failed to update `plan`.' } };
      }

      return { status: 200, body: updatedPlan };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating 'plan'.`,
      });
    }
  },
  // ----------------------------------------------------
  // PATCH - /plans/{id}/status
  // ----------------------------------------------------
  updateStatus: async ({ params: { id }, body: { data } }) => {
    try {
      const [updatedPlan] = await db.transaction(async (tx) => {
        await tx.update(plans).set(data).where(eq(plans.id, id));
        return await tx.select().from(plans).where(eq(plans.id, id));
      });

      if (!updatedPlan) {
        return { status: 400, body: { message: 'Failed to update status.' } };
      }

      return { status: 200, body: updatedPlan };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating 'plan'.`,
      });
    }
  },
  // ----------------------------------------------------
  // DELETE - /plans/{id}
  // ----------------------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [plan] = await db.select().from(plans).where(eq(plans.id, id));
      if (!plan) {
        return {
          status: 404,
          body: { message: `Unable to locate 'plan' with id (${id})` },
        };
      }

      await db.delete(plans).where(eq(plans.id, id));
      return { status: 200, body: plan };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong deleting 'plan'.`,
      });
    }
  },
});
