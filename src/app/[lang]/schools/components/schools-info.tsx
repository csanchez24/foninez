import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type { School } from './@types';
import { useStoreContext } from '@/store';
import { SchoolsTabs } from './schools-tabs';

export function SchoolInfoSheet({
  school,
  opened,
  onOpened,
}: {
  school: School | undefined;
  opened: boolean;
  onOpened(opened: boolean): void;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.school.info);

  return (
    <Sheet open={opened} onOpenChange={(open) => onOpened(open)}>
      <SheetContent className="w-full overflow-y-scroll sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>
            {school ? (
              <div>
                {dictionary.heading}{' '}
                <span className="text-muted-foreground">[ {school?.name} ]</span>
              </div>
            ) : (
              <div>{dictionary.heading}</div>
            )}
          </SheetTitle>
        </SheetHeader>
        <SchoolsTabs school={school} />
      </SheetContent>
    </Sheet>
  );
}
