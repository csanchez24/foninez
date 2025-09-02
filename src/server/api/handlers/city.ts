import { db } from '@/server/db';
import { cities } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';

const paginate = createPaginator();

export const city = tsr.router(contract.city, {
  // --------------------------------------
  // GET - /cities
  // --------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(cities)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.cities.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(cities).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying cities.',
      });
    }
  },
  // --------------------------------------
  // GET - /cities/{id}
  // --------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const city = await db.query.cities.findFirst({
        where: eq(cities.id, id),
        with: parseDrizzleFindUniqueQuery(cities)(query).with,
      });

      if (!city) {
        return { status: 404, body: { message: `Unable to locate city with id (${id})` } };
      }

      return { status: 200, body: city };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting city with id (${id}).`,
      });
    }
  },
  // --------------------------------------
  // POST - /cities
  // --------------------------------------
  create: async ({ body: { data } }) => {
    try {
      const newCity = await db.transaction(async (tx) => {
        const [{ insertId: cityId }] = await tx.insert(cities).values(data);
        return (await tx.select().from(cities).where(eq(cities.id, cityId))).at(0);
      });

      if (!newCity) {
        return { status: 400, body: { message: 'Failed to create city.' } };
      }

      return { status: 201, body: newCity };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating city.`,
      });
    }
  },
  // --------------------------------------
  // PUT - /cities/{id}
  // --------------------------------------
  update: async ({ params: { id }, body: { data } }) => {
    try {
      const updatedCity = await db.transaction(async (tx) => {
        await tx.update(cities).set(data).where(eq(cities.id, id));
        return (await tx.select().from(cities).where(eq(cities.id, id))).at(0);
      });

      if (!updatedCity) {
        return { status: 400, body: { message: 'Failed to update city.' } };
      }

      return { status: 200, body: updatedCity };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating city.`,
      });
    }
  },
  // --------------------------------------
  // DELETE - /cities/{id}
  // --------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [city] = await db.select().from(cities).where(eq(cities.id, id));
      if (!city) {
        return { status: 404, body: { message: `Unable to locate city with id (${id})` } };
      }

      await db.delete(cities).where(eq(cities.id, id));
      return { status: 200, body: city };
    } catch (e) {
      return genTsRestErrorRes(e, { genericMsg: `Something went wrong deleting city.` });
    }
  },
});
