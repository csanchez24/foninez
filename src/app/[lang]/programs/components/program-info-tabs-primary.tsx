import type { Program } from './@types';

import { useStoreContext } from '@/store';
import { formatDate } from '@/utils/format-date';

export default function ProgramInfoTabsPrimary({ program }: { program?: Program | undefined }) {
  const dictionary = useStoreContext(
    (state) => state.dictionary.program.info.primaryInformationTab
  );

  // prettier-ignore
  const data = [
    { label: dictionary.fields.name, value: program?.name ?? '' },
    { label: dictionary.fields.description, value: program?.description ?? '' },
    { label: dictionary.fields.createdDate, value: formatDate(program?.createdAt , 'yyyy-mm-dd')?? '' },
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
