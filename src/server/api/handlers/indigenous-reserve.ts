import { db } from '@/server/db';
import { indigenousReserves } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';

const paginate = createPaginator();

export const indigenousReserve = tsr.router(contract.indigenousReserve, {
  // --------------------------------------
  // GET - /indigenousReserves
  // --------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(indigenousReserves)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.indigenousReserves.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(indigenousReserves).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying indigenousReserves.',
      });
    }
  },
  // --------------------------------------
  // GET - /indigenousReserves/{id}
  // --------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const indigenousReserve = await db.query.indigenousReserves.findFirst({
        where: eq(indigenousReserves.id, id),
        with: parseDrizzleFindUniqueQuery(indigenousReserves)(query).with,
      });

      if (!indigenousReserve) {
        return {
          status: 404,
          body: { message: `Unable to locate indigenousReserve with id (${id})` },
        };
      }

      return { status: 200, body: indigenousReserve };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting indigenousReserve with id (${id}).`,
      });
    }
  },
  // --------------------------------------
  // POST - /indigenousReserves
  // --------------------------------------
  create: async ({ body: { data } }) => {
    try {
      const newIndigenousReserve = await db.transaction(async (tx) => {
        const [{ insertId: indigenousReserve }] = await tx.insert(indigenousReserves).values(data);
        return (
          await tx
            .select()
            .from(indigenousReserves)
            .where(eq(indigenousReserves.id, indigenousReserve))
        ).at(0);
      });

      if (!newIndigenousReserve) {
        return { status: 400, body: { message: 'Failed to create indigenousReserve.' } };
      }

      return { status: 201, body: newIndigenousReserve };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating indigenousReserve.`,
      });
    }
  },
  // --------------------------------------
  // PUT - /indigenousReserves/{id}
  // --------------------------------------
  update: async ({ params: { id }, body: { data } }) => {
    try {
      const updatedIndigenousReserve = await db.transaction(async (tx) => {
        await tx.update(indigenousReserves).set(data).where(eq(indigenousReserves.id, id));
        return (await tx.select().from(indigenousReserves).where(eq(indigenousReserves.id, id))).at(
          0
        );
      });

      if (!updatedIndigenousReserve) {
        return { status: 400, body: { message: 'Failed to update indigenousReserve.' } };
      }

      return { status: 200, body: updatedIndigenousReserve };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating indigenousReserve.`,
      });
    }
  },
  // --------------------------------------
  // DELETE - /indigenousReserves/{id}
  // --------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [indigenousReserve] = await db
        .select()
        .from(indigenousReserves)
        .where(eq(indigenousReserves.id, id));
      if (!indigenousReserve) {
        return {
          status: 404,
          body: { message: `Unable to locate indigenousReserve with id (${id})` },
        };
      }

      await db.delete(indigenousReserves).where(eq(indigenousReserves.id, id));
      return { status: 200, body: indigenousReserve };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong deleting indigenousReserve.`,
      });
    }
  },
});
