import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type { Child } from './@types';
import { useStoreContext } from '@/store';
import { ChildrenTabs } from './children-tabs';

export function ChildInfoSheet({
  child,
  opened,
  onOpened,
}: {
  child: Child | undefined;
  opened: boolean;
  onOpened(opened: boolean): void;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.child.info);

  return (
    <Sheet open={opened} onOpenChange={(open) => onOpened(open)}>
      <SheetContent className="w-full overflow-y-scroll sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>
            {child ? (
              <div>
                {dictionary.heading}{' '}
                <span className="text-muted-foreground">[ {child?.idNum} ]</span>
              </div>
            ) : (
              <div>{dictionary.heading}</div>
            )}
          </SheetTitle>
        </SheetHeader>
        <ChildrenTabs child={child} />
      </SheetContent>
    </Sheet>
  );
}
