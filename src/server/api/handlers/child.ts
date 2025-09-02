import { db } from '@/server/db';
import { children } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { between, eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';
import type { ReportChildren } from '../types';
import { format } from 'date-fns';

const paginate = createPaginator();

export const child = tsr.router(contract.child, {
  // --------------------------------------
  // GET - /chilren
  // --------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(children)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.children.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(children).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying children.',
      });
    }
  },
  // --------------------------------------
  // GET - /chilren/{id}
  // --------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const child = await db.query.children.findFirst({
        where: eq(children.id, id),
        with: parseDrizzleFindUniqueQuery(children)(query).with,
      });

      if (!child) {
        return { status: 404, body: { message: `Unable to locate child with id (${id})` } };
      }

      return { status: 200, body: child };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting child with id (${id}).`,
      });
    }
  },
  // --------------------------------------
  // POST - /chilren
  // --------------------------------------
  create: async ({ body: { data } }) => {
    try {
      const newChild = await db.transaction(async (tx) => {
        const [{ insertId: childId }] = await tx.insert(children).values(data);
        return (await tx.select().from(children).where(eq(children.id, childId))).at(0);
      });

      if (!newChild) {
        return { status: 400, body: { message: 'Failed to create child.' } };
      }

      return { status: 201, body: newChild };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating child.`,
      });
    }
  },
  // --------------------------------------
  // PUT - /chilren/{id}
  // --------------------------------------
  update: async ({ params: { id }, body: { data } }) => {
    try {
      const updatedChild = await db.transaction(async (tx) => {
        await tx.update(children).set(data).where(eq(children.id, id));
        return (await tx.select().from(children).where(eq(children.id, id))).at(0);
      });

      if (!updatedChild) {
        return { status: 400, body: { message: 'Failed to update child.' } };
      }

      return { status: 200, body: updatedChild };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating child.`,
      });
    }
  },
  // --------------------------------------
  // DELETE - /chilren/{id}
  // --------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [child] = await db.select().from(children).where(eq(children.id, id));
      if (!child) {
        return { status: 404, body: { message: `Unable to locate child with id (${id})` } };
      }

      await db.delete(children).where(eq(children.id, id));
      return { status: 200, body: child };
    } catch (e) {
      return genTsRestErrorRes(e, { genericMsg: `Something went wrong deleting child.` });
    }
  },
  report: async ({ body: { startDate, endDate } }) => {
    const childrenData = await db.query.children.findMany({
      where: between(children.createdAt, startDate, endDate),
      with: {
        identification: true,
        guardian: true,
        shift: true,
        gender: true,
        country: true,
        birthCity: true,
        ethnicity: true,
        birthState: true,
        population: true,
        schoolGrade: true,
        educationLevel: true,
        beneficiaryType: true,
        indigenousReserve: true,
        indigenousCommunity: true,
        vulnerabilityFactor: true,
        planModalityActivitySchoolChildren: true,
      },
    });

    const response = childrenData.map((child) => {
      return {
        tipoDocumento: child.identification?.name ?? '',
        numeroDocumento: child.idNum,
        primerNombre: child.firstName,
        segundoNombre: child.middleName ?? '',
        primerApellido: child.lastName,
        segundoApellido: child.secondLastName ?? '',
        guardian: `${child.guardian.firstName} ${child.guardian.lastName}`,
        direccion: child.address ?? '',
        area: child.areaType,
        pais: child.country.name,
        genero: child.gender.name,
        jornada: child.shift.name,
        etnicidad: child.ethnicity.name,
        population: child.population.name,
        gradoEscolar: child.schoolGrade.name,
        nivelEducacion: child.educationLevel.name,
        vulnerabilidad: child.vulnerabilityFactor.name,
        reservaIndigena: child.indigenousReserve.name,
        comunidadIndigena: child.indigenousCommunity.name,
        ciudadNacimiento: child.birthCity.name,
        estadoNacimiento: child.birthState.name,
        notaRechazo: child.deactivationReason ?? '',
        fechaAfiliacion: child.affiliationDate ? format(child.affiliationDate, 'PPP') : '',
        fechaNacimiento: child.birthDate ? format(child.birthDate, 'PPP') : '',
        fechaInactivacion: child.deactivationDate ? format(child.deactivationDate, 'PPP') : '',
        actividades: child.planModalityActivitySchoolChildren.length ?? 0,
      } satisfies ReportChildren;
    });

    return { status: 200, body: response };
  },
});
