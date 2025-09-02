import { db } from '@/server/db';
import { modalityTypes } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';

const paginate = createPaginator();

export const modalityType = tsr.router(contract.modalityType, {
  // --------------------------------------
  // GET - /modalityTypes
  // --------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(modalityTypes)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.modalityTypes.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(modalityTypes).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying modalityTypes.',
      });
    }
  },
  // --------------------------------------
  // GET - /modalityTypes/{id}
  // --------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const modalityType = await db.query.modalityTypes.findFirst({
        where: eq(modalityTypes.id, id),
        with: parseDrizzleFindUniqueQuery(modalityTypes)(query).with,
      });

      if (!modalityType) {
        return {
          status: 404,
          body: { message: `Unable to locate modalityType with id (${id})` },
        };
      }

      return { status: 200, body: modalityType };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting modalityType with id (${id}).`,
      });
    }
  },
  // --------------------------------------
  // POST - /modalityTypes
  // --------------------------------------
  create: async ({ body: { data } }) => {
    try {
      const newModalityType = await db.transaction(async (tx) => {
        const [{ insertId: modalityTypeId }] = await tx.insert(modalityTypes).values(data);
        return (
          await tx.select().from(modalityTypes).where(eq(modalityTypes.id, modalityTypeId))
        ).at(0);
      });

      if (!newModalityType) {
        return { status: 400, body: { message: 'Failed to create modalityType.' } };
      }

      return { status: 201, body: newModalityType };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating modalityType.`,
      });
    }
  },
  // --------------------------------------
  // PUT - /modalityTypes/{id}
  // --------------------------------------
  update: async ({ params: { id }, body: { data } }) => {
    try {
      const updatedModalityType = await db.transaction(async (tx) => {
        await tx.update(modalityTypes).set(data).where(eq(modalityTypes.id, id));
        return (await tx.select().from(modalityTypes).where(eq(modalityTypes.id, id))).at(0);
      });

      if (!updatedModalityType) {
        return { status: 400, body: { message: 'Failed to update modalityType.' } };
      }

      return { status: 200, body: updatedModalityType };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating modalityType.`,
      });
    }
  },
  // --------------------------------------
  // DELETE - /modalityTypes/{id}
  // --------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [modalityType] = await db.select().from(modalityTypes).where(eq(modalityTypes.id, id));
      if (!modalityType) {
        return {
          status: 404,
          body: { message: `Unable to locate modalityType with id (${id})` },
        };
      }

      await db.delete(modalityTypes).where(eq(modalityTypes.id, id));
      return { status: 200, body: modalityType };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong deleting modalityType.`,
      });
    }
  },
});
