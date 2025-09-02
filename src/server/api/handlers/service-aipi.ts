import { db } from '@/server/db';
import { servicesAipi } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';

const paginate = createPaginator();

export const serviceAipi = tsr.router(contract.serviceAipi, {
  // --------------------------------------
  // GET - /servicesAipi
  // --------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(servicesAipi)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.servicesAipi.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(servicesAipi).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying servicesAipi.',
      });
    }
  },
  // --------------------------------------
  // GET - /servicesAipi/{id}
  // --------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const serviceAipi = await db.query.servicesAipi.findFirst({
        where: eq(servicesAipi.id, id),
        with: parseDrizzleFindUniqueQuery(servicesAipi)(query).with,
      });

      if (!serviceAipi) {
        return {
          status: 404,
          body: { message: `Unable to locate serviceAipi with id (${id})` },
        };
      }

      return { status: 200, body: serviceAipi };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting serviceAipi with id (${id}).`,
      });
    }
  },
  // --------------------------------------
  // POST - /servicesAipi
  // --------------------------------------
  create: async ({ body: { data } }) => {
    try {
      const newServiceAipi = await db.transaction(async (tx) => {
        const [{ insertId: serviceAipiId }] = await tx.insert(servicesAipi).values(data);
        return (await tx.select().from(servicesAipi).where(eq(servicesAipi.id, serviceAipiId))).at(
          0
        );
      });

      if (!newServiceAipi) {
        return { status: 400, body: { message: 'Failed to create serviceAipi.' } };
      }

      return { status: 201, body: newServiceAipi };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating serviceAipi.`,
      });
    }
  },
  // --------------------------------------
  // PUT - /servicesAipi/{id}
  // --------------------------------------
  update: async ({ params: { id }, body: { data } }) => {
    try {
      const updatedServiceAipi = await db.transaction(async (tx) => {
        await tx.update(servicesAipi).set(data).where(eq(servicesAipi.id, id));
        return (await tx.select().from(servicesAipi).where(eq(servicesAipi.id, id))).at(0);
      });

      if (!updatedServiceAipi) {
        return { status: 400, body: { message: 'Failed to update serviceAipi.' } };
      }

      return { status: 200, body: updatedServiceAipi };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating serviceAipi.`,
      });
    }
  },
  // --------------------------------------
  // DELETE - /servicesAipi/{id}
  // --------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [serviceAipi] = await db.select().from(servicesAipi).where(eq(servicesAipi.id, id));
      if (!serviceAipi) {
        return {
          status: 404,
          body: { message: `Unable to locate serviceAipi with id (${id})` },
        };
      }

      await db.delete(servicesAipi).where(eq(servicesAipi.id, id));
      return { status: 200, body: serviceAipi };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong deleting serviceAipi.`,
      });
    }
  },
});
