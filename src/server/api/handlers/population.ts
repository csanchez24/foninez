import { db } from '@/server/db';
import { populations } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';

const paginate = createPaginator();

export const population = tsr.router(contract.population, {
  // --------------------------------------
  // GET - /populations
  // --------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(populations)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.populations.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(populations).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying populations.',
      });
    }
  },
  // --------------------------------------
  // GET - /populations/{id}
  // --------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const population = await db.query.populations.findFirst({
        where: eq(populations.id, id),
        with: parseDrizzleFindUniqueQuery(populations)(query).with,
      });

      if (!population) {
        return {
          status: 404,
          body: { message: `Unable to locate population with id (${id})` },
        };
      }

      return { status: 200, body: population };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting population with id (${id}).`,
      });
    }
  },
  // --------------------------------------
  // POST - /populations
  // --------------------------------------
  create: async ({ body: { data } }) => {
    try {
      const newPopulation = await db.transaction(async (tx) => {
        const [{ insertId: population }] = await tx.insert(populations).values(data);
        return (await tx.select().from(populations).where(eq(populations.id, population))).at(0);
      });

      if (!newPopulation) {
        return { status: 400, body: { message: 'Failed to create population.' } };
      }

      return { status: 201, body: newPopulation };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating population.`,
      });
    }
  },
  // --------------------------------------
  // PUT - /populations/{id}
  // --------------------------------------
  update: async ({ params: { id }, body: { data } }) => {
    try {
      const updatedPopulation = await db.transaction(async (tx) => {
        await tx.update(populations).set(data).where(eq(populations.id, id));
        return (await tx.select().from(populations).where(eq(populations.id, id))).at(0);
      });

      if (!updatedPopulation) {
        return { status: 400, body: { message: 'Failed to update population.' } };
      }

      return { status: 200, body: updatedPopulation };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating population.`,
      });
    }
  },
  // --------------------------------------
  // DELETE - /populations/{id}
  // --------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [population] = await db.select().from(populations).where(eq(populations.id, id));
      if (!population) {
        return {
          status: 404,
          body: { message: `Unable to locate population with id (${id})` },
        };
      }

      await db.delete(populations).where(eq(populations.id, id));
      return { status: 200, body: population };
    } catch (e) {
      return genTsRestErrorRes(e, { genericMsg: `Something went wrong deleting population.` });
    }
  },
});
