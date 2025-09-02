import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type { SchoolChild } from './@types';
import { useStoreContext } from '@/store';
import { format } from 'date-fns';

function InfoBlock({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-3 text-sm">
      <div className="text-xs font-medium uppercase leading-7 text-foreground">{label}</div>
      <div className="capitalize text-muted-foreground">{value}</div>
    </div>
  );
}

export function RegisterInfoSheet({
  schoolChild,
  opened,
  onOpened,
}: {
  schoolChild: SchoolChild | undefined;
  opened: boolean;
  onOpened(opened: boolean): void;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.register.info);

  const data = [
    {
      label: dictionary.columns.identification,
      value: schoolChild?.child?.identification?.name ?? '',
    },
    { label: dictionary.columns.firstName, value: schoolChild?.child?.firstName ?? '' },
    { label: dictionary.columns.middleName, value: schoolChild?.child?.middleName ?? '' },
    { label: dictionary.columns.lastName, value: schoolChild?.child?.lastName ?? '' },
    { label: dictionary.columns.secondLastName, value: schoolChild?.child?.secondLastName ?? '' },
    {
      label: dictionary.columns.createdAt,
      value: (schoolChild?.createdAt && format(schoolChild?.createdAt, 'yyyy-MM-dd')) ?? '',
    },
  ];

  const dataGuardian = [
    {
      label: dictionary.columns.identification,
      value: schoolChild?.child?.guardian?.identification?.name ?? '',
    },
    { label: dictionary.columns.firstName, value: schoolChild?.child?.guardian?.firstName ?? '' },
    { label: dictionary.columns.middleName, value: schoolChild?.child?.guardian?.middleName ?? '' },
    { label: dictionary.columns.lastName, value: schoolChild?.child?.guardian?.lastName ?? '' },
    {
      label: dictionary.columns.secondLastName,
      value: schoolChild?.child?.guardian?.secondLastName ?? '',
    },
  ];

  return (
    <Sheet open={opened} onOpenChange={(open) => onOpened(open)}>
      <SheetContent className="w-full overflow-y-scroll sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>
            {schoolChild ? (
              <div>
                {dictionary.heading}{' '}
                <span className="text-muted-foreground">
                  [ {schoolChild?.child?.firstName} {schoolChild?.child?.lastName} ]
                </span>
              </div>
            ) : (
              <div>{dictionary.heading}</div>
            )}
          </SheetTitle>
        </SheetHeader>
        <div className="mb-8 grid grid-cols-2">
          {data.map((d) => (
            <InfoBlock key={d.label} {...d} />
          ))}
        </div>
        <h2>{dictionary.headingGuardian}</h2>
        <div className="mb-8 grid grid-cols-2">
          {dataGuardian.map((d) => (
            <InfoBlock key={d.label} {...d} />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
