import type { PlanModalityActivity } from './@types';

import { useStoreContext } from '@/store';
import { formatDate } from '@/utils/format-date';

export default function PlanModalityActivityInfoTabsPrimary({
  planModalityActivity,
}: {
  planModalityActivity?: PlanModalityActivity | undefined;
}) {
  const dictionary = useStoreContext(
    (state) => state.dictionary.planModalityActivity.info.primaryInformationTab
  );

  // prettier-ignore
  const data = [
    { label: dictionary.fields.name, value: planModalityActivity?.name ?? '' },
    { label: dictionary.fields.description, value: planModalityActivity?.description ?? '' },
    { label: dictionary.fields.planModality, value: planModalityActivity?.planModality?.modality?.name ?? '' },
    { label: dictionary.fields.requiredProofOfCompletionCount, value: planModalityActivity?.requiredProofOfCompletionCount ?? '' },
    { label: dictionary.fields.startDate, value: formatDate(planModalityActivity?.startDate, 'yyyy-mm-dd')?? '' },
    { label: dictionary.fields.endDate, value: formatDate(planModalityActivity?.endDate, 'yyyy-mm-ddd') ?? '' },
    { label: dictionary.fields.createdDate, value: formatDate(planModalityActivity?.createdAt , 'yyyy-mm-dd')?? '' },
  ];

  return (
    <div>
      <div className="mb-8 grid grid-cols-2">
        {data.map((d) => (
          <div key={d.label} className="p-3 text-sm">
            <div className="text-xs font-medium uppercase leading-7 text-foreground">{d.label}</div>
            <div className="capitalize text-muted-foreground">{d.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
