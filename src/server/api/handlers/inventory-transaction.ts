import { db } from '@/server/db';
import { inventories, inventoryTransactionLines, inventoryTransactions } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { between, eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';
import type { ReportInventoryTransaction } from '../types';

const paginate = createPaginator();

export const inventoryTransaction = tsr.router(contract.inventoryTransaction, {
  // --------------------------------------
  // GET - /inventory-transactions
  // --------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(inventoryTransactions)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.inventoryTransactions.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(inventoryTransactions).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying inventoryTransactions.',
      });
    }
  },
  // --------------------------------------
  // GET - /inventory-transactions/{id}
  // --------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const inventoryTransaction = await db.query.inventoryTransactions.findFirst({
        where: eq(inventoryTransactions.id, id),
        with: parseDrizzleFindUniqueQuery(inventoryTransactions)(query).with,
      });

      if (!inventoryTransaction) {
        return {
          status: 404,
          body: { message: `Unable to locate inventoryTransaction with id (${id})` },
        };
      }

      return { status: 200, body: inventoryTransaction };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting inventoryTransaction with id (${id}).`,
      });
    }
  },
  // --------------------------------------
  // POST - /inventory-transactions
  // --------------------------------------
  create: async ({
    body: {
      data: { inventoryTransactionLines: inventoryTransactionLinesData, ...data },
    },
  }) => {
    try {
      const newInventoryTransaction = await db.transaction(async (tx) => {
        const [{ insertId: inventoryTransactionId }] = await tx
          .insert(inventoryTransactions)
          .values(data);

        const inventoryLines =
          inventoryTransactionLinesData?.map((tl) => {
            return {
              resourceId: tl.resource.id,
              qty: tl.qty,
              inventoryTransactionId: inventoryTransactionId,
            };
          }) ?? [];
        await tx.insert(inventoryTransactionLines).values(inventoryLines);

        return (
          await tx
            .select()
            .from(inventoryTransactions)
            .where(eq(inventoryTransactions.id, inventoryTransactionId))
        ).at(0);
      });

      if (!newInventoryTransaction) {
        return { status: 400, body: { message: 'Failed to create inventoryTransaction.' } };
      }

      return { status: 201, body: newInventoryTransaction };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating inventoryTransaction.`,
      });
    }
  },
  // --------------------------------------
  // PUT - /inventory-transactions/{id}
  // --------------------------------------
  update: async ({
    params: { id },
    body: {
      data: { inventoryTransactionLines: inventoryTransactionLinesData, ...data },

      options,
    },
  }) => {
    try {
      const updatedInventoryTransaction = await db.transaction(async (tx) => {
        await tx.update(inventoryTransactions).set(data).where(eq(inventoryTransactions.id, id));

        if (inventoryTransactionLinesData) {
          await tx
            .delete(inventoryTransactionLines)
            .where(eq(inventoryTransactionLines.inventoryTransactionId, id));
          const inventoryLines =
            inventoryTransactionLinesData?.map((tl) => {
              return {
                resourceId: tl.resource.id,
                qty: tl.qty,
                inventoryTransactionId: id,
              };
            }) ?? [];
          await tx.insert(inventoryTransactionLines).values(inventoryLines);
        }

        const [transaction] = await tx
          .select()
          .from(inventoryTransactions)
          .where(eq(inventoryTransactions.id, id));

        if (options?.updateStatuses && transaction?.status === 'confirmed') {
          const transactionLines = await tx
            .select()
            .from(inventoryTransactionLines)
            .where(eq(inventoryTransactionLines.inventoryTransactionId, id));

          if (transaction.type === 'consume') {
            for (const transactionLine of transactionLines) {
              const [inventory] = await tx
                .select()
                .from(inventories)
                .where(eq(inventories.resourceId, transactionLine.resourceId));
              if ((inventory?.qty ?? 0) < transactionLine.qty) {
                throw new Error('No tiene inventario para aprobar la solicitud');
              }
            }
          }

          for (const transactionLine of transactionLines) {
            if (transaction.type === 'stock' || transaction.type === 'restock') {
              await tx
                .update(inventories)
                .set({ qty: sql`${inventories.qty} + ${transactionLine.qty}` })
                .where(eq(inventories.resourceId, transactionLine.resourceId));
            }
            if (transaction.type === 'consume') {
              await tx
                .update(inventories)
                .set({ qty: sql`${inventories.qty} - ${transactionLine.qty}` })
                .where(eq(inventories.resourceId, transactionLine.resourceId));
            }
            if (transaction.type === 'adjustment') {
              await tx
                .update(inventories)
                .set({ qty: transactionLine.qty })
                .where(eq(inventories.resourceId, transactionLine.resourceId));
            }
          }
        }

        return transaction;
      });

      if (!updatedInventoryTransaction) {
        return { status: 400, body: { message: 'Failed to update inventoryTransaction.' } };
      }

      return { status: 200, body: updatedInventoryTransaction };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating inventoryTransaction.`,
      });
    }
  },
  // --------------------------------------
  // DELETE - /inventory-transactions/{id}
  // --------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [inventoryTransaction] = await db
        .select()
        .from(inventoryTransactions)
        .where(eq(inventoryTransactions.id, id));
      if (!inventoryTransaction) {
        return {
          status: 404,
          body: { message: `Unable to locate inventoryTransaction with id (${id})` },
        };
      }

      await db.delete(inventoryTransactions).where(eq(inventoryTransactions.id, id));
      return { status: 200, body: inventoryTransaction };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong deleting inventoryTransaction.`,
      });
    }
  },
  report: async ({ body: { startDate, endDate } }) => {
    const inventoryData = await db.query.inventoryTransactions.findMany({
      where: between(inventoryTransactions.createdAt, startDate, endDate),
      with: {
        inventoryTransactionLines: true,
        planModalityActivitySchool: {
          with: {
            planModalityActivity: true,
            school: true,
          },
        },
      },
    });

    const response = inventoryData.map((inventory) => {
      return {
        tipo: inventory.type,
        numeroOrden: inventory.orderNumber ?? '',
        factura: inventory.supplierInvoiceNumber ?? '',
        actividad: inventory.planModalityActivitySchool?.planModalityActivity.name ?? '',
        school: inventory.planModalityActivitySchool?.school.name ?? '',
        nota: inventory.note,
        notaAprobado: inventory.approveNote ?? '',
        notaRechazado: inventory.rejectionNote ?? '',
        recursos: inventory.inventoryTransactionLines.length ?? 0,
        estado: inventory.status,
      } satisfies ReportInventoryTransaction;
    });

    return { status: 200, body: response };
  },
});
