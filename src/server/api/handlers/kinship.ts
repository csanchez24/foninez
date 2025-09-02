import { db } from '@/server/db';
import { kinships } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';

const paginate = createPaginator();

export const kinship = tsr.router(contract.kinship, {
  // --------------------------------------
  // GET - /kinships
  // --------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(kinships)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.kinships.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(kinships).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying kinships.',
      });
    }
  },
  // --------------------------------------
  // GET - /kinships/{id}
  // --------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const kinship = await db.query.kinships.findFirst({
        where: eq(kinships.id, id),
        with: parseDrizzleFindUniqueQuery(kinships)(query).with,
      });

      if (!kinship) {
        return {
          status: 404,
          body: { message: `Unable to locate kinship with id (${id})` },
        };
      }

      return { status: 200, body: kinship };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting kinship with id (${id}).`,
      });
    }
  },
  // --------------------------------------
  // POST - /kinships
  // --------------------------------------
  create: async ({ body: { data } }) => {
    try {
      const newKinship = await db.transaction(async (tx) => {
        const [{ insertId: kinshipId }] = await tx.insert(kinships).values(data);
        return (await tx.select().from(kinships).where(eq(kinships.id, kinshipId))).at(0);
      });

      if (!newKinship) {
        return { status: 400, body: { message: 'Failed to create kinship.' } };
      }

      return { status: 201, body: newKinship };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating kinship.`,
      });
    }
  },
  // --------------------------------------
  // PUT - /kinships/{id}
  // --------------------------------------
  update: async ({ params: { id }, body: { data } }) => {
    try {
      const updatedKinship = await db.transaction(async (tx) => {
        await tx.update(kinships).set(data).where(eq(kinships.id, id));
        return (await tx.select().from(kinships).where(eq(kinships.id, id))).at(0);
      });

      if (!updatedKinship) {
        return { status: 400, body: { message: 'Failed to update kinship.' } };
      }

      return { status: 200, body: updatedKinship };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating kinship.`,
      });
    }
  },
  // --------------------------------------
  // DELETE - /kinships/{id}
  // --------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [kinship] = await db.select().from(kinships).where(eq(kinships.id, id));
      if (!kinship) {
        return {
          status: 404,
          body: { message: `Unable to locate kinship with id (${id})` },
        };
      }

      await db.delete(kinships).where(eq(kinships.id, id));
      return { status: 200, body: kinship };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong deleting kinship.`,
      });
    }
  },
});
