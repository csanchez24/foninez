import { db } from '@/server/db';
import { planModalities } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';

const paginate = createPaginator();

export const planModality = tsr.router(contract.planModality, {
  // ----------------------------------------------------
  // GET - /plan-modalities
  // ----------------------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(planModalities)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.planModalities.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(planModalities).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying planModalities.',
      });
    }
  },
  // ----------------------------------------------------
  // GET - /plan-modalities/{id}
  // ----------------------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const modality = await db.query.planModalities.findFirst({
        where: eq(planModalities.id, id),
        with: parseDrizzleFindUniqueQuery(planModalities)(query).with,
      });

      if (!modality) {
        return {
          status: 404,
          body: { message: `Unable to locate 'planModality' with id (${id})` },
        };
      }

      return { status: 200, body: modality };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting 'planModality' with id (${id}).`,
      });
    }
  },
  // ----------------------------------------------------
  // POST - /plan-modalities
  // ----------------------------------------------------
  create: async ({ body: { data } }) => {
    try {
      const newPlanModality = await db.transaction(async (tx) => {
        const [{ insertId: modalityId }] = await tx.insert(planModalities).values(data);
        return (await tx.select().from(planModalities).where(eq(planModalities.id, modalityId))).at(
          0
        );
      });

      if (!newPlanModality) {
        return { status: 400, body: { message: 'Failed to create `planModality`.' } };
      }

      return { status: 201, body: newPlanModality };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating 'planModality'.`,
      });
    }
  },
  // ----------------------------------------------------
  // PUT - /plan-modalities/{id}
  // ----------------------------------------------------
  update: async ({ params: { id }, body: { data } }) => {
    try {
      const updatedPlanModality = await db.transaction(async (tx) => {
        await tx.update(planModalities).set(data).where(eq(planModalities.id, id));
        return (await tx.select().from(planModalities).where(eq(planModalities.id, id))).at(0);
      });

      if (!updatedPlanModality) {
        return { status: 400, body: { message: 'Failed to update `planModality`.' } };
      }

      return { status: 200, body: updatedPlanModality };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating 'planModality'.`,
      });
    }
  },
  // ----------------------------------------------------
  // DELETE - /plan-modalities/{id}
  // ----------------------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [planModality] = await db
        .select()
        .from(planModalities)
        .where(eq(planModalities.id, id));
      if (!planModality) {
        return {
          status: 404,
          body: { message: `Unable to locate 'planModality' with id (${id})` },
        };
      }

      await db.delete(planModalities).where(eq(planModalities.id, id));
      return { status: 200, body: planModality };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong deleting 'planModality'.`,
      });
    }
  },
});
