import { db } from '@/server/db';
import { indigenousCommunities } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';

const paginate = createPaginator();

export const indigenousCommunity = tsr.router(contract.indigenousCommunity, {
  // --------------------------------------
  // GET - /indigenousCommunities
  // --------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(indigenousCommunities)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.indigenousCommunities.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(indigenousCommunities).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying indigenousCommunities.',
      });
    }
  },
  // --------------------------------------
  // GET - /indigenousCommunities/{id}
  // --------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const indigenousCommunity = await db.query.indigenousCommunities.findFirst({
        where: eq(indigenousCommunities.id, id),
        with: parseDrizzleFindUniqueQuery(indigenousCommunities)(query).with,
      });

      if (!indigenousCommunity) {
        return {
          status: 404,
          body: { message: `Unable to locate indigenousCommunity with id (${id})` },
        };
      }

      return { status: 200, body: indigenousCommunity };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting indigenousCommunity with id (${id}).`,
      });
    }
  },
  // --------------------------------------
  // POST - /indigenousCommunities
  // --------------------------------------
  create: async ({ body: { data } }) => {
    try {
      const newIndigenousCommunity = await db.transaction(async (tx) => {
        const [{ insertId: indigenousCommunity }] = await tx
          .insert(indigenousCommunities)
          .values(data);
        return (
          await tx
            .select()
            .from(indigenousCommunities)
            .where(eq(indigenousCommunities.id, indigenousCommunity))
        ).at(0);
      });

      if (!newIndigenousCommunity) {
        return { status: 400, body: { message: 'Failed to create indigenousCommunity.' } };
      }

      return { status: 201, body: newIndigenousCommunity };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating indigenousCommunity.`,
      });
    }
  },
  // --------------------------------------
  // PUT - /indigenousCommunities/{id}
  // --------------------------------------
  update: async ({ params: { id }, body: { data } }) => {
    try {
      const updatedIndigenousCommunity = await db.transaction(async (tx) => {
        await tx.update(indigenousCommunities).set(data).where(eq(indigenousCommunities.id, id));
        return (
          await tx.select().from(indigenousCommunities).where(eq(indigenousCommunities.id, id))
        ).at(0);
      });

      if (!updatedIndigenousCommunity) {
        return { status: 400, body: { message: 'Failed to update indigenousCommunity.' } };
      }

      return { status: 200, body: updatedIndigenousCommunity };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating indigenousCommunity.`,
      });
    }
  },
  // --------------------------------------
  // DELETE - /indigenousCommunities/{id}
  // --------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [indigenousCommunity] = await db
        .select()
        .from(indigenousCommunities)
        .where(eq(indigenousCommunities.id, id));
      if (!indigenousCommunity) {
        return {
          status: 404,
          body: { message: `Unable to locate indigenousCommunity with id (${id})` },
        };
      }

      await db.delete(indigenousCommunities).where(eq(indigenousCommunities.id, id));
      return { status: 200, body: indigenousCommunity };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong deleting indigenousCommunity.`,
      });
    }
  },
});
