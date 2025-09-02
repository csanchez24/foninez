import { useStoreContext } from '@/store';
import type { InventoryTransaction } from './@types';

import { formatDate } from '@/utils/format-date';

function InfoBlock({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-3 text-sm">
      <div className="text-xs font-medium uppercase leading-7 text-foreground">{label}</div>
      <div className="capitalize text-muted-foreground">{value}</div>
    </div>
  );
}

export default function InventoryTransactionsTabsInfo({
  inventoryTransaction,
}: {
  inventoryTransaction: InventoryTransaction | undefined;
}) {
  const dictionary = useStoreContext((state) => state.dictionary.inventoryTransaction.info);
  const dictionaryStatus = useStoreContext(
    (state) => state.dictionary.inventoryTransaction.table.columns.status.values
  );
  const dictionaryTypes = useStoreContext(
    (state) => state.dictionary.inventoryTransaction.table.columns.type.values
  );

  const data = [
    {
      label: dictionary.columns.type,
      value: dictionaryTypes.find((s) => s.value === inventoryTransaction?.type)?.label ?? '',
    },
    {
      label: dictionary.columns.status,
      value: dictionaryStatus.find((s) => s.value === inventoryTransaction?.status)?.label ?? '',
    },
    {
      label: dictionary.columns.orderNumber,
      value: inventoryTransaction?.orderNumber ?? '',
    },
    {
      label: dictionary.columns.supplierInvoiceNumber,
      value: inventoryTransaction?.supplierInvoiceNumber ?? '',
    },
    {
      label: dictionary.columns.activity,
      value: inventoryTransaction?.planModalityActivitySchool?.planModalityActivity?.name ?? '',
    },
    {
      label: dictionary.columns.school,
      value: inventoryTransaction?.planModalityActivitySchool?.school?.name ?? '',
    },
    {
      label: dictionary.columns.note,
      value: inventoryTransaction?.note ?? '',
    },
    {
      label: dictionary.columns.approveNote,
      value: inventoryTransaction?.approveNote ?? '',
    },
    {
      label: dictionary.columns.rejectNote,
      value: inventoryTransaction?.rejectionNote ?? '',
    },
    {
      label: dictionary.columns.createdAt,
      value: formatDate(inventoryTransaction?.createdAt ?? '', 'y-MM-dd'),
    },
  ];

  return (
    <div>
      <div className="mb-8 grid grid-cols-2">
        {data.map((d) => (
          <InfoBlock key={d.label} {...d} />
        ))}
      </div>
    </div>
  );
}
