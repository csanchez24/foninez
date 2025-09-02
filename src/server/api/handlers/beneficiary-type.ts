import { db } from '@/server/db';
import { beneficiaryTypes } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';

const paginate = createPaginator();

export const beneficiaryType = tsr.router(contract.beneficiaryType, {
  // --------------------------------------
  // GET - /beneficiaryTypes
  // --------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(beneficiaryTypes)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.beneficiaryTypes.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(beneficiaryTypes).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying beneficiaryTypes.',
      });
    }
  },
  // --------------------------------------
  // GET - /beneficiaryTypes/{id}
  // --------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const beneficiaryType = await db.query.beneficiaryTypes.findFirst({
        where: eq(beneficiaryTypes.id, id),
        with: parseDrizzleFindUniqueQuery(beneficiaryTypes)(query).with,
      });

      if (!beneficiaryType) {
        return {
          status: 404,
          body: { message: `Unable to locate beneficiaryType with id (${id})` },
        };
      }

      return { status: 200, body: beneficiaryType };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting beneficiaryType with id (${id}).`,
      });
    }
  },
  // --------------------------------------
  // POST - /beneficiaryTypes
  // --------------------------------------
  create: async ({ body: { data } }) => {
    try {
      const newBeneficiaryType = await db.transaction(async (tx) => {
        const [{ insertId: beneficiaryTypeId }] = await tx.insert(beneficiaryTypes).values(data);
        return (
          await tx.select().from(beneficiaryTypes).where(eq(beneficiaryTypes.id, beneficiaryTypeId))
        ).at(0);
      });

      if (!newBeneficiaryType) {
        return { status: 400, body: { message: 'Failed to create beneficiaryType.' } };
      }

      return { status: 201, body: newBeneficiaryType };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating beneficiaryType.`,
      });
    }
  },
  // --------------------------------------
  // PUT - /beneficiaryTypes/{id}
  // --------------------------------------
  update: async ({ params: { id }, body: { data } }) => {
    try {
      const updatedBeneficiaryType = await db.transaction(async (tx) => {
        await tx.update(beneficiaryTypes).set(data).where(eq(beneficiaryTypes.id, id));
        return (await tx.select().from(beneficiaryTypes).where(eq(beneficiaryTypes.id, id))).at(0);
      });

      if (!updatedBeneficiaryType) {
        return { status: 400, body: { message: 'Failed to update beneficiaryType.' } };
      }

      return { status: 200, body: updatedBeneficiaryType };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating beneficiaryType.`,
      });
    }
  },
  // --------------------------------------
  // DELETE - /beneficiaryTypes/{id}
  // --------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [beneficiaryType] = await db
        .select()
        .from(beneficiaryTypes)
        .where(eq(beneficiaryTypes.id, id));
      if (!beneficiaryType) {
        return {
          status: 404,
          body: { message: `Unable to locate beneficiaryType with id (${id})` },
        };
      }

      await db.delete(beneficiaryTypes).where(eq(beneficiaryTypes.id, id));
      return { status: 200, body: beneficiaryType };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong deleting beneficiaryType.`,
      });
    }
  },
});
