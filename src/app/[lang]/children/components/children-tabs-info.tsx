import { useStoreContext } from '@/store';
import type { Child } from './@types';

import { format } from 'date-fns';

function InfoBlock({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-3 text-sm">
      <div className="text-xs font-medium uppercase leading-7 text-foreground">{label}</div>
      <div className="capitalize text-muted-foreground">{value}</div>
    </div>
  );
}

export default function ChildrenTabsInfo({ child }: { child: Child | undefined }) {
  const dictionary = useStoreContext((state) => state.dictionary.child.info);

  const data = [
    { label: dictionary.columns.idNum, value: child?.idNum ?? '' },
    { label: dictionary.columns.identification, value: child?.identification?.name ?? '' },
    { label: dictionary.columns.firstName, value: child?.firstName ?? '' },
    { label: dictionary.columns.middleName, value: child?.middleName ?? '' },
    { label: dictionary.columns.lastName, value: child?.lastName ?? '' },
    { label: dictionary.columns.secondLastName, value: child?.secondLastName ?? '' },
    {
      label: dictionary.columns.guardian,
      value: `${child?.guardian?.firstName} ${child?.guardian?.lastName}` ?? '',
    },
    { label: dictionary.columns.gender, value: child?.gender?.name ?? '' },
    { label: dictionary.columns.country, value: child?.country?.name ?? '' },
    { label: dictionary.columns.birthState, value: child?.birthState?.name ?? '' },
    { label: dictionary.columns.birthCity, value: child?.birthCity?.name ?? '' },
    { label: dictionary.columns.educationLevel, value: child?.educationLevel?.name ?? '' },
    { label: dictionary.columns.schoolGrade, value: child?.schoolGrade?.name ?? '' },
    { label: dictionary.columns.areaType, value: child?.areaType ?? '' },
    { label: dictionary.columns.address, value: child?.address ?? '' },
    { label: dictionary.columns.ethnicity, value: child?.ethnicity?.name ?? '' },
    { label: dictionary.columns.population, value: child?.population?.name ?? '' },
    {
      label: dictionary.columns.vulnerabilityFactor,
      value: child?.vulnerabilityFactor?.name ?? '',
    },
    { label: dictionary.columns.shift, value: child?.shift?.name ?? '' },
    { label: dictionary.columns.indigenousReserve, value: child?.indigenousReserve?.name ?? '' },
    {
      label: dictionary.columns.indigenousCommunity,
      value: child?.indigenousCommunity?.name ?? '',
    },
    { label: dictionary.columns.deactivationReason, value: child?.deactivationReason ?? '' },
    {
      label: dictionary.columns.activities,
      value: child?.planModalityActivitySchoolChildren?.length ?? 0,
    },
    {
      label: dictionary.columns.birthDate,
      value: (child?.birthDate && format(child?.birthDate, 'yyyy-MM-dd')) ?? '',
    },
    {
      label: dictionary.columns.affiliationDate,
      value: (child?.affiliationDate && format(child?.affiliationDate, 'yyyy-MM-dd')) ?? '',
    },
    {
      label: dictionary.columns.deactivationDate,
      value: (child?.deactivationDate && format(child?.deactivationDate, 'yyyy-MM-dd')) ?? '',
    },
    {
      label: dictionary.columns.createdAt,
      value: (child?.createdAt && format(child?.createdAt, 'yyyy-MM-dd')) ?? '',
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
