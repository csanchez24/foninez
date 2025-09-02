import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type { Supplier } from './@types';
import { useStoreContext } from '@/store';
import { SuppliersTabs } from './suppliers-tabs';

export function SupplierInfoSheet({
  supplier,
  opened,
  onOpened,
}: {
  supplier: Supplier | undefined;
  opened: boolean;
  onOpened(opened: boolean): void;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.supplier.info);

  return (
    <Sheet open={opened} onOpenChange={(open) => onOpened(open)}>
      <SheetContent className="w-full overflow-y-scroll sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>
            {supplier ? (
              <div>
                {dictionary.heading}{' '}
                <span className="text-muted-foreground">[ {supplier?.name} ]</span>
              </div>
            ) : (
              <div>{dictionary.heading}</div>
            )}
          </SheetTitle>
        </SheetHeader>
        <SuppliersTabs supplier={supplier} />
      </SheetContent>
    </Sheet>
  );
}
