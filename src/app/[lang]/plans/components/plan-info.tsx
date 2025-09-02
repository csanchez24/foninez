import type { Plan } from './@types';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { PlanInfoTabs } from './plan-info-tabs';

import { useStoreContext } from '@/store';

export function PlanInfoSheet({
  plan,
  opened,
  onOpened,
}: {
  plan: Plan | undefined;
  opened: boolean;
  onOpened(opened: boolean): void;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.plan.info);

  return (
    <Sheet open={opened} onOpenChange={(open) => onOpened(open)}>
      <SheetContent className="w-full overflow-y-scroll sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>
            <div>
              {dictionary.heading} <span className="text-muted-foreground">[ Id: {plan?.id} ]</span>
            </div>
          </SheetTitle>
          <SheetDescription>{dictionary.description}</SheetDescription>
        </SheetHeader>
        <PlanInfoTabs plan={plan} />
      </SheetContent>
    </Sheet>
  );
}
