import { db } from '@/server/db';
import {
  inventoryTransactionLines,
  inventoryTransactions,
  planModalityActivityResources,
  planModalityActivitySchoolResources,
  planModalityActivitySchools,
  professionals,
} from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { and, between, eq, inArray, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';
import { getDefaultEmailTemplate, sendEmail } from '@/utils/comfenalco';
import { env } from '@/env';
import type { ReportActivities } from '../types';

const paginate = createPaginator();

export const planModalityActivitySchool = tsr.router(contract.planModalityActivitySchool, {
  // ----------------------------------------------------
  // GET - /plan-modality-activity-schools/professionals
  // ----------------------------------------------------
  professionals: async ({ params: { professionalId } }) => {
    try {
      const body = await paginate({
        page: 1,
        limit: 10000,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const professional = await tx.query.professionals.findFirst({
              where: eq(professionals.id, professionalId),
              with: {
                planModalityActivitySchoolProfessionals: true,
              },
            });

            const ids = professional?.planModalityActivitySchoolProfessionals.map(
              (d) => d.planModalityActivitySchoolId
            );

            const a = await tx.query.planModalityActivitySchools.findMany({
              limit,
              offset,
              where: and(
                eq(planModalityActivitySchools.status, 'planning'),
                inArray(planModalityActivitySchools.id, ids ?? [])
              ),
              with: {
                school: true,
                planModalityActivity: true,
                planModalityActivitySchoolProofs: {
                  with: {
                    planModalityActivitySchoolProofFiles: {
                      with: {
                        proofFileClassification: true,
                      },
                    },
                    planModalityActivitySchoolProofChildrenAttendances: {
                      with: {
                        planModalityActivitySchoolChild: {
                          with: {
                            child: true,
                          },
                        },
                      },
                    },
                  },
                },
                planModalityActivitySchoolChildren: {
                  with: {
                    child: {
                      with: {
                        guardian: true,
                      },
                    },
                    planModalityActivitySchoolProofChildrenAttendances: {
                      with: {
                        planModalityActivitySchoolProof: true,
                      },
                    },
                  },
                },
                planModalityActivitySchoolsResources: {
                  with: {
                    planModalityActivityResource: {
                      with: {
                        resource: true,
                        planModalityActivitySchoolResources: true,
                      },
                    },
                  },
                },
                planModalityActivitySchoolProfessionals: {
                  with: {
                    professional: true,
                  },
                },
              },
            });
            return [a, a.length];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying `planModalityActivitySchools`.',
      });
    }
  },
  // ----------------------------------------------------
  // GET - /plan-modality-activity-schools
  // ----------------------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(planModalityActivitySchools)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.planModalityActivitySchools.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(planModalityActivitySchools).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying `planModalityActivitySchools`.',
      });
    }
  },
  // ----------------------------------------------------
  // GET - /plan-modality-activity-schools/{id}
  // ----------------------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const planModalityActivitySchool = await db.query.planModalityActivitySchools.findFirst({
        where: eq(planModalityActivitySchools.id, id),
        with: parseDrizzleFindUniqueQuery(planModalityActivitySchools)(query).with,
      });

      if (!planModalityActivitySchool) {
        return {
          status: 404,
          body: { message: `Unable to locate 'planModalityActivitySchool' with id (${id})` },
        };
      }

      return { status: 200, body: planModalityActivitySchool };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting 'planModalityActivitySchool' with id (${id}).`,
      });
    }
  },
  // ----------------------------------------------------
  // POST - /plan-modality-activity-schools
  // ----------------------------------------------------
  create: async ({ body: { data } }) => {
    try {
      const newPlanModalityActivitySchool = await db.transaction(async (tx) => {
        const [{ insertId }] = await tx.insert(planModalityActivitySchools).values(data);
        return (
          await tx
            .select()
            .from(planModalityActivitySchools)
            .where(eq(planModalityActivitySchools.id, insertId))
        ).at(0);
      });

      if (!newPlanModalityActivitySchool) {
        return { status: 400, body: { message: 'Failed to create `planModalityActivitySchool`.' } };
      }

      return { status: 201, body: newPlanModalityActivitySchool };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating 'planModalityActivitySchool'.`,
      });
    }
  },
  // ----------------------------------------------------
  // PUT - /plan-modality-activity-schools/{id}
  // ----------------------------------------------------
  update: async ({ params: { id }, body: { data, options } }) => {
    try {
      const updatedPlanModalityActivitySchool = await db.transaction(async (tx) => {
        await tx
          .update(planModalityActivitySchools)
          .set(data)
          .where(eq(planModalityActivitySchools.id, id));

        if (options?.updateStatuses) {
          const activity = await tx.query.planModalityActivitySchools.findFirst({
            where: eq(planModalityActivitySchools.id, id),
            with: {
              planModalityActivity: true,
            },
          });
          switch (data.status) {
            case 'planning':
              const alreadyHasResources = await tx
                .select()
                .from(planModalityActivitySchoolResources)
                .where(eq(planModalityActivitySchoolResources.planModalityActivitySchoolId, id));
              if (alreadyHasResources && alreadyHasResources.length > 0) break;
              const dataPlanModalityActivityResources = await tx
                .select()
                .from(planModalityActivityResources)
                .where(
                  eq(
                    planModalityActivityResources.planModalityActivityId,
                    activity?.planModalityActivityId ?? 0
                  )
                );
              for (const planModalityActivityResource of dataPlanModalityActivityResources) {
                await tx.insert(planModalityActivitySchoolResources).values({
                  planModalityActivitySchoolId: id,
                  resourcesQty: 0,
                  resourcesUsedQty: 0,
                  resourcesReceivedQty: 0,
                  planModalityActivityResourceId: planModalityActivityResource.id,
                });
              }
              break;
            case 'requested_resources':
              const [inventoryTransaction] = await tx
                .insert(inventoryTransactions)
                .values({
                  type: 'consume',
                  status: 'pending',
                  planModalityActivitySchoolId: id,
                  note: `autogenerate: ${activity?.planModalityActivity.name}`,
                })
                .$returningId();
              const planModalityActivitySchoolResourcesData =
                await tx.query.planModalityActivitySchoolResources.findMany({
                  where: eq(planModalityActivitySchoolResources.planModalityActivitySchoolId, id),
                  with: {
                    planModalityActivityResource: true,
                  },
                });
              await Promise.all(
                planModalityActivitySchoolResourcesData.map((p) =>
                  tx.insert(inventoryTransactionLines).values({
                    inventoryTransactionId: inventoryTransaction!.id,
                    resourceId: p.planModalityActivityResource.resourceId,
                    qty: p.resourcesQty,
                  })
                )
              );
              const html = await getDefaultEmailTemplate({
                title: 'Solicitud de Recurso',
                content: [
                  `La actividad ${activity?.planModalityActivity.name} esta solicitando los recursos asignados a la actividad.`,
                ],
              });
              await sendEmail({
                from: env.COMFENALCO_EMAIL_NOTIFICATION,
                subject: 'Solicitud de Recurso',
                body: html,
              });
              break;
            case 'completed':
              const planModalityActivitySchoolResourcesCompleteData =
                await tx.query.planModalityActivitySchoolResources.findMany({
                  where: eq(planModalityActivitySchoolResources.planModalityActivitySchoolId, id),
                  with: {
                    planModalityActivityResource: true,
                  },
                });
              const restockResource = planModalityActivitySchoolResourcesCompleteData.filter(
                (p) => p.resourcesReceivedQty - p.resourcesUsedQty > 0
              );
              if (restockResource.length === 0) {
                break;
              }
              const [inventoryTransactionComplete] = await tx
                .insert(inventoryTransactions)
                .values({
                  type: 'restock',
                  status: 'pending',
                  planModalityActivitySchoolId: id,
                  note: `autogenerate: ${activity?.planModalityActivity.name}`,
                })
                .$returningId();

              await Promise.all(
                planModalityActivitySchoolResourcesCompleteData
                  .filter((p) => p.resourcesReceivedQty - p.resourcesUsedQty > 0)
                  .map((p) =>
                    tx.insert(inventoryTransactionLines).values({
                      inventoryTransactionId: inventoryTransactionComplete!.id,
                      resourceId: p.planModalityActivityResource.resourceId,
                      qty: p.resourcesReceivedQty - p.resourcesUsedQty,
                    })
                  )
              );
              break;
          }
        }

        return (
          await tx
            .select()
            .from(planModalityActivitySchools)
            .where(eq(planModalityActivitySchools.id, id))
        ).at(0);
      });

      if (!updatedPlanModalityActivitySchool) {
        return { status: 400, body: { message: 'Failed to update `planModalityActivitySchool`.' } };
      }

      return { status: 200, body: updatedPlanModalityActivitySchool };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating 'planModalityActivitySchool'.`,
      });
    }
  },
  // ----------------------------------------------------
  // DELETE - /plan-modality-activity-schools/{id}
  // ----------------------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [planModalityActivitySchool] = await db
        .select()
        .from(planModalityActivitySchools)
        .where(eq(planModalityActivitySchools.id, id));
      if (!planModalityActivitySchool) {
        return {
          status: 404,
          body: { message: `Unable to locate 'planModalityActivitySchool' with id (${id})` },
        };
      }

      await db.delete(planModalityActivitySchools).where(eq(planModalityActivitySchools.id, id));
      return { status: 200, body: planModalityActivitySchool };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong deleting 'planModalityActivitySchool'.`,
      });
    }
  },
  report: async ({ body: { startDate, endDate } }) => {
    const activities = await db.query.planModalityActivitySchools.findMany({
      where: between(planModalityActivitySchools.createdAt, startDate, endDate),
      with: {
        school: true,
        planModalityActivity: true,
        planModalityActivitySchoolProofs: true,
        planModalityActivitySchoolChildren: true,
        planModalityActivitySchoolsResources: true,
        planModalityActivitySchoolProfessionals: true,
      },
    });

    const response = activities.map((activity) => {
      return {
        actividad: activity.planModalityActivity.name,
        school: activity.school.name,
        participantes: activity.participantsQty,
        beneficiarios: activity.planModalityActivitySchoolChildren.length ?? 0,
        soportes: activity.planModalityActivitySchoolProofs.length ?? 0,
        recursos: activity.planModalityActivitySchoolsResources.length ?? 0,
        estado: activity.status,
      } satisfies ReportActivities;
    });

    return { status: 200, body: response };
  },
});
