import { db } from '@/server/db';
import { genTsRestErrorRes } from '@/server/utils/gen-ts-rest-error';
import { tsr } from '@ts-rest/serverless/next';
import { and, count, countDistinct, desc, eq, sql, sum } from 'drizzle-orm';
import { contract } from '../contracts';
import type { DashboardResponse } from '../types';
import {
  inventoryTransactions,
  planModalityActivities,
  planModalityActivitySchoolChildren,
  planModalityActivitySchools,
  plans,
} from '@/server/db/schema';

export const dashboard = tsr.router(contract.dashboard, {
  // --------------------------------------
  // GET - /dashboard/{year}
  // --------------------------------------
  dashboard: async ({ params: { year } }) => {
    try {
      const [
        [totalActivities],
        [completeActivities],
        [executingActivities],
        [totalSchool],
        [budgetChildren],
        [totalChildren],
        inventories,
        years,
        statusChart,
      ] = await Promise.all([
        db.select({ count: count() }).from(planModalityActivitySchools),
        db
          .select({ count: count() })
          .from(planModalityActivitySchools)
          .where(eq(planModalityActivitySchools.status, 'completed')),
        db
          .select({ count: count() })
          .from(planModalityActivitySchools)
          .where(eq(planModalityActivitySchools.status, 'active')),
        db
          .select({ count: countDistinct(planModalityActivitySchools.schoolId) })
          .from(planModalityActivitySchools),
        db
          .select({ sum: sum(planModalityActivitySchools.participantsQty).as<number>() })
          .from(planModalityActivitySchools),
        db
          .select({ count: count(planModalityActivitySchoolChildren.childId) })
          .from(planModalityActivitySchoolChildren),
        db.query.inventoryTransactions.findMany({
          orderBy: desc(inventoryTransactions.id),
          limit: 5,
          with: {
            planModalityActivitySchool: {
              with: {
                school: true,
                planModalityActivity: true,
              },
            },
          },
        }),
        db.selectDistinct({ year: plans.year }).from(plans).orderBy(desc(plans.year)),
        db
          .select({ status: planModalityActivitySchools.status, value: count() })
          .from(planModalityActivitySchools)
          .groupBy(planModalityActivitySchools.status),
      ]);

      const registerMonthly = [];
      const activityMonthly = [];
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      for (let i = 1; i <= 12; i++) {
        const month = months[i]!;

        const [participantsQty] = await db
          .select({ sum: sum(planModalityActivitySchools.participantsQty).as<number>() })
          .from(planModalityActivities)
          .innerJoin(
            planModalityActivitySchools,
            eq(planModalityActivitySchools.planModalityActivityId, planModalityActivities.id)
          )
          .where(
            and(
              eq(sql`EXTRACT(YEAR FROM ${planModalityActivities.startDate})`, year),
              eq(sql`EXTRACT(MONTH FROM ${planModalityActivities.startDate})`, i)
            )
          );

        const [registerQty] = await db
          .select({ count: count(planModalityActivitySchoolChildren.childId) })
          .from(planModalityActivities)
          .innerJoin(
            planModalityActivitySchools,
            eq(planModalityActivitySchools.planModalityActivityId, planModalityActivities.id)
          )
          .innerJoin(
            planModalityActivitySchoolChildren,
            eq(
              planModalityActivitySchools.id,
              planModalityActivitySchoolChildren.planModalityActivitySchoolId
            )
          )
          .where(
            and(
              eq(sql`EXTRACT(YEAR FROM ${planModalityActivities.startDate})`, year),
              eq(sql`EXTRACT(MONTH FROM ${planModalityActivities.startDate})`, i)
            )
          );

        const [activityMonthlyQty] = await db
          .select({ count: count(planModalityActivitySchools.participantsQty) })
          .from(planModalityActivities)
          .innerJoin(
            planModalityActivitySchools,
            eq(planModalityActivitySchools.planModalityActivityId, planModalityActivities.id)
          )
          .where(
            and(
              eq(sql`EXTRACT(YEAR FROM ${planModalityActivities.startDate})`, year),
              eq(sql`EXTRACT(MONTH FROM ${planModalityActivities.startDate})`, i)
            )
          );

        const [activityMonthlyCompleteQty] = await db
          .select({ count: count(planModalityActivitySchools.participantsQty) })
          .from(planModalityActivities)
          .innerJoin(
            planModalityActivitySchools,
            eq(planModalityActivitySchools.planModalityActivityId, planModalityActivities.id)
          )
          .where(
            and(
              eq(sql`EXTRACT(YEAR FROM ${planModalityActivities.startDate})`, year),
              eq(sql`EXTRACT(MONTH FROM ${planModalityActivities.startDate})`, i),
              eq(planModalityActivitySchools.status, 'completed')
            )
          );

        registerMonthly.push({
          name: month,
          value1: participantsQty?.sum ?? 0,
          value2: registerQty?.count ?? 0,
        });

        activityMonthly.push({
          name: month,
          value1: activityMonthlyQty?.count ?? 0,
          value2: activityMonthlyCompleteQty?.count ?? 0,
        });
      }
      const y = new Set([...years.map((y) => y.year), new Date().getFullYear()]);
      const response: DashboardResponse = {
        totalActivities: totalActivities?.count ?? 0,
        completeActivities: completeActivities?.count ?? 0,
        executingActivities: executingActivities?.count ?? 0,
        totalSchool: totalSchool?.count ?? 0,
        totalChildren: totalChildren?.count ?? 0,
        budgetChildren: budgetChildren?.sum ?? 0,
        inventories,
        registerMonthly,
        activityMonthly,
        statusChart: statusChart,
        years: Array.from(y),
      };
      return { status: 200, body: response };
    } catch (e) {
      return genTsRestErrorRes(e, {
        genericMsg: `Something went wrong getting data with id (${year}).`,
      });
    }
  },
});
