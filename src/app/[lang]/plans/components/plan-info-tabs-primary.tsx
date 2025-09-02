import type { Plan } from './@types';

import { useStoreContext } from '@/store';
import { formatDate } from '@/utils/format-date';

export default function PlanInfoTabsPrimary({ plan }: { plan?: Plan | undefined }) {
  const dictionary = useStoreContext((state) => state.dictionary.plan.info.primaryInformationTab);

  // prettier-ignore
  const data = [
    { label: dictionary.fields.year, value: plan?.year ?? '' },
    { label: dictionary.fields.description, value: plan?.description ?? '' },
    { label: dictionary.fields.shortTermObjective, value: plan?.shortTermObjective ?? '' },
    { label: dictionary.fields.longTermObjective, value: plan?.longTermObjective ?? '' },
    { label: dictionary.fields.justification, value: plan?.justification ?? '' },
    { label: dictionary.fields.status, value: plan?.status ?? '' },
    { label: dictionary.fields.program, value: plan?.program?.name ?? '' },
    { label: dictionary.fields.createdDate, value: formatDate(plan?.createdAt , 'yyyy-mm-dd') ?? '' },
    { label: dictionary.fields.rejectionNote, value: plan?.rejectionNote ?? '' },
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
