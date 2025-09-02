import { db } from '@/server/db';
import { inventoryTransactionLines } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';

const paginate = createPaginator();

export const inventoryTransactionLine = tsr.router(contract.inventoryTransactionLine, {
  // --------------------------------------
  // GET - /inventory-transaction-lines
  // --------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(inventoryTransactionLines)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.inventoryTransactionLines.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(inventoryTransactionLines).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying inventoryTransactionLines.',
      });
    }
  },
  // --------------------------------------
  // GET - /inventory-transaction-lines/{id}
  // --------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const inventoryTransactionLine = await db.query.inventoryTransactionLines.findFirst({
        where: eq(inventoryTransactionLines.id, id),
        with: parseDrizzleFindUniqueQuery(inventoryTransactionLines)(query).with,
      });

      if (!inventoryTransactionLine) {
        return {
          status: 404,
          body: { message: `Unable to locate inventoryTransactionLine with id (${id})` },
        };
      }

      return { status: 200, body: inventoryTransactionLine };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting inventoryTransactionLine with id (${id}).`,
      });
    }
  },
  // --------------------------------------
  // POST - /inventory-transaction-lines
  // --------------------------------------
  create: async ({ body: { data } }) => {
    try {
      const newInventoryTransactionLine = await db.transaction(async (tx) => {
        const [{ insertId: inventoryTransactionLineId }] = await tx
          .insert(inventoryTransactionLines)
          .values(data);
        return (
          await tx
            .select()
            .from(inventoryTransactionLines)
            .where(eq(inventoryTransactionLines.id, inventoryTransactionLineId))
        ).at(0);
      });

      if (!newInventoryTransactionLine) {
        return { status: 400, body: { message: 'Failed to create inventoryTransactionLine.' } };
      }

      return { status: 201, body: newInventoryTransactionLine };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating inventoryTransactionLine.`,
      });
    }
  },
  // --------------------------------------
  // PUT - /inventory-transaction-lines/{id}
  // --------------------------------------
  update: async ({ params: { id }, body: { data } }) => {
    try {
      const updatedInventoryTransactionLine = await db.transaction(async (tx) => {
        await tx
          .update(inventoryTransactionLines)
          .set(data)
          .where(eq(inventoryTransactionLines.id, id));
        return (
          await tx
            .select()
            .from(inventoryTransactionLines)
            .where(eq(inventoryTransactionLines.id, id))
        ).at(0);
      });

      if (!updatedInventoryTransactionLine) {
        return { status: 400, body: { message: 'Failed to update inventoryTransactionLine.' } };
      }

      return { status: 200, body: updatedInventoryTransactionLine };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating inventoryTransactionLine.`,
      });
    }
  },
  // --------------------------------------
  // DELETE - /inventory-transaction-lines/{id}
  // --------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [inventoryTransactionLine] = await db
        .select()
        .from(inventoryTransactionLines)
        .where(eq(inventoryTransactionLines.id, id));
      if (!inventoryTransactionLine) {
        return {
          status: 404,
          body: { message: `Unable to locate inventoryTransactionLine with id (${id})` },
        };
      }

      await db.delete(inventoryTransactionLines).where(eq(inventoryTransactionLines.id, id));
      return { status: 200, body: inventoryTransactionLine };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong deleting inventoryTransactionLine.`,
      });
    }
  },
});
