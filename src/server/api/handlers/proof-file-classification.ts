import { db } from '@/server/db';
import { proofFileClassifications } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';

const paginate = createPaginator();

export const proofFileClassification = tsr.router(contract.proofFileClassification, {
  // --------------------------------------
  // GET - /proof-file-classifications
  // --------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(proofFileClassifications)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.proofFileClassifications.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(proofFileClassifications).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying proofFileClassifications.',
      });
    }
  },
  // --------------------------------------
  // GET - /proof-file-classifications/{id}
  // --------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const file = await db.query.proofFileClassifications.findFirst({
        where: eq(proofFileClassifications.id, id),
        with: parseDrizzleFindUniqueQuery(proofFileClassifications)(query).with,
      });

      if (!file) {
        return { status: 404, body: { message: `Unable to locate file with id (${id})` } };
      }

      return { status: 200, body: file };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting file with id (${id}).`,
      });
    }
  },
  // --------------------------------------
  // POST - /proof-file-classifications
  // --------------------------------------
  create: async ({ body: { data } }) => {
    try {
      const newFile = await db.transaction(async (tx) => {
        const [{ insertId: fileId }] = await tx.insert(proofFileClassifications).values(data);
        return (
          await tx
            .select()
            .from(proofFileClassifications)
            .where(eq(proofFileClassifications.id, fileId))
        ).at(0);
      });

      if (!newFile) {
        return { status: 400, body: { message: 'Failed to create file.' } };
      }

      return { status: 201, body: newFile };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating file.`,
      });
    }
  },
  // --------------------------------------
  // PUT - /proof-file-classifications/{id}
  // --------------------------------------
  update: async ({ params: { id }, body: { data } }) => {
    try {
      const updatedFile = await db.transaction(async (tx) => {
        await tx
          .update(proofFileClassifications)
          .set(data)
          .where(eq(proofFileClassifications.id, id));
        return (
          await tx
            .select()
            .from(proofFileClassifications)
            .where(eq(proofFileClassifications.id, id))
        ).at(0);
      });

      if (!updatedFile) {
        return { status: 400, body: { message: 'Failed to update file.' } };
      }

      return { status: 200, body: updatedFile };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating file.`,
      });
    }
  },
  // --------------------------------------
  // DELETE - /proof-file-classifications/{id}
  // --------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [file] = await db
        .select()
        .from(proofFileClassifications)
        .where(eq(proofFileClassifications.id, id));
      if (!file) {
        return { status: 404, body: { message: `Unable to locate file with id (${id})` } };
      }

      await db.delete(proofFileClassifications).where(eq(proofFileClassifications.id, id));
      return { status: 200, body: file };
    } catch (e) {
      return genTsRestErrorRes(e, { genericMsg: `Something went wrong deleting file.` });
    }
  },
});
