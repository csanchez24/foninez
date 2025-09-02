import type { Modality } from './@types';

import { useStoreContext } from '@/store';
import { formatDate } from '@/utils/format-date';

export default function ProgramModalityInfoTabsPrimary({
  modality,
}: {
  modality?: Modality | undefined;
}) {
  const dictionary = useStoreContext(
    (state) => state.dictionary.modality.info.primaryInformationTab
  );

  // prettier-ignore
  const data = [
    { label: dictionary.fields.name, value: modality?.name ?? '' },
    { label: dictionary.fields.description, value: modality?.description ?? '' },
    { label: dictionary.fields.program, value: modality?.program?.name ?? '' },
    { label: dictionary.fields.createdDate, value: formatDate(modality?.createdAt , 'yyyy-mm-dd')?? '' },
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
