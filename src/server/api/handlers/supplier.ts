import { db } from '@/server/db';
import { suppliers } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { between, eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';
import type { ReportSupplier } from '../types';

const paginate = createPaginator();

export const supplier = tsr.router(contract.supplier, {
  // ----------------------------------------------------
  // GET - /suppliers
  // ----------------------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(suppliers)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.suppliers.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(suppliers).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying suppliers.',
      });
    }
  },
  // ----------------------------------------------------
  // GET - /suppliers/{id}
  // ----------------------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const supplier = await db.query.suppliers.findFirst({
        where: eq(suppliers.id, id),
        with: parseDrizzleFindUniqueQuery(suppliers)(query).with,
      });

      if (!supplier) {
        return {
          status: 404,
          body: { message: `Unable to locate 'supplier' with id (${id})` },
        };
      }

      return { status: 200, body: supplier };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting 'supplier' with id (${id}).`,
      });
    }
  },
  // ----------------------------------------------------
  // POST - /suppliers
  // ----------------------------------------------------
  create: async ({ body: { data } }) => {
    try {
      const newSupplier = await db.transaction(async (tx) => {
        const [{ insertId }] = await tx.insert(suppliers).values(data);
        return (await tx.select().from(suppliers).where(eq(suppliers.id, insertId))).at(0);
      });

      if (!newSupplier) {
        return { status: 400, body: { message: 'Failed to create `supplier`.' } };
      }

      return { status: 201, body: newSupplier };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating 'supplier'.`,
      });
    }
  },
  // ----------------------------------------------------
  // PUT - /suppliers/{id}
  // ----------------------------------------------------
  update: async ({ params: { id }, body: { data } }) => {
    try {
      const updatedSupplier = await db.transaction(async (tx) => {
        await tx.update(suppliers).set(data).where(eq(suppliers.id, id));
        return (await tx.select().from(suppliers).where(eq(suppliers.id, id))).at(0);
      });

      if (!updatedSupplier) {
        return { status: 400, body: { message: 'Failed to update `supplier`.' } };
      }

      return { status: 200, body: updatedSupplier };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating 'supplier'.`,
      });
    }
  },
  // ----------------------------------------------------
  // DELETE - /suppliers/{id}
  // ----------------------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [supplier] = await db.select().from(suppliers).where(eq(suppliers.id, id));
      if (!supplier) {
        return {
          status: 404,
          body: { message: `Unable to locate 'supplier' with id (${id})` },
        };
      }

      await db.delete(suppliers).where(eq(suppliers.id, id));
      return { status: 200, body: supplier };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong deleting 'supplier'.`,
      });
    }
  },
  report: async ({ body: { startDate, endDate } }) => {
    const supplierData = await db.query.suppliers.findMany({
      where: between(suppliers.createdAt, startDate, endDate),
      with: {
        resourcesToSuppliers: true,
      },
    });

    const response = supplierData.map((supplier) => {
      return {
        nombre: supplier.name,
        recursos: supplier.resourcesToSuppliers.length ?? 0,
      } satisfies ReportSupplier;
    });

    return { status: 200, body: response };
  },
});
