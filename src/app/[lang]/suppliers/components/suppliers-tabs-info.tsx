import { useStoreContext } from '@/store';
import type { Supplier } from './@types';

import { format } from 'date-fns';

function InfoBlock({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-3 text-sm">
      <div className="text-xs font-medium uppercase leading-7 text-foreground">{label}</div>
      <div className="capitalize text-muted-foreground">{value}</div>
    </div>
  );
}

export default function SuppliersTabsInfo({ supplier }: { supplier: Supplier | undefined }) {
  const dictionary = useStoreContext((state) => state.dictionary.supplier.info);

  const data = [
    { label: dictionary.columns.name, value: supplier?.name ?? '' },
    {
      label: dictionary.columns.createdAt,
      value: (supplier?.createdAt && format(supplier?.createdAt, 'yyyy-MM-dd')) ?? '',
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
