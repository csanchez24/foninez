import { db } from '@/server/db';
import { guardians } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { between, eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';
import type { ReportGuardian } from '../types';

const paginate = createPaginator();

export const guardian = tsr.router(contract.guardian, {
  // --------------------------------------
  // GET - /guardians
  // --------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(guardians)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.guardians.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(guardians).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying guardians.',
      });
    }
  },
  // --------------------------------------
  // GET - /guardians/{id}
  // --------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const guardian = await db.query.guardians.findFirst({
        where: eq(guardians.id, id),
        with: parseDrizzleFindUniqueQuery(guardians)(query).with,
      });

      if (!guardian) {
        return { status: 404, body: { message: `Unable to locate guardian with id (${id})` } };
      }

      return { status: 200, body: guardian };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting guardian with id (${id}).`,
      });
    }
  },
  // --------------------------------------
  // POST - /guardians
  // --------------------------------------
  create: async ({ body: { data } }) => {
    try {
      const newGuardian = await db.transaction(async (tx) => {
        const [{ insertId: guardianId }] = await tx.insert(guardians).values(data);
        return (await tx.select().from(guardians).where(eq(guardians.id, guardianId))).at(0);
      });

      if (!newGuardian) {
        return { status: 400, body: { message: 'Failed to create guardian.' } };
      }

      return { status: 201, body: newGuardian };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating guardian.`,
      });
    }
  },
  // --------------------------------------
  // PUT - /guardians/{id}
  // --------------------------------------
  update: async ({ params: { id }, body: { data } }) => {
    try {
      const updatedGuardian = await db.transaction(async (tx) => {
        await tx.update(guardians).set(data).where(eq(guardians.id, id));
        return (await tx.select().from(guardians).where(eq(guardians.id, id))).at(0);
      });

      if (!updatedGuardian) {
        return { status: 400, body: { message: 'Failed to update guardian.' } };
      }

      return { status: 200, body: updatedGuardian };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating guardian.`,
      });
    }
  },
  // --------------------------------------
  // DELETE - /guardians/{id}
  // --------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [guardian] = await db.select().from(guardians).where(eq(guardians.id, id));
      if (!guardian) {
        return { status: 404, body: { message: `Unable to locate guardian with id (${id})` } };
      }

      await db.delete(guardians).where(eq(guardians.id, id));
      return { status: 200, body: guardian };
    } catch (e) {
      return genTsRestErrorRes(e, { genericMsg: `Something went wrong deleting guardian.` });
    }
  },
  report: async ({ body: { startDate, endDate } }) => {
    const guardiansData = await db.query.guardians.findMany({
      where: between(guardians.createdAt, startDate, endDate),
      with: {
        identification: true,
        children: true,
      },
    });

    const response = guardiansData.map((guardian) => {
      return {
        tipoDocumento: guardian.identification?.name ?? '',
        numeroDocumento: guardian.idNum,
        primerNombre: guardian.firstName,
        segundoNombre: guardian.middleName ?? '',
        primerApellido: guardian.lastName,
        segundoApellido: guardian.secondLastName ?? '',
        telefono: guardian.phone ?? '',
        beneficiarios: guardian.children.length ?? 0,
      } satisfies ReportGuardian;
    });

    return { status: 200, body: response };
  },
});
