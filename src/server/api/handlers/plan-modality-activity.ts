import { db } from '@/server/db';
import {
  planModalityActivities,
  planModalityActivityResources,
  planModalityActivityProofFiles,
  planModalityActivitySchools,
  planModalities,
} from '@/server/db/schema';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { createPaginator } from '@/server/utils/paginate';
import { tsr } from '@ts-rest/serverless/next';
import { and, eq, sql } from 'drizzle-orm';
import { contract } from '../contracts';
import { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } from './_utils';

const paginate = createPaginator();

async function getOrInsertPlanModality(planId: number, modalityId: number) {
  const [planModality] = await db
    .select()
    .from(planModalities)
    .where(and(eq(planModalities.planId, planId), eq(planModalities.modalityId, modalityId)));
  if (planModality) return planModality.id;

  const [{ insertId }] = await db.insert(planModalities).values({ planId, modalityId });
  return insertId;
}

export const planModalityActivity = tsr.router(contract.planModalityActivity, {
  // ----------------------------------------------------
  // GET - /plan-modality-activities
  // ----------------------------------------------------
  findMany: async ({ query }) => {
    try {
      const q = parseDrizzleFindManyQuery(planModalityActivities)(query);

      const body = await paginate({
        page: query.page,
        limit: query.limit,
        $transaction: ({ limit, offset }) =>
          db.transaction(async (tx) => {
            const a = await tx.query.planModalityActivities.findMany({ ...q, limit, offset });
            const c = await tx.select({ count: sql<number>`count(*)` }).from(planModalityActivities).where(q.where) // prettier-ignore
            return [a, c[0]!.count];
          }),
      });

      return { status: 200, body };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: 'Something went wrong querying `planModalityActivities`.',
      });
    }
  },
  // ----------------------------------------------------
  // GET - /plan-modality-activities/{id}
  // ----------------------------------------------------
  findUnique: async ({ params: { id }, query }) => {
    try {
      const planModalityActivity = await db.query.planModalityActivities.findFirst({
        where: eq(planModalityActivities.id, id),
        with: parseDrizzleFindUniqueQuery(planModalityActivities)(query).with,
      });

      if (!planModalityActivity) {
        return {
          status: 404,
          body: { message: `Unable to locate 'planModalityActivity' with id (${id})` },
        };
      }

      return { status: 200, body: planModalityActivity };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting 'planModalityActivity' with id (${id}).`,
      });
    }
  },
  // ----------------------------------------------------
  // POST - /plan-modality-activities
  // ----------------------------------------------------
  create: async ({
    body: {
      data: { schools, resources, proofFiles, ...data },
    },
  }) => {
    try {
      //create or find plan modality

      const [newPlanModalityActivity] = await db.transaction(async (tx) => {
        const planModalityId = await getOrInsertPlanModality(data.planId, data.planModalityId);

        const [{ insertId: planModalityActivityId }] = await tx
          .insert(planModalityActivities)
          .values({ ...data, planModalityId });

        if (schools && schools.length > 0) {
          const schoolValues = schools.map(({ school, ...values }) => ({
            ...values,
            schoolId: school.id,
            planModalityActivityId,
            startDate: data.startDate,
            endDate: data.endDate,
          }));
          await tx.insert(planModalityActivitySchools).values(schoolValues);
        }

        if (resources && resources.length > 0) {
          const resourceValues = resources.map(({ resource, ...values }) => ({
            ...values,
            resourceId: resource.id,
            planModalityActivityId,
          }));
          await tx.insert(planModalityActivityResources).values(resourceValues);
        }

        if (proofFiles && proofFiles.length > 0) {
          const proofFileValues = proofFiles.map(({ proofFileClassification, ...values }) => ({
            ...values,
            proofFileClassificationId: proofFileClassification.id,
            planModalityActivityId,
          }));
          await tx.insert(planModalityActivityProofFiles).values(proofFileValues);
        }

        return tx
          .select()
          .from(planModalityActivities)
          .where(eq(planModalityActivities.id, planModalityActivityId));
      });

      if (!newPlanModalityActivity) {
        return { status: 400, body: { message: 'Failed to create `planModalityActivity`.' } };
      }

      return { status: 201, body: newPlanModalityActivity };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong creating 'planModalityActivity'.`,
      });
    }
  },
  // ----------------------------------------------------
  // PUT - /plan-modality-activities/{id}
  // ----------------------------------------------------
  update: async ({
    params: { id },
    body: {
      data: { schools, resources, proofFiles, ...data },
    },
  }) => {
    try {
      const updatedPlanModalityActivity = await db.transaction(async (tx) => {
        const planModalityId = await getOrInsertPlanModality(
          data.planId ?? 0,
          data.planModalityId ?? 0
        );
        await tx
          .update(planModalityActivities)
          .set({ ...data, planModalityId })
          .where(eq(planModalityActivities.id, id));

        const [planModalityActivity] = await tx
          .select()
          .from(planModalityActivities)
          .where(eq(planModalityActivities.id, id));

        if (!planModalityActivity) {
          throw new Error('no plan');
        }
        // Empty and/or arrays with values means delete everything from table belonging to
        // planModalityActivity and add new entries existing in array, whereas undefined
        // means do nothing
        if (schools) {
          await tx
            .delete(planModalityActivitySchools)
            .where(eq(planModalityActivitySchools.planModalityActivityId, id));

          const schoolValues = schools.map(({ school, ...values }) => ({
            ...values,
            schoolId: school.id,
            planModalityActivityId: id,
            startDate: planModalityActivity.startDate,
            endDate: planModalityActivity.endDate,
          }));

          if (schoolValues.length > 0) {
            await tx.insert(planModalityActivitySchools).values(schoolValues);
          }
        }

        // Same as schools
        if (resources) {
          await tx
            .delete(planModalityActivityResources)
            .where(eq(planModalityActivityResources.planModalityActivityId, id));

          const resourceValues = resources.map(({ resource, ...values }) => ({
            ...values,
            resourceId: resource.id,
            planModalityActivityId: id,
          }));

          if (resourceValues.length > 0) {
            await tx.insert(planModalityActivityResources).values(resourceValues);
          }
        }

        if (proofFiles) {
          await tx
            .delete(planModalityActivityProofFiles)
            .where(eq(planModalityActivityProofFiles.planModalityActivityId, id));

          const proofFileValues = proofFiles.map(({ proofFileClassification, ...values }) => ({
            ...values,
            proofFileClassificationId: proofFileClassification.id,
            planModalityActivityId: id,
          }));

          if (proofFileValues.length > 0) {
            await tx.insert(planModalityActivityProofFiles).values(proofFileValues);
          }
        }

        return planModalityActivity;
      });

      if (!updatedPlanModalityActivity) {
        return { status: 400, body: { message: 'Failed to update `planModalityActivity`.' } };
      }

      return { status: 200, body: updatedPlanModalityActivity };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong updating 'planModalityActivity'.`,
      });
    }
  },
  // ----------------------------------------------------
  // DELETE - /plan-modality-activities/{id}
  // ----------------------------------------------------
  delete: async ({ params: { id } }) => {
    try {
      const [planModalityActivity] = await db
        .select()
        .from(planModalityActivities)
        .where(eq(planModalityActivities.id, id));

      if (!planModalityActivity) {
        return {
          status: 404,
          body: { message: `Unable to locate 'planModalityActivity' with id (${id})` },
        };
      }

      await db.delete(planModalityActivities).where(eq(planModalityActivities.id, id));
      return { status: 200, body: planModalityActivity };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong deleting 'planModalityActivity'.`,
      });
    }
  },
});
