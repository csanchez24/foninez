import { db } from '@/server/db';
import { ethnicities } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';

const paginate = createPaginator();

export const ethnicity = tsr.router(contract.ethnicity, {
  // --------------------------------------
  // GET - /ethnicities
  // --------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(ethnicities)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.ethnicities.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(ethnicities).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying ethnicities.',
      });
    }
  },
  // --------------------------------------
  // GET - /ethnicities/{id}
  // --------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const ethnicity = await db.query.ethnicities.findFirst({
        where: eq(ethnicities.id, id),
        with: parseDrizzleFindUniqueQuery(ethnicities)(query).with,
      });

      if (!ethnicity) {
        return {
          status: 404,
          body: { message: `Unable to locate ethnicity with id (${id})` },
        };
      }

      return { status: 200, body: ethnicity };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting ethnicity with id (${id}).`,
      });
    }
  },
  // --------------------------------------
  // POST - /ethnicities
  // --------------------------------------
  create: async ({ body: { data } }) => {
    try {
      const newEthnicity = await db.transaction(async (tx) => {
        const [{ insertId: ethnicity }] = await tx.insert(ethnicities).values(data);
        return (await tx.select().from(ethnicities).where(eq(ethnicities.id, ethnicity))).at(0);
      });

      if (!newEthnicity) {
        return { status: 400, body: { message: 'Failed to create ethnicity.' } };
      }

      return { status: 201, body: newEthnicity };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating ethnicity.`,
      });
    }
  },
  // --------------------------------------
  // PUT - /ethnicities/{id}
  // --------------------------------------
  update: async ({ params: { id }, body: { data } }) => {
    try {
      const updatedEthnicity = await db.transaction(async (tx) => {
        await tx.update(ethnicities).set(data).where(eq(ethnicities.id, id));
        return (await tx.select().from(ethnicities).where(eq(ethnicities.id, id))).at(0);
      });

      if (!updatedEthnicity) {
        return { status: 400, body: { message: 'Failed to update ethnicity.' } };
      }

      return { status: 200, body: updatedEthnicity };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating ethnicity.`,
      });
    }
  },
  // --------------------------------------
  // DELETE - /ethnicities/{id}
  // --------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [ethnicity] = await db.select().from(ethnicities).where(eq(ethnicities.id, id));
      if (!ethnicity) {
        return {
          status: 404,
          body: { message: `Unable to locate ethnicity with id (${id})` },
        };
      }

      await db.delete(ethnicities).where(eq(ethnicities.id, id));
      return { status: 200, body: ethnicity };
    } catch (e) {
      return genTsRestErrorRes(e, { genericMsg: `Something went wrong deleting ethnicity.` });
    }
  },
});
