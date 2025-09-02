import { useStoreContext } from '@/store';
import type { School } from './@types';

import { format } from 'date-fns';

function InfoBlock({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-3 text-sm">
      <div className="text-xs font-medium uppercase leading-7 text-foreground">{label}</div>
      <div className="capitalize text-muted-foreground">{value}</div>
    </div>
  );
}

export default function SchoolsTabsInfo({ school }: { school: School | undefined }) {
  const dictionary = useStoreContext((state) => state.dictionary.school.info);

  const data = [
    { label: dictionary.columns.name, value: school?.name ?? '' },
    { label: dictionary.columns.infrastructureCode, value: school?.infrastructureCode ?? '' },
    { label: dictionary.columns.daneCode, value: school?.daneCode ?? '' },
    { label: dictionary.columns.branchCode, value: school?.branchCode ?? '' },
    { label: dictionary.columns.areaType.label, value: school?.areaType ?? '' },
    { label: dictionary.columns.sectorType.label, value: school?.sectorType ?? '' },
    { label: dictionary.columns.city, value: school?.city?.name ?? '' },
    {
      label: dictionary.columns.activities,
      value: school?.planModalityActivitySchools?.length ?? 0,
    },
    {
      label: dictionary.columns.created_date,
      value: (school?.createdAt && format(school?.createdAt, 'yyyy-MM-dd')) ?? '',
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
