import { db } from '@/server/db';
import { inventories, resources, resourcesToSuppliers } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { between, eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';
import type { ReportResources } from '../types';

const paginate = createPaginator();

export const resource = tsr.router(contract.resource, {
  // ----------------------------------------------------
  // GET - /resources
  // ----------------------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(resources)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.resources.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(resources).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying resources.',
      });
    }
  },
  // ----------------------------------------------------
  // GET - /resources/{id}
  // ----------------------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const resource = await db.query.resources.findFirst({
        where: eq(resources.id, id),
        with: parseDrizzleFindUniqueQuery(resources)(query).with,
      });

      if (!resource) {
        return {
          status: 404,
          body: { message: `Unable to locate 'resource' with id (${id})` },
        };
      }

      return { status: 200, body: resource };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting 'resource' with id (${id}).`,
      });
    }
  },
  // ----------------------------------------------------
  // POST - /resources
  // ----------------------------------------------------
  create: async ({
    body: {
      data: { resourcesToSuppliers: resourcesToSuppliersData, ...data },
    },
  }) => {
    try {
      const newResource = await db.transaction(async (tx) => {
        const [{ insertId }] = await tx.insert(resources).values(data);
        await tx.insert(inventories).values({
          qty: 0,
          resourceId: insertId,
        });

        const resourcesToSuppliersInsertData =
          resourcesToSuppliersData?.map((ps) => {
            return {
              resourceId: insertId,
              supplierId: ps.supplier.id,
            };
          }) ?? [];
        await tx.insert(resourcesToSuppliers).values(resourcesToSuppliersInsertData);

        return (await tx.select().from(resources).where(eq(resources.id, insertId))).at(0);
      });

      if (!newResource) {
        return { status: 400, body: { message: 'Failed to create `resource`.' } };
      }

      return { status: 201, body: newResource };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating 'resource'.`,
      });
    }
  },
  // ----------------------------------------------------
  // PUT - /resources/{id}
  // ----------------------------------------------------
  update: async ({
    params: { id },
    body: {
      data: { resourcesToSuppliers: resourcesToSuppliersData, ...data },
    },
  }) => {
    try {
      const updatedResource = await db.transaction(async (tx) => {
        await tx.update(resources).set(data).where(eq(resources.id, id));

        await tx.delete(resourcesToSuppliers).where(eq(resourcesToSuppliers.resourceId, id));
        const resourcesToSuppliersInsertData =
          resourcesToSuppliersData?.map((ps) => {
            return {
              resourceId: id,
              supplierId: ps.supplier.id,
            };
          }) ?? [];
        await tx.insert(resourcesToSuppliers).values(resourcesToSuppliersInsertData);

        return (await tx.select().from(resources).where(eq(resources.id, id))).at(0);
      });

      if (!updatedResource) {
        return { status: 400, body: { message: 'Failed to update `resource`.' } };
      }

      return { status: 200, body: updatedResource };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating 'resource'.`,
      });
    }
  },
  // ----------------------------------------------------
  // DELETE - /resources/{id}
  // ----------------------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [resource] = await db.select().from(resources).where(eq(resources.id, id));
      if (!resource) {
        return {
          status: 404,
          body: { message: `Unable to locate 'resource' with id (${id})` },
        };
      }

      await db.delete(resources).where(eq(resources.id, id));
      return { status: 200, body: resource };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong deleting 'resource'.`,
      });
    }
  },
  report: async ({ body: { startDate, endDate } }) => {
    const resourcesData = await db.query.resources.findMany({
      where: between(resources.createdAt, startDate, endDate),
      with: {
        inventory: true,
        resourceClassification: true,
        resourcesToSuppliers: {
          with: {
            supplier: true,
          },
        },
        planModalityActivityResources: true,
      },
    });

    const response = resourcesData.map((resource) => {
      return {
        name: resource.name,
        precio: resource.price.toString(),
        clasificacion: resource.resourceClassification.name,
        inventario: resource.inventory?.qty ?? 0,
        proveedor: resource.resourcesToSuppliers.map((s) => s.supplier.name).join(','),
        actividades: resource.planModalityActivityResources.length ?? 0,
      } satisfies ReportResources;
    });

    return { status: 200, body: response };
  },
});
