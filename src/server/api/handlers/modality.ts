import { db } from '@/server/db';
import { modalities } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';

const paginate = createPaginator();

export const modality = tsr.router(contract.modality, {
  // --------------------------------------
  // GET - /modalities
  // --------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(modalities)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.modalities.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(modalities).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying modalities.',
      });
    }
  },
  // --------------------------------------
  // GET - /modalities/{id}
  // --------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const modality = await db.query.modalities.findFirst({
        where: eq(modalities.id, id),
        with: parseDrizzleFindUniqueQuery(modalities)(query).with,
      });

      if (!modality) {
        return {
          status: 404,
          body: { message: `Unable to locate modality with id (${id})` },
        };
      }

      return { status: 200, body: modality };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting modality with id (${id}).`,
      });
    }
  },
  // --------------------------------------
  // POST - /modalities
  // --------------------------------------
  create: async ({ body: { data } }) => {
    try {
      const newModality = await db.transaction(async (tx) => {
        const [{ insertId: modalityId }] = await tx.insert(modalities).values(data);
        return (await tx.select().from(modalities).where(eq(modalities.id, modalityId))).at(0);
      });

      if (!newModality) {
        return { status: 400, body: { message: 'Failed to create modality.' } };
      }

      return { status: 201, body: newModality };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating modality.`,
      });
    }
  },
  // --------------------------------------
  // PUT - /modalities/{id}
  // --------------------------------------
  update: async ({ params: { id }, body: { data } }) => {
    try {
      const updatedModality = await db.transaction(async (tx) => {
        await tx.update(modalities).set(data).where(eq(modalities.id, id));
        return (await tx.select().from(modalities).where(eq(modalities.id, id))).at(0);
      });

      if (!updatedModality) {
        return { status: 400, body: { message: 'Failed to update modality.' } };
      }

      return { status: 200, body: updatedModality };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating modality.`,
      });
    }
  },
  // --------------------------------------
  // DELETE - /modalities/{id}
  // --------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [modality] = await db.select().from(modalities).where(eq(modalities.id, id));
      if (!modality) {
        return {
          status: 404,
          body: { message: `Unable to locate modality with id (${id})` },
        };
      }

      await db.delete(modalities).where(eq(modalities.id, id));
      return { status: 200, body: modality };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong deleting modality.`,
      });
    }
  },
});
