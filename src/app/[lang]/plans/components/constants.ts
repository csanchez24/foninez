import type { PlanFormValues } from './@types';

export const PLAN_STATUSES: PlanFormValues['status'][] = [
  'draft',
  'pending review',
  'reviewed',
  'approved',
  'rejected',
];
