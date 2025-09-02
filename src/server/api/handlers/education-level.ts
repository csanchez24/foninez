import { db } from '@/server/db';
import { educationLevels } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';

const paginate = createPaginator();

export const educationLevel = tsr.router(contract.educationLevel, {
  // --------------------------------------
  // GET - /educationLevels
  // --------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(educationLevels)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.educationLevels.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(educationLevels).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying educationLevels.',
      });
    }
  },
  // --------------------------------------
  // GET - /educationLevels/{id}
  // --------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const educationLevel = await db.query.educationLevels.findFirst({
        where: eq(educationLevels.id, id),
        with: parseDrizzleFindUniqueQuery(educationLevels)(query).with,
      });

      if (!educationLevel) {
        return {
          status: 404,
          body: { message: `Unable to locate educationLevel with id (${id})` },
        };
      }

      return { status: 200, body: educationLevel };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting educationLevel with id (${id}).`,
      });
    }
  },
  // --------------------------------------
  // POST - /educationLevels
  // --------------------------------------
  create: async ({ body: { data } }) => {
    try {
      const newEducationLevel = await db.transaction(async (tx) => {
        const [{ insertId: educationLevel }] = await tx.insert(educationLevels).values(data);
        return (
          await tx.select().from(educationLevels).where(eq(educationLevels.id, educationLevel))
        ).at(0);
      });

      if (!newEducationLevel) {
        return { status: 400, body: { message: 'Failed to create educationLevel.' } };
      }

      return { status: 201, body: newEducationLevel };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating educationLevel.`,
      });
    }
  },
  // --------------------------------------
  // PUT - /educationLevels/{id}
  // --------------------------------------
  update: async ({ params: { id }, body: { data } }) => {
    try {
      const updatedEducationLevel = await db.transaction(async (tx) => {
        await tx.update(educationLevels).set(data).where(eq(educationLevels.id, id));
        return (await tx.select().from(educationLevels).where(eq(educationLevels.id, id))).at(0);
      });

      if (!updatedEducationLevel) {
        return { status: 400, body: { message: 'Failed to update educationLevel.' } };
      }

      return { status: 200, body: updatedEducationLevel };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating educationLevel.`,
      });
    }
  },
  // --------------------------------------
  // DELETE - /educationLevels/{id}
  // --------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [educationLevel] = await db
        .select()
        .from(educationLevels)
        .where(eq(educationLevels.id, id));
      if (!educationLevel) {
        return {
          status: 404,
          body: { message: `Unable to locate educationLevel with id (${id})` },
        };
      }

      await db.delete(educationLevels).where(eq(educationLevels.id, id));
      return { status: 200, body: educationLevel };
    } catch (e) {
      return genTsRestErrorRes(e, { genericMsg: `Something went wrong deleting educationLevel.` });
    }
  },
});
