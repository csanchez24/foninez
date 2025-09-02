import { db } from '@/server/db';
import { resourcesToSuppliers } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';

const paginate = createPaginator();

export const resourceToSupplier = tsr.router(contract.resourceToSupplier, {
  // ----------------------------------------------------
  // GET - /resources
  // ----------------------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(resourcesToSuppliers)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.resourcesToSuppliers.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(resourcesToSuppliers).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying resources.',
      });
    }
  },
  // ----------------------------------------------------
  // GET - /resources/{id}
  // ----------------------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const resource = await db.query.resourcesToSuppliers.findFirst({
        where: eq(resourcesToSuppliers.id, id),
        with: parseDrizzleFindUniqueQuery(resourcesToSuppliers)(query).with,
      });

      if (!resource) {
        return {
          status: 404,
          body: { message: `Unable to locate 'resource' with id (${id})` },
        };
      }

      return { status: 200, body: resource };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting 'resource' with id (${id}).`,
      });
    }
  },
  // ----------------------------------------------------
  // POST - /resources
  // ----------------------------------------------------
  create: async ({ body: { data } }) => {
    try {
      const newResourceToSupplier = await db.transaction(async (tx) => {
        const [{ insertId }] = await tx.insert(resourcesToSuppliers).values(data);
        return (
          await tx.select().from(resourcesToSuppliers).where(eq(resourcesToSuppliers.id, insertId))
        ).at(0);
      });

      if (!newResourceToSupplier) {
        return { status: 400, body: { message: 'Failed to create `resource`.' } };
      }

      return { status: 201, body: newResourceToSupplier };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating 'resource'.`,
      });
    }
  },
  // ----------------------------------------------------
  // PUT - /resources/{id}
  // ----------------------------------------------------
  update: async ({ params: { id }, body: { data } }) => {
    try {
      const updatedResourceToSupplier = await db.transaction(async (tx) => {
        await tx.update(resourcesToSuppliers).set(data).where(eq(resourcesToSuppliers.id, id));
        return (
          await tx.select().from(resourcesToSuppliers).where(eq(resourcesToSuppliers.id, id))
        ).at(0);
      });

      if (!updatedResourceToSupplier) {
        return { status: 400, body: { message: 'Failed to update `resource`.' } };
      }

      return { status: 200, body: updatedResourceToSupplier };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating 'resource'.`,
      });
    }
  },
  // ----------------------------------------------------
  // DELETE - /resources/{id}
  // ----------------------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [resource] = await db
        .select()
        .from(resourcesToSuppliers)
        .where(eq(resourcesToSuppliers.id, id));
      if (!resource) {
        return {
          status: 404,
          body: { message: `Unable to locate 'resource' with id (${id})` },
        };
      }

      await db.delete(resourcesToSuppliers).where(eq(resourcesToSuppliers.id, id));
      return { status: 200, body: resource };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong deleting 'resource'.`,
      });
    }
  },
});
