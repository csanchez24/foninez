import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type { Activity } from './@types';
import { useStoreContext } from '@/store';
import { ActivityInfoTabs } from './activity-info-tabs';

export function ActivityInfoSheet({
  activity,
  opened,
  onOpened,
}: {
  activity: Activity | undefined;
  opened: boolean;
  onOpened(opened: boolean): void;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.activity.info);

  return (
    <Sheet open={opened} onOpenChange={(open) => onOpened(open)}>
      <SheetContent className="w-full overflow-y-scroll sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>
            {activity ? (
              <div>
                {dictionary.heading}{' '}
                <span className="text-muted-foreground">[ {activity?.id} ]</span>
              </div>
            ) : (
              <div>{dictionary.heading}</div>
            )}
          </SheetTitle>
        </SheetHeader>
        <ActivityInfoTabs activity={activity} />
      </SheetContent>
    </Sheet>
  );
}
