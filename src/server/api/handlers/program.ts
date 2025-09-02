import { db } from '@/server/db';
import { programs } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';

const paginate = createPaginator();

export const program = tsr.router(contract.program, {
  // ----------------------------------------------------
  // GET - /programs
  // ----------------------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(programs)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.programs.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(programs).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying programs.',
      });
    }
  },
  // ----------------------------------------------------
  // GET - /programs/{id}
  // ----------------------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const program = await db.query.programs.findFirst({
        where: eq(programs.id, id),
        with: parseDrizzleFindUniqueQuery(programs)(query).with,
      });

      if (!program) {
        return {
          status: 404,
          body: { message: `Unable to locate 'program' with id (${id})` },
        };
      }

      return { status: 200, body: program };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting 'program' with id (${id}).`,
      });
    }
  },
  // ----------------------------------------------------
  // POST - /programs
  // ----------------------------------------------------
  create: async ({ body: { data } }) => {
    try {
      const newProgram = await db.transaction(async (tx) => {
        const [{ insertId }] = await tx.insert(programs).values(data);
        return (await tx.select().from(programs).where(eq(programs.id, insertId))).at(0);
      });

      if (!newProgram) {
        return { status: 400, body: { message: 'Failed to create `program`.' } };
      }

      return { status: 201, body: newProgram };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating 'program'.`,
      });
    }
  },
  // ----------------------------------------------------
  // PUT - /programs/{id}
  // ----------------------------------------------------
  update: async ({ params: { id }, body: { data } }) => {
    try {
      const updatedProgram = await db.transaction(async (tx) => {
        await tx.update(programs).set(data).where(eq(programs.id, id));
        return (await tx.select().from(programs).where(eq(programs.id, id))).at(0);
      });

      if (!updatedProgram) {
        return { status: 400, body: { message: 'Failed to update `program`.' } };
      }

      return { status: 200, body: updatedProgram };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating 'program'.`,
      });
    }
  },
  // ----------------------------------------------------
  // DELETE - /programs/{id}
  // ----------------------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [program] = await db.select().from(programs).where(eq(programs.id, id));
      if (!program) {
        return {
          status: 404,
          body: { message: `Unable to locate 'program' with id (${id})` },
        };
      }

      await db.delete(programs).where(eq(programs.id, id));
      return { status: 200, body: program };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong deleting 'program'.`,
      });
    }
  },
});
