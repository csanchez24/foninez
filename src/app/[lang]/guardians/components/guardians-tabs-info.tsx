import { useStoreContext } from '@/store';
import type { Guardian } from './@types';

import { format } from 'date-fns';

function InfoBlock({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-3 text-sm">
      <div className="text-xs font-medium uppercase leading-7 text-foreground">{label}</div>
      <div className="capitalize text-muted-foreground">{value}</div>
    </div>
  );
}

export default function GuardiansTabsInfo({ guardian }: { guardian: Guardian | undefined }) {
  const dictionary = useStoreContext((state) => state.dictionary.guardian.info);

  const data = [
    { label: dictionary.columns.idNum, value: guardian?.idNum ?? '' },
    { label: dictionary.columns.identification, value: guardian?.identification?.name ?? '' },
    { label: dictionary.columns.firstName, value: guardian?.firstName ?? '' },
    { label: dictionary.columns.middleName, value: guardian?.middleName ?? '' },
    { label: dictionary.columns.lastName, value: guardian?.lastName ?? '' },
    { label: dictionary.columns.secondLastName, value: guardian?.secondLastName ?? '' },
    { label: dictionary.columns.phone, value: guardian?.phone ?? '' },
    {
      label: dictionary.columns.children,
      value: guardian?.children?.length ?? 0,
    },
    {
      label: dictionary.columns.createdAt,
      value: (guardian?.createdAt && format(guardian?.createdAt, 'yyyy-MM-dd')) ?? '',
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
