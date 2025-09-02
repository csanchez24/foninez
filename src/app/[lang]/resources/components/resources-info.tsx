import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type { Resource } from './@types';
import { useStoreContext } from '@/store';
import { ResourcesTabs } from './resources-tabs';

export function ResourceInfoSheet({
  resource,
  opened,
  onOpened,
}: {
  resource: Resource | undefined;
  opened: boolean;
  onOpened(opened: boolean): void;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.resource.info);

  return (
    <Sheet open={opened} onOpenChange={(open) => onOpened(open)}>
      <SheetContent className="w-full overflow-y-scroll sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>
            {resource ? (
              <div>
                {dictionary.heading}{' '}
                <span className="text-muted-foreground">[ {resource?.name} ]</span>
              </div>
            ) : (
              <div>{dictionary.heading}</div>
            )}
          </SheetTitle>
        </SheetHeader>
        <ResourcesTabs resource={resource} />
      </SheetContent>
    </Sheet>
  );
}
