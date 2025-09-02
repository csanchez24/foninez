import type { PlanModalityActivity } from './@types';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ActivityInfoTabs } from './plan-modality-activity-info-tabs';

import { useStoreContext } from '@/store';

export function PlanModalityActivityInfoSheet({
  planModalityActivity,
  opened,
  onOpened,
}: {
  planModalityActivity: PlanModalityActivity | undefined;
  opened: boolean;
  onOpened(opened: boolean): void;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.planModalityActivity.info);

  return (
    <Sheet open={opened} onOpenChange={(open) => onOpened(open)}>
      <SheetContent className="w-full overflow-y-scroll sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>
            <div>
              {dictionary.heading}{' '}
              <span className="text-muted-foreground">[ Id: {planModalityActivity?.id} ]</span>
            </div>
          </SheetTitle>
          <SheetDescription>{dictionary.description}</SheetDescription>
        </SheetHeader>
        <ActivityInfoTabs planModalityActivity={planModalityActivity} />
      </SheetContent>
    </Sheet>
  );
}
