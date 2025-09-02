import { db } from '@/server/db';
import { schoolGrades } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';

const paginate = createPaginator();

export const schoolGrade = tsr.router(contract.schoolGrade, {
  // --------------------------------------
  // GET - /schoolGrades
  // --------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(schoolGrades)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.schoolGrades.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(schoolGrades).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying schoolGrades.',
      });
    }
  },
  // --------------------------------------
  // GET - /schoolGrades/{id}
  // --------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const schoolGrade = await db.query.schoolGrades.findFirst({
        where: eq(schoolGrades.id, id),
        with: parseDrizzleFindUniqueQuery(schoolGrades)(query).with,
      });

      if (!schoolGrade) {
        return {
          status: 404,
          body: { message: `Unable to locate schoolGrade with id (${id})` },
        };
      }

      return { status: 200, body: schoolGrade };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting schoolGrade with id (${id}).`,
      });
    }
  },
  // --------------------------------------
  // POST - /schoolGrades
  // --------------------------------------
  create: async ({ body: { data } }) => {
    try {
      const newSchoolGrade = await db.transaction(async (tx) => {
        const [{ insertId: schoolGrade }] = await tx.insert(schoolGrades).values(data);
        return (await tx.select().from(schoolGrades).where(eq(schoolGrades.id, schoolGrade))).at(0);
      });

      if (!newSchoolGrade) {
        return { status: 400, body: { message: 'Failed to create schoolGrade.' } };
      }

      return { status: 201, body: newSchoolGrade };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating schoolGrade.`,
      });
    }
  },
  // --------------------------------------
  // PUT - /schoolGrades/{id}
  // --------------------------------------
  update: async ({ params: { id }, body: { data } }) => {
    try {
      const updatedSchoolGrade = await db.transaction(async (tx) => {
        await tx.update(schoolGrades).set(data).where(eq(schoolGrades.id, id));
        return (await tx.select().from(schoolGrades).where(eq(schoolGrades.id, id))).at(0);
      });

      if (!updatedSchoolGrade) {
        return { status: 400, body: { message: 'Failed to update schoolGrade.' } };
      }

      return { status: 200, body: updatedSchoolGrade };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating schoolGrade.`,
      });
    }
  },
  // --------------------------------------
  // DELETE - /schoolGrades/{id}
  // --------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [schoolGrade] = await db.select().from(schoolGrades).where(eq(schoolGrades.id, id));
      if (!schoolGrade) {
        return {
          status: 404,
          body: { message: `Unable to locate schoolGrade with id (${id})` },
        };
      }

      await db.delete(schoolGrades).where(eq(schoolGrades.id, id));
      return { status: 200, body: schoolGrade };
    } catch (e) {
      return genTsRestErrorRes(e, { genericMsg: `Something went wrong deleting schoolGrade.` });
    }
  },
});
