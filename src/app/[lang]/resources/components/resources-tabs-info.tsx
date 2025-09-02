import { useStoreContext } from '@/store';
import type { Resource } from './@types';

import { toCOPCurrency } from '@/utils/currency-formatters';
import { formatDate } from '@/utils/format-date';

function InfoBlock({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-3 text-sm">
      <div className="text-xs font-medium uppercase leading-7 text-foreground">{label}</div>
      <div className="capitalize text-muted-foreground">{value}</div>
    </div>
  );
}

export default function ResourcesTabsInfo({ resource }: { resource: Resource | undefined }) {
  const dictionary = useStoreContext((state) => state.dictionary.resource.info);

  const data = [
    { label: dictionary.columns.name, value: resource?.name ?? '' },
    {
      label: dictionary.columns.classification,
      value: resource?.resourceClassification?.name ?? '',
    },
    { label: dictionary.columns.type, value: resource?.type ?? '' },
    { label: dictionary.columns.usageType, value: resource?.usageType ?? '' },
    {
      label: dictionary.columns.supplier,
      value: resource?.resourcesToSuppliers?.map((s) => s.supplier?.name ?? '').join(', ') ?? '',
    },
    { label: dictionary.columns.price, value: `$${toCOPCurrency(resource?.price ?? 0)}` },
    { label: dictionary.columns.inventory, value: resource?.inventory?.qty ?? 0 },
    {
      label: dictionary.columns.createdAt,
      value: formatDate(resource?.createdAt ?? '', 'y-MM-dd'),
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
