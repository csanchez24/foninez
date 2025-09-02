import { useStoreContext } from '@/store';
import type { Activity } from './@types';

import { formatDate } from '@/utils/format-date';

function InfoBlock({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-3 text-sm">
      <div className="text-xs font-medium uppercase leading-7 text-foreground">{label}</div>
      <div className="capitalize text-muted-foreground">{value}</div>
    </div>
  );
}

export default function ActivityTabsInfo({ activity }: { activity: Activity | undefined }) {
  const dictionary = useStoreContext((state) => state.dictionary.activity.info);

  const dictionaryStatus = useStoreContext(
    (state) => state.dictionary.activity.table.columns.statuses.values
  );

  const data = [
    { label: dictionary.columns.activity, value: activity?.planModalityActivity?.name ?? '' },
    {
      label: dictionary.columns.school,
      value: activity?.school?.name ?? '',
    },
    { label: dictionary.columns.participantsQty, value: activity?.participantsQty ?? '' },
    {
      label: dictionary.columns.status,
      value: dictionaryStatus.find((s) => s.value === activity?.status)?.label ?? '',
    },
    {
      label: dictionary.columns.rejectNote,
      value: activity?.rejectionNote ?? '',
    },
    {
      label: dictionary.columns.createdAt,
      value: formatDate(activity?.createdAt ?? '', 'y-MM-dd'),
    },
  ];

  return (
    <div>
      <div className="mb-8 grid grid-cols-2">
        {data.map((d) => (
          <InfoBlock key={d.label} {...d} />
        ))}
      </div>
    </div>
  );
}
