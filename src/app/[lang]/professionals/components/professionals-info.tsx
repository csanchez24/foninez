import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type { Professional } from './@types';
import { useStoreContext } from '@/store';
import { ProfessionalsTabs } from './professionals-tabs';

export function ProfessionalInfoSheet({
  professional,
  opened,
  onOpened,
}: {
  professional: Professional | undefined;
  opened: boolean;
  onOpened(opened: boolean): void;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.professional.info);

  return (
    <Sheet open={opened} onOpenChange={(open) => onOpened(open)}>
      <SheetContent className="w-full overflow-y-scroll sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>
            {professional ? (
              <div>
                {dictionary.heading}{' '}
                <span className="text-muted-foreground">[ {professional?.idNum} ]</span>
              </div>
            ) : (
              <div>{dictionary.heading}</div>
            )}
          </SheetTitle>
        </SheetHeader>
        <ProfessionalsTabs professional={professional} />
      </SheetContent>
    </Sheet>
  );
}
