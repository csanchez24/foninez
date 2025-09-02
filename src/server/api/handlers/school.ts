import { db } from '@/server/db';
import { schools } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { between, eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';
import type { ReportSchool } from '../types';

const paginate = createPaginator();

export const school = tsr.router(contract.school, {
  // ----------------------------------------------------
  // GET - /schools
  // ----------------------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(schools)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.schools.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(schools).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying schools.',
      });
    }
  },
  // ----------------------------------------------------
  // GET - /schools/{id}
  // ----------------------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const school = await db.query.schools.findFirst({
        where: eq(schools.id, id),
        with: parseDrizzleFindUniqueQuery(schools)(query).with,
      });

      if (!school) {
        return {
          status: 404,
          body: { message: `Unable to locate 'school' with id (${id})` },
        };
      }

      return { status: 200, body: school };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting 'school' with id (${id}).`,
      });
    }
  },
  // ----------------------------------------------------
  // POST - /schools
  // ----------------------------------------------------
  create: async ({ body: { data } }) => {
    try {
      const newSchool = await db.transaction(async (tx) => {
        const [{ insertId }] = await tx.insert(schools).values(data);
        return (await tx.select().from(schools).where(eq(schools.id, insertId))).at(0);
      });

      if (!newSchool) {
        return { status: 400, body: { message: 'Failed to create `school`.' } };
      }

      return { status: 201, body: newSchool };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating 'school'.`,
      });
    }
  },
  // ----------------------------------------------------
  // PUT - /schools/{id}
  // ----------------------------------------------------
  update: async ({ params: { id }, body: { data } }) => {
    try {
      const updatedSchool = await db.transaction(async (tx) => {
        await tx.update(schools).set(data).where(eq(schools.id, id));
        return (await tx.select().from(schools).where(eq(schools.id, id))).at(0);
      });

      if (!updatedSchool) {
        return { status: 400, body: { message: 'Failed to update `school`.' } };
      }

      return { status: 200, body: updatedSchool };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating 'school'.`,
      });
    }
  },
  // ----------------------------------------------------
  // DELETE - /schools/{id}
  // ----------------------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [school] = await db.select().from(schools).where(eq(schools.id, id));
      if (!school) {
        return {
          status: 404,
          body: { message: `Unable to locate 'school' with id (${id})` },
        };
      }

      await db.delete(schools).where(eq(schools.id, id));
      return { status: 200, body: school };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong deleting 'school'.`,
      });
    }
  },
  report: async ({ body: { startDate, endDate } }) => {
    const schoolData = await db.query.schools.findMany({
      where: between(schools.createdAt, startDate, endDate),
      with: {
        city: true,
        planModalityActivitySchools: true,
      },
    });

    const response = schoolData.map((school) => {
      return {
        nombre: school.name,
        area: school.areaType,
        dane: school.daneCode,
        sede: school.branchCode,
        ciudad: school.city.name,
        sector: school.sectorType,
        infrastructura: school.infrastructureCode,
        actividades: school.planModalityActivitySchools.length ?? 0,
      } satisfies ReportSchool;
    });

    return { status: 200, body: response };
  },
});
