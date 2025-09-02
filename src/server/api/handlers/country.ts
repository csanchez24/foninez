import { db } from '@/server/db';
import { countries } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';

const paginate = createPaginator();

export const country = tsr.router(contract.country, {
  // --------------------------------------
  // GET - /countries
  // --------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(countries)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.countries.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(countries).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying countries.',
      });
    }
  },
  // --------------------------------------
  // GET - /countries/{id}
  // --------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const country = await db.query.countries.findFirst({
        where: eq(countries.id, id),
        with: parseDrizzleFindUniqueQuery(countries)(query).with,
      });

      if (!country) {
        return { status: 404, body: { message: `Unable to locate country with id (${id})` } };
      }

      return { status: 200, body: country };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting country with id (${id}).`,
      });
    }
  },
  // --------------------------------------
  // POST - /countries
  // --------------------------------------
  create: async ({ body: { data } }) => {
    try {
      const newCountry = await db.transaction(async (tx) => {
        const [{ insertId: country }] = await tx.insert(countries).values(data);
        return (await tx.select().from(countries).where(eq(countries.id, country))).at(0);
      });

      if (!newCountry) {
        return { status: 400, body: { message: 'Failed to create country.' } };
      }

      return { status: 201, body: newCountry };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating country.`,
      });
    }
  },
  // --------------------------------------
  // PUT - /countries/{id}
  // --------------------------------------
  update: async ({ params: { id }, body: { data } }) => {
    try {
      const updatedCountry = await db.transaction(async (tx) => {
        await tx.update(countries).set(data).where(eq(countries.id, id));
        return (await tx.select().from(countries).where(eq(countries.id, id))).at(0);
      });

      if (!updatedCountry) {
        return { status: 400, body: { message: 'Failed to update country.' } };
      }

      return { status: 200, body: updatedCountry };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating country.`,
      });
    }
  },
  // --------------------------------------
  // DELETE - /countries/{id}
  // --------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [country] = await db.select().from(countries).where(eq(countries.id, id));
      if (!country) {
        return { status: 404, body: { message: `Unable to locate country with id (${id})` } };
      }

      await db.delete(countries).where(eq(countries.id, id));
      return { status: 200, body: country };
    } catch (e) {
      return genTsRestErrorRes(e, { genericMsg: `Something went wrong deleting country.` });
    }
  },
});
