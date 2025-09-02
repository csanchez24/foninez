import { db } from '@/server/db';
import { states } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';

const paginate = createPaginator();

export const state = tsr.router(contract.state, {
  // --------------------------------------
  // GET - /states
  // --------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(states)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.states.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(states).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying states.',
      });
    }
  },
  // --------------------------------------
  // GET - /states/{id}
  // --------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const state = await db.query.states.findFirst({
        where: eq(states.id, id),
        with: parseDrizzleFindUniqueQuery(states)(query).with,
      });

      if (!state) {
        return { status: 404, body: { message: `Unable to locate state with id (${id})` } };
      }

      return { status: 200, body: state };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting state with id (${id}).`,
      });
    }
  },
  // --------------------------------------
  // POST - /states
  // --------------------------------------
  create: async ({ body: { data } }) => {
    try {
      const newState = await db.transaction(async (tx) => {
        const [{ insertId: state }] = await tx.insert(states).values(data);
        return (await tx.select().from(states).where(eq(states.id, state))).at(0);
      });

      if (!newState) {
        return { status: 400, body: { message: 'Failed to create state.' } };
      }

      return { status: 201, body: newState };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating state.`,
      });
    }
  },
  // --------------------------------------
  // PUT - /states/{id}
  // --------------------------------------
  update: async ({ params: { id }, body: { data } }) => {
    try {
      const updatedState = await db.transaction(async (tx) => {
        await tx.update(states).set(data).where(eq(states.id, id));
        return (await tx.select().from(states).where(eq(states.id, id))).at(0);
      });

      if (!updatedState) {
        return { status: 400, body: { message: 'Failed to update state.' } };
      }

      return { status: 200, body: updatedState };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating state.`,
      });
    }
  },
  // --------------------------------------
  // DELETE - /states/{id}
  // --------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [state] = await db.select().from(states).where(eq(states.id, id));
      if (!state) {
        return { status: 404, body: { message: `Unable to locate state with id (${id})` } };
      }

      await db.delete(states).where(eq(states.id, id));
      return { status: 200, body: state };
    } catch (e) {
      return genTsRestErrorRes(e, { genericMsg: `Something went wrong deleting state.` });
    }
  },
});
