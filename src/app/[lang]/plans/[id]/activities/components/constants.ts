import type { PlanModalityActivityFormValues } from './@types';

export const PLAN_SCHOOL_STATUSES: NonNullable<
  PlanModalityActivityFormValues['schools']
>[number]['status'][] = [
  'pending',
  'active',
  'planning',
  'completed',
  'confirmed_resources',
  'requested_resources',
];
