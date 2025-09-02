import type { Program } from './@types';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ProgramInfoTabs } from './program-info-tabs';

import { useStoreContext } from '@/store';

export function ProgramInfoSheet({
  program,
  opened,
  onOpened,
}: {
  program: Program | undefined;
  opened: boolean;
  onOpened(opened: boolean): void;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.program.info);

  return (
    <Sheet open={opened} onOpenChange={(open) => onOpened(open)}>
      <SheetContent className="w-full overflow-y-scroll sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>
            <div>
              {dictionary.heading}{' '}
              <span className="text-muted-foreground">[ Id: {program?.id} ]</span>
            </div>
          </SheetTitle>
          <SheetDescription>{dictionary.description}</SheetDescription>
        </SheetHeader>
        <ProgramInfoTabs program={program} />
      </SheetContent>
    </Sheet>
  );
}
