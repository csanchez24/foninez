import { db } from '@/server/db';
import { inventories } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';

const paginate = createPaginator();

export const inventory = tsr.router(contract.inventory, {
  // --------------------------------------
  // GET - /inventories
  // --------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(inventories)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.inventories.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(inventories).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying inventories.',
      });
    }
  },
  // --------------------------------------
  // GET - /inventories/{id}
  // --------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const inventory = await db.query.inventories.findFirst({
        where: eq(inventories.id, id),
        with: parseDrizzleFindUniqueQuery(inventories)(query).with,
      });

      if (!inventory) {
        return {
          status: 404,
          body: { message: `Unable to locate inventory with id (${id})` },
        };
      }

      return { status: 200, body: inventory };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting inventory with id (${id}).`,
      });
    }
  },
  // --------------------------------------
  // POST - /inventories
  // --------------------------------------
  create: async ({ body: { data } }) => {
    try {
      const newInventory = await db.transaction(async (tx) => {
        const [{ insertId: inventoryId }] = await tx.insert(inventories).values(data);
        return (await tx.select().from(inventories).where(eq(inventories.id, inventoryId))).at(0);
      });

      if (!newInventory) {
        return { status: 400, body: { message: 'Failed to create inventory.' } };
      }

      return { status: 201, body: newInventory };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating inventory.`,
      });
    }
  },
  // --------------------------------------
  // PUT - /inventories/{id}
  // --------------------------------------
  update: async ({ params: { id }, body: { data } }) => {
    try {
      const updatedInventory = await db.transaction(async (tx) => {
        await tx.update(inventories).set(data).where(eq(inventories.id, id));
        return (await tx.select().from(inventories).where(eq(inventories.id, id))).at(0);
      });

      if (!updatedInventory) {
        return { status: 400, body: { message: 'Failed to update inventory.' } };
      }

      return { status: 200, body: updatedInventory };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating inventory.`,
      });
    }
  },
  // --------------------------------------
  // DELETE - /inventories/{id}
  // --------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [inventory] = await db.select().from(inventories).where(eq(inventories.id, id));
      if (!inventory) {
        return {
          status: 404,
          body: { message: `Unable to locate inventory with id (${id})` },
        };
      }

      await db.delete(inventories).where(eq(inventories.id, id));
      return { status: 200, body: inventory };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong deleting inventory.`,
      });
    }
  },
});
