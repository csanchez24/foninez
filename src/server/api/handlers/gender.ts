import { db } from '@/server/db';
import { genders } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';

const paginate = createPaginator();

export const gender = tsr.router(contract.gender, {
  // --------------------------------------
  // GET - /genders
  // --------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(genders)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.genders.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(genders).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying genders.',
      });
    }
  },
  // --------------------------------------
  // GET - /genders/{id}
  // --------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const gender = await db.query.genders.findFirst({
        where: eq(genders.id, id),
        with: parseDrizzleFindUniqueQuery(genders)(query).with,
      });

      if (!gender) {
        return { status: 404, body: { message: `Unable to locate gender with id (${id})` } };
      }

      return { status: 200, body: gender };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting gender with id (${id}).`,
      });
    }
  },
  // --------------------------------------
  // POST - /genders
  // --------------------------------------
  create: async ({ body: { data } }) => {
    try {
      const newGender = await db.transaction(async (tx) => {
        const [{ insertId: genderId }] = await tx.insert(genders).values(data);
        return (await tx.select().from(genders).where(eq(genders.id, genderId))).at(0);
      });

      if (!newGender) {
        return { status: 400, body: { message: 'Failed to create gender.' } };
      }

      return { status: 201, body: newGender };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating gender.`,
      });
    }
  },
  // --------------------------------------
  // PUT - /genders/{id}
  // --------------------------------------
  update: async ({ params: { id }, body: { data } }) => {
    try {
      const updatedGender = await db.transaction(async (tx) => {
        await tx.update(genders).set(data).where(eq(genders.id, id));
        return (await tx.select().from(genders).where(eq(genders.id, id))).at(0);
      });

      if (!updatedGender) {
        return { status: 400, body: { message: 'Failed to update gender.' } };
      }

      return { status: 200, body: updatedGender };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating gender.`,
      });
    }
  },
  // --------------------------------------
  // DELETE - /genders/{id}
  // --------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [gender] = await db.select().from(genders).where(eq(genders.id, id));
      if (!gender) {
        return { status: 404, body: { message: `Unable to locate gender with id (${id})` } };
      }

      await db.delete(genders).where(eq(genders.id, id));
      return { status: 200, body: gender };
    } catch (e) {
      return genTsRestErrorRes(e, { genericMsg: `Something went wrong deleting gender.` });
    }
  },
});
