import { db } from '@/server/db';
import { shifts } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';

const paginate = createPaginator();

export const shift = tsr.router(contract.shift, {
  // --------------------------------------
  // GET - /shifts
  // --------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(shifts)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.shifts.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(shifts).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying shifts.',
      });
    }
  },
  // --------------------------------------
  // GET - /shifts/{id}
  // --------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const shift = await db.query.shifts.findFirst({
        where: eq(shifts.id, id),
        with: parseDrizzleFindUniqueQuery(shifts)(query).with,
      });

      if (!shift) {
        return {
          status: 404,
          body: { message: `Unable to locate shift with id (${id})` },
        };
      }

      return { status: 200, body: shift };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting shift with id (${id}).`,
      });
    }
  },
  // --------------------------------------
  // POST - /shifts
  // --------------------------------------
  create: async ({ body: { data } }) => {
    try {
      const newShift = await db.transaction(async (tx) => {
        const [{ insertId: shift }] = await tx.insert(shifts).values(data);
        return (await tx.select().from(shifts).where(eq(shifts.id, shift))).at(0);
      });

      if (!newShift) {
        return { status: 400, body: { message: 'Failed to create shift.' } };
      }

      return { status: 201, body: newShift };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating shift.`,
      });
    }
  },
  // --------------------------------------
  // PUT - /shifts/{id}
  // --------------------------------------
  update: async ({ params: { id }, body: { data } }) => {
    try {
      const updatedShift = await db.transaction(async (tx) => {
        await tx.update(shifts).set(data).where(eq(shifts.id, id));
        return (await tx.select().from(shifts).where(eq(shifts.id, id))).at(0);
      });

      if (!updatedShift) {
        return { status: 400, body: { message: 'Failed to update shift.' } };
      }

      return { status: 200, body: updatedShift };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating shift.`,
      });
    }
  },
  // --------------------------------------
  // DELETE - /shifts/{id}
  // --------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [shift] = await db.select().from(shifts).where(eq(shifts.id, id));
      if (!shift) {
        return {
          status: 404,
          body: { message: `Unable to locate shift with id (${id})` },
        };
      }

      await db.delete(shifts).where(eq(shifts.id, id));
      return { status: 200, body: shift };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong deleting shift.`,
      });
    }
  },
});
