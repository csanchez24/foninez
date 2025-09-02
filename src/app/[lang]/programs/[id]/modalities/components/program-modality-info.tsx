import type { Modality } from './@types';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ProgramModalityInfoTabs } from './program-modality-info-tabs';

import { useStoreContext } from '@/store';

export function ProgramModalityInfoSheet({
  modality,
  opened,
  onOpened,
}: {
  modality: Modality | undefined;
  opened: boolean;
  onOpened(opened: boolean): void;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.modality.info);

  return (
    <Sheet open={opened} onOpenChange={(open) => onOpened(open)}>
      <SheetContent className="w-full overflow-y-scroll sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>
            <div>
              {dictionary.heading}{' '}
              <span className="text-muted-foreground">[ Id: {modality?.id} ]</span>
            </div>
          </SheetTitle>
          <SheetDescription>{dictionary.description}</SheetDescription>
        </SheetHeader>
        <ProgramModalityInfoTabs modality={modality} />
      </SheetContent>
    </Sheet>
  );
}
