import { db } from '@/server/db';
import { resourceClassifications } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';

const paginate = createPaginator();

export const resourceClassification = tsr.router(contract.resourceClassification, {
  // ----------------------------------------------------
  // GET - /resource-classifications
  // ----------------------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(resourceClassifications)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.resourceClassifications.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(resourceClassifications).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying resourceClassifications.',
      });
    }
  },
  // ----------------------------------------------------
  // GET - /resource-classifications/{id}
  // ----------------------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const resourceClassification = await db.query.resourceClassifications.findFirst({
        where: eq(resourceClassifications.id, id),
        with: parseDrizzleFindUniqueQuery(resourceClassifications)(query).with,
      });

      if (!resourceClassification) {
        return {
          status: 404,
          body: { message: `Unable to locate 'resourceClassification' with id (${id})` },
        };
      }

      return { status: 200, body: resourceClassification };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting 'resourceClassification' with id (${id}).`,
      });
    }
  },
  // ----------------------------------------------------
  // POST - /resource-classifications
  // ----------------------------------------------------
  create: async ({ body: { data } }) => {
    try {
      const newResourceClassification = await db.transaction(async (tx) => {
        const [{ insertId }] = await tx.insert(resourceClassifications).values(data);
        return (
          await tx
            .select()
            .from(resourceClassifications)
            .where(eq(resourceClassifications.id, insertId))
        ).at(0);
      });

      if (!newResourceClassification) {
        return { status: 400, body: { message: 'Failed to create `resourceClassification`.' } };
      }

      return { status: 201, body: newResourceClassification };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating 'resourceClassification'.`,
      });
    }
  },
  // ----------------------------------------------------
  // PUT - /resource-classifications/{id}
  // ----------------------------------------------------
  update: async ({ params: { id }, body: { data } }) => {
    try {
      const updatedResourceClassification = await db.transaction(async (tx) => {
        await tx.update(resourceClassifications).set(data).where(eq(resourceClassifications.id, id));
        return (
          await tx.select().from(resourceClassifications).where(eq(resourceClassifications.id, id))
        ).at(0);
      });

      if (!updatedResourceClassification) {
        return { status: 400, body: { message: 'Failed to update `resourceClassification`.' } };
      }

      return { status: 200, body: updatedResourceClassification };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating 'resourceClassification'.`,
      });
    }
  },
  // ----------------------------------------------------
  // DELETE - /resource-classifications/{id}
  // ----------------------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [resourceClassification] = await db
        .select()
        .from(resourceClassifications)
        .where(eq(resourceClassifications.id, id));
      if (!resourceClassification) {
        return {
          status: 404,
          body: { message: `Unable to locate 'resourceClassification' with id (${id})` },
        };
      }

      await db.delete(resourceClassifications).where(eq(resourceClassifications.id, id));
      return { status: 200, body: resourceClassification };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong deleting 'resourceClassification'.`,
      });
    }
  },
});
