import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type { Guardian } from './@types';
import { useStoreContext } from '@/store';
import { GuardiansTabs } from './guardians-tabs';

export function GuardianInfoSheet({
  guardian,
  opened,
  onOpened,
}: {
  guardian: Guardian | undefined;
  opened: boolean;
  onOpened(opened: boolean): void;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.guardian.info);

  return (
    <Sheet open={opened} onOpenChange={(open) => onOpened(open)}>
      <SheetContent className="w-full overflow-y-scroll sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>
            {guardian ? (
              <div>
                {dictionary.heading}{' '}
                <span className="text-muted-foreground">[ {guardian?.idNum} ]</span>
              </div>
            ) : (
              <div>{dictionary.heading}</div>
            )}
          </SheetTitle>
        </SheetHeader>
        <GuardiansTabs guardian={guardian} />
      </SheetContent>
    </Sheet>
  );
}
