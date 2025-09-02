import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type { InventoryTransaction } from './@types';
import { useStoreContext } from '@/store';
import { InventoryTransactionsInfoTabs } from './inventory-transactions-info-tabs';

export function InventoryTransactionInfoSheet({
  inventoryTransaction,
  opened,
  onOpened,
}: {
  inventoryTransaction: InventoryTransaction | undefined;
  opened: boolean;
  onOpened(opened: boolean): void;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.inventoryTransaction.info);

  return (
    <Sheet open={opened} onOpenChange={(open) => onOpened(open)}>
      <SheetContent className="w-full overflow-y-scroll sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>
            {inventoryTransaction ? (
              <div>
                {dictionary.heading}{' '}
                <span className="text-muted-foreground">[ {inventoryTransaction?.id} ]</span>
              </div>
            ) : (
              <div>{dictionary.heading}</div>
            )}
          </SheetTitle>
        </SheetHeader>
        <InventoryTransactionsInfoTabs inventoryTransaction={inventoryTransaction} />
      </SheetContent>
    </Sheet>
  );
}
