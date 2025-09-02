import { db } from '@/server/db';
import {
  type Child,
  type NewChild,
  type NewGuardian,
  children,
  guardians,
  planModalityActivitySchoolChildren,
} from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { and, eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';
import { validarDocMenorEdad } from '@/utils/comfenalco';
import { formatDate } from '@/utils/format-date';

const paginate = createPaginator();

async function getSchoolChildValues(child: Child) {
  const validarDocMenorEdadData = await validarDocMenorEdad({
    documento: child.idNum,
    primerNombre: child.firstName,
    primerApellido: child.lastName,
    fechaNacimiento: formatDate(child.birthDate, 'yyyy-MM-dd'),
  });

  if (!validarDocMenorEdadData) {
    return {
      status: 'rejected',
      rejectionNote: 'No Service Response',
    } as const;
  }
  if (!validarDocMenorEdadData.exito) {
    return {
      status: 'rejected',
      rejectionNote: validarDocMenorEdadData.data.errores.join(', '),
    } as const;
  }
  if (validarDocMenorEdadData.data.at(0)?.estado) {
    return {
      status: 'confirmed',
      rejectionNote: null,
    } as const;
  }
  if (validarDocMenorEdadData.data.at(0)?.validacion) {
    return {
      status: 'rejected',
      rejectionNote: validarDocMenorEdadData.data.at(0)?.validacion?.join(', ') ?? '',
    } as const;
  }
  return {
    status: 'rejected',
  } as const;
}

async function insertChildExtraData(childData: NewChild, guardianData: NewGuardian) {
  const [child] = await db.select().from(children).where(eq(children.idNum, childData.idNum));

  if (child) {
    const guardianId = await insertGuardianExtraData(guardianData);
    await updateChildExtraData(child.id, { ...childData, guardianId });
    return child.id;
  }

  const guardianId = await insertGuardianExtraData(guardianData);

  const [{ insertId }] = await db.insert(children).values({ ...childData, guardianId });
  return insertId;
}

async function insertGuardianExtraData(guardianData: NewGuardian) {
  const [guardian] = await db
    .select()
    .from(guardians)
    .where(eq(guardians.idNum, guardianData.idNum));

  if (guardian) {
    await updateGuardianExtraData(guardian.id, guardianData);
    return guardian.id;
  }

  const [{ insertId }] = await db.insert(guardians).values(guardianData);
  return insertId;
}

async function updateChildExtraData(id: number, childData: NewChild) {
  await db.update(children).set(childData).where(eq(children.id, id));
  return;
}

async function updateGuardianExtraData(id: number, guardianData: NewGuardian) {
  return await db.update(guardians).set(guardianData).where(eq(guardians.id, id));
}

export const planModalityActivitySchoolChild = tsr.router(
  contract.planModalityActivitySchoolChild,
  {
    // ----------------------------------------------------
    // GET - /plan-modality-activity-school-children
    // ----------------------------------------------------
    findMany: async ({ query }) => {
      try {
        const q = parseDrizzleFindManyQuery(planModalityActivitySchoolChildren)(query);

        const body = await paginate({
          page: query.page,
          limit: query.limit,
          $transaction: ({ limit, offset }) =>
            db.transaction(async (tx) => {
              const a = await tx.query.planModalityActivitySchoolChildren.findMany({
                ...q,
                limit,
                offset,
              });
              const c = await tx.select({ count: sql<number>`count(*)` }).from(planModalityActivitySchoolChildren).where(q.where) // prettier-ignore
              return [a, c[0]!.count];
            }),
        });

        return { status: 200, body };
      } catch (e) {
        return genTsRestErrorRes(e, {
          genericMsg: 'Something went wrong querying `planModalityActivitySchoolChildren`.',
        });
      }
    },
    // ----------------------------------------------------
    // GET - /plan-modality-activity-school-children/{id}
    // ----------------------------------------------------
    findUnique: async ({ params: { id }, query }) => {
      try {
        const planModalityActivitySchoolChild =
          await db.query.planModalityActivitySchoolChildren.findFirst({
            where: eq(planModalityActivitySchoolChildren.id, id),
            with: parseDrizzleFindUniqueQuery(planModalityActivitySchoolChildren)(query).with,
          });

        if (!planModalityActivitySchoolChild) {
          return {
            status: 404,
            body: { message: `Unable to locate 'planModalityActivitySchoolChild' with id (${id})` },
          };
        }

        return { status: 200, body: planModalityActivitySchoolChild };
      } catch (e) {
        return genTsRestErrorRes(e, {
          genericMsg: `Something went wrong getting 'planModalityActivitySchoolChild' with id (${id}).`,
        });
      }
    },
    // ----------------------------------------------------
    // POST - /plan-modality-activity-school-children
    // ----------------------------------------------------
    create: async ({ body: { data } }) => {
      try {
        const newPlanModalityActivitySchoolChild = await db.transaction(async (tx) => {
          const childId = await insertChildExtraData(data.child, data.guardian);
          const values = await getSchoolChildValues(data.child as Child);
          const [{ insertId }] = await tx.insert(planModalityActivitySchoolChildren).values({
            ...data,
            childId,
            ...values,
          });

          return (
            await tx
              .select()
              .from(planModalityActivitySchoolChildren)
              .where(eq(planModalityActivitySchoolChildren.id, insertId))
          ).at(0);
        });

        if (!newPlanModalityActivitySchoolChild) {
          return {
            status: 400,
            body: { message: 'Failed to create `planModalityActivitySchoolChild`.' },
          };
        }

        return { status: 201, body: newPlanModalityActivitySchoolChild };
      } catch (e) {
        return genTsRestErrorRes(e, {
          genericMsg: `Something went wrong creating 'planModalityActivitySchoolChild'.`,
        });
      }
    },
    resync: async ({ params: { id } }) => {
      try {
        const planModalityActivitySchoolChild =
          await db.query.planModalityActivitySchoolChildren.findFirst({
            where: eq(planModalityActivitySchoolChildren.id, id),
            with: {
              child: true,
            },
          });
        if (!planModalityActivitySchoolChild) {
          return {
            status: 400,
            body: { message: 'Failed to resync `planModalityActivitySchoolChild`.' },
          };
        }

        const child = planModalityActivitySchoolChild.child;

        const values = await getSchoolChildValues(child);

        await db
          .update(planModalityActivitySchoolChildren)
          .set(values)
          .where(eq(planModalityActivitySchoolChildren.id, id));

        return { status: 200, body: null };
      } catch (e) {
        return genTsRestErrorRes(e, {
          genericMsg: `Something went wrong updating 'planModalityActivitySchoolChild'.`,
        });
      }
    },
    // ----------------------------------------------------
    // POST - /plan-modality-activity-school-children
    // ----------------------------------------------------
    sync: async ({ body: data }) => {
      try {
        await db.transaction(async (tx) => {
          for (const child of data) {
            const childId = await insertChildExtraData(child.child, child.guardian);

            const [planModalityActivitySchoolChild] = await db
              .select()
              .from(planModalityActivitySchoolChildren)
              .where(
                and(
                  eq(
                    planModalityActivitySchoolChildren.planModalityActivitySchoolId,
                    data.at(0)?.planModalityActivitySchoolId ?? 0
                  ),
                  eq(planModalityActivitySchoolChildren.childId, childId)
                )
              );
            if (planModalityActivitySchoolChild) continue;
            const values = await getSchoolChildValues(child.child as Child);
            await tx.insert(planModalityActivitySchoolChildren).values({
              childId,
              planModalityActivitySchoolId: child.planModalityActivitySchoolId,
              ...values,
            });
          }
        });

        return { status: 200, body: null };
      } catch (e) {
        return genTsRestErrorRes(e, {
          genericMsg: `Something went wrong creating 'planModalityActivitySchoolChild'.`,
        });
      }
    },
    // ----------------------------------------------------
    // PUT - /plan-modality-activity-school-children/{id}
    // ----------------------------------------------------
    update: async ({
      params: { id },
      body: {
        data: { guardian: guardianData, child: childData, ...data },
      },
    }) => {
      try {
        const updatedPlanModalityActivitySchoolChild = await db.transaction(async (tx) => {
          await insertChildExtraData(childData!, guardianData!);
          await tx
            .update(planModalityActivitySchoolChildren)
            .set(data)
            .where(eq(planModalityActivitySchoolChildren.id, id));
          return (
            await tx
              .select()
              .from(planModalityActivitySchoolChildren)
              .where(eq(planModalityActivitySchoolChildren.id, id))
          ).at(0);
        });

        if (!updatedPlanModalityActivitySchoolChild) {
          return {
            status: 400,
            body: { message: 'Failed to update `planModalityActivitySchoolChild`.' },
          };
        }

        return { status: 200, body: updatedPlanModalityActivitySchoolChild };
      } catch (e) {
        return genTsRestErrorRes(e, {
          genericMsg: `Something went wrong updating 'planModalityActivitySchoolChild'.`,
        });
      }
    },
    // ----------------------------------------------------
    // DELETE - /plan-modality-activity-school-children/{id}
    // ----------------------------------------------------
    delete: async ({ params: { id } }) => {
      try {
        const [planModalityActivitySchoolChild] = await db
          .select()
          .from(planModalityActivitySchoolChildren)
          .where(eq(planModalityActivitySchoolChildren.id, id));
        if (!planModalityActivitySchoolChild) {
          return {
            status: 404,
            body: { message: `Unable to locate 'planModalityActivitySchoolChild' with id (${id})` },
          };
        }

        await db
          .delete(planModalityActivitySchoolChildren)
          .where(eq(planModalityActivitySchoolChildren.id, id));
        return { status: 200, body: planModalityActivitySchoolChild };
      } catch (e) {
        return genTsRestErrorRes(e, {
          genericMsg: `Something went wrong deleting 'planModalityActivitySchoolChild'.`,
        });
      }
    },
  }
);
