import { useStoreContext } from '@/store';
import type { Professional } from './@types';

import { format } from 'date-fns';

function InfoBlock({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-3 text-sm">
      <div className="text-xs font-medium uppercase leading-7 text-foreground">{label}</div>
      <div className="capitalize text-muted-foreground">{value}</div>
    </div>
  );
}

export default function ProfessionalsTabsInfo({
  professional,
}: {
  professional: Professional | undefined;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.professional.info);

  const data = [
    { label: dictionary.columns.identification, value: professional?.identification?.name ?? '' },
    { label: dictionary.columns.idNum, value: professional?.idNum ?? '' },
    { label: dictionary.columns.firstName, value: professional?.firstName ?? '' },
    { label: dictionary.columns.middleName, value: professional?.middleName ?? '' },
    { label: dictionary.columns.lastName, value: professional?.lastName ?? '' },
    { label: dictionary.columns.secondLastName, value: professional?.secondLastName ?? '' },
    { label: dictionary.columns.email, value: professional?.email ?? '' },
    { label: dictionary.columns.phone, value: professional?.phone ?? '' },
    { label: dictionary.columns.address, value: professional?.address ?? '' },
    { label: dictionary.columns.isActive, value: professional?.isActive ? 'Yes' : 'No' },
    {
      label: dictionary.columns.activities,
      value: professional?.planModalityActivitySchoolProfessionals?.length ?? 0,
    },
    {
      label: dictionary.columns.createdAt,
      value: (professional?.createdAt && format(professional?.createdAt, 'yyyy-MM-dd')) ?? '',
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
