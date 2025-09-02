import { db } from '@/server/db';
import { identifications } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';

const paginate = createPaginator();

export const identification = tsr.router(contract.identification, {
  // --------------------------------------
  // GET - /identifications
  // --------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(identifications)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.identifications.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(identifications).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying identifications.',
      });
    }
  },
  // --------------------------------------
  // GET - /identifications/{id}
  // --------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const identification = await db.query.identifications.findFirst({
        where: eq(identifications.id, id),
        with: parseDrizzleFindUniqueQuery(identifications)(query).with,
      });

      if (!identification) {
        return {
          status: 404,
          body: { message: `Unable to locate identification with id (${id})` },
        };
      }

      return { status: 200, body: identification };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting identification with id (${id}).`,
      });
    }
  },
  // --------------------------------------
  // POST - /identifications
  // --------------------------------------
  create: async ({ body: { data } }) => {
    try {
      const newIdentification = await db.transaction(async (tx) => {
        const [{ insertId: identificationId }] = await tx.insert(identifications).values(data);
        return (
          await tx.select().from(identifications).where(eq(identifications.id, identificationId))
        ).at(0);
      });

      if (!newIdentification) {
        return { status: 400, body: { message: 'Failed to create identification.' } };
      }

      return { status: 201, body: newIdentification };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating identification.`,
      });
    }
  },
  // --------------------------------------
  // PUT - /identifications/{id}
  // --------------------------------------
  update: async ({ params: { id }, body: { data } }) => {
    try {
      const updatedIdentification = await db.transaction(async (tx) => {
        await tx.update(identifications).set(data).where(eq(identifications.id, id));
        return (await tx.select().from(identifications).where(eq(identifications.id, id))).at(0);
      });

      if (!updatedIdentification) {
        return { status: 400, body: { message: 'Failed to update identification.' } };
      }

      return { status: 200, body: updatedIdentification };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating identification.`,
      });
    }
  },
  // --------------------------------------
  // DELETE - /identifications/{id}
  // --------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [identification] = await db
        .select()
        .from(identifications)
        .where(eq(identifications.id, id));
      if (!identification) {
        return {
          status: 404,
          body: { message: `Unable to locate identification with id (${id})` },
        };
      }

      await db.delete(identifications).where(eq(identifications.id, id));
      return { status: 200, body: identification };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong deleting identification.`,
      });
    }
  },
});
