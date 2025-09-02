import { db } from '@/server/db';
import { professionals } from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { between, eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';
import { env } from '@/env';
import type { ReportProfessional } from '../types';

const paginate = createPaginator();

type User = {
  id?: number;
  email: string;
  isAdmin: boolean;
  isActive: boolean;
  firstName: string;
  lastName: string;
};

type UserResponse = {
  data: User[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
    pageSize: number;
    prev?: string;
    next?: string;
  };
};

const findUser = async (email: string) => {
  const params = {
    email,
  };
  const jsonString = JSON.stringify(params);
  const response = await fetch(
    `${env.FCF_IAM_API_URL}/api/v1/users?where=${encodeURIComponent(jsonString)}`
  );
  const data = (await response.json()) as UserResponse | undefined;
  return data?.data.at(0);
};

const deleteUser = async (id: number) => {
  const response = await fetch(`${env.FCF_IAM_API_URL}/api/v1/users/${id}`, {
    method: 'delete',
  });
  await response.json();
  return;
};

const createUser = async (user: User, password: string) => {
  const body = {
    data: {
      ...user,
      password,
    },
  };
  const response = await fetch(`${env.FCF_IAM_API_URL}/api/v1/users`, {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
  const data = (await response.json()) as User;
  return data;
};

export const professional = tsr.router(contract.professional, {
  // ----------------------------------------------------
  // GET - /professionals
  // ----------------------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(professionals)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.professionals.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(professionals).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying professionals.',
      });
    }
  },
  // ----------------------------------------------------
  // GET - /professionals/{id}
  // ----------------------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const professional = await db.query.professionals.findFirst({
        where: eq(professionals.id, id),
        with: parseDrizzleFindUniqueQuery(professionals)(query).with,
      });

      if (!professional) {
        return {
          status: 404,
          body: { message: `Unable to locate 'professional' with id (${id})` },
        };
      }

      return { status: 200, body: professional };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting 'professional' with id (${id}).`,
      });
    }
  },
  // ----------------------------------------------------
  // POST - /professionals
  // ----------------------------------------------------
  create: async ({
    body: {
      data: { authId, ...data },
    },
  }) => {
    try {
      const newProfessional = await db.transaction(async (tx) => {
        let user = await findUser(data.email);

        if (!user) {
          const newUser = await createUser(
            {
              email: data.email,
              isAdmin: false,
              isActive: data.isActive,
              firstName: data.firstName,
              lastName: data.lastName,
            },
            data.idNum
          );

          if (!newUser) {
            throw new Error('Failed to create.');
          }
          user = newUser;
        }
        authId = user.id!;
        const [{ insertId }] = await tx.insert(professionals).values({ authId, ...data });
        return (await tx.select().from(professionals).where(eq(professionals.id, insertId))).at(0);
      });

      if (!newProfessional) {
        return { status: 400, body: { message: 'Failed to create `professional`.' } };
      }

      return { status: 201, body: newProfessional };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating 'professional'.`,
      });
    }
  },
  // ----------------------------------------------------
  // PUT - /professionals/{id}
  // ----------------------------------------------------
  update: async ({
    params: { id },
    body: {
      data: { authId, ...data },
    },
  }) => {
    try {
      const updatedProfessional = await db.transaction(async (tx) => {
        let user = await findUser(data.email!);

        if (!user) {
          const newUser = await createUser(
            {
              email: data.email!,
              isAdmin: false,
              isActive: data.isActive!,
              firstName: data.firstName!,
              lastName: data.lastName!,
            },
            data.idNum!
          );

          if (!newUser) {
            throw new Error('Failed to create.');
          }
          user = newUser;
        }
        authId = user.id!;
        await tx
          .update(professionals)
          .set({ ...data, authId })
          .where(eq(professionals.id, id));
        return (await tx.select().from(professionals).where(eq(professionals.id, id))).at(0);
      });

      if (!updatedProfessional) {
        return { status: 400, body: { message: 'Failed to update `professional`.' } };
      }

      return { status: 200, body: updatedProfessional };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating 'professional'.`,
      });
    }
  },
  // ----------------------------------------------------
  // DELETE - /professionals/{id}
  // ----------------------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [professional] = await db.select().from(professionals).where(eq(professionals.id, id));
      if (!professional) {
        return {
          status: 404,
          body: { message: `Unable to locate 'professional' with id (${id})` },
        };
      }
      await deleteUser(professional.authId);

      await db.delete(professionals).where(eq(professionals.id, id));
      return { status: 200, body: professional };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong deleting 'professional'.`,
      });
    }
  },
  report: async ({ body: { startDate, endDate } }) => {
    const professionalsData = await db.query.professionals.findMany({
      where: between(professionals.createdAt, startDate, endDate),
      with: {
        identification: true,
        planModalityActivitySchoolProfessionals: true,
      },
    });

    const response = professionalsData.map((professional) => {
      return {
        tipoDocumento: professional.identification?.name ?? '',
        numeroDocumento: professional.idNum,
        primerNombre: professional.firstName,
        segundoNombre: professional.middleName ?? '',
        primerApellido: professional.lastName,
        segundoApellido: professional.secondLastName ?? '',
        email: professional.email,
        telefono: professional.phone ?? '',
        direccion: professional.address ?? '',
        estaActivo: professional.isActive ? 'Si' : 'No',
        actividades: professional.planModalityActivitySchoolProfessionals.length ?? 0,
      } satisfies ReportProfessional;
    });

    return { status: 200, body: response };
  },
});
