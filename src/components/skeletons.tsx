import { Skeleton } from '@/components/ui/skeleton';

/** Table skeleton with rows and columns */
export function DataTableSkeleton({ id }: { id: string }) {
  return (
    <section className="[&>*]:mb-4">
      <Skeleton className="mb-6 h-7 w-1/3" />
      <Skeleton className="h-48 w-full bg-muted/40">
        <div className="grid h-full w-full grid-cols-4 items-center gap-2 p-4">
          {Array(20)
            .fill('')
            .map((_, i) => {
              return <Skeleton key={`tbl-sk-${id}-${i}`} className="h-4 w-full" />;
            })}
        </div>
      </Skeleton>
      <div className="flex w-full items-center justify-between">
        <Skeleton className="h-7 w-1/6" />
        <div className="ml-auto flex w-64 items-center space-x-2">
          <Skeleton className="h-7 w-1/3" />
          <Skeleton className="h-7 w-1/3" />
          <Skeleton className="h-7 w-1/3" />
        </div>
      </div>
    </section>
  );
}

/** Heading and actions */
export function PageHeaderSkeleton() {
  return (
    <div className="flex w-full items-center justify-between">
      <Skeleton className="h-8 w-1/3" />
      <div className="flex w-3/12 items-center justify-between space-x-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-8 w-1/3" />
      </div>
    </div>
  );
}

/** Generic form skeleton */
export function FormSkeleton() {
  return (
    <div className="py-6">
      <div className="mb-8 space-y-1.5">
        <Skeleton className="h-5 w-2/6 rounded-sm" />
        <Skeleton className="h-3 w-5/6 rounded-sm" />
      </div>
      <div className="flex flex-col space-y-6">
        {Array(5)
          .fill({})
          .map((_, i) => (
            <div key={`skeleton-tab-${i}`} className="space-y-1.5">
              <Skeleton className="h-4 w-2/6 rounded-sm" />
              <Skeleton className="h-10 w-full rounded-sm" />
              <Skeleton className="h-3 w-5/6 rounded-sm" />
            </div>
          ))}
      </div>
    </div>
  );
}

export const TabsSkeleton = () => (
  <div className="pt-6">
    <div className="mb-8 space-y-1">
      {}
      <Skeleton className="h-5 w-2/6" />
      <Skeleton className="h-3 w-5/6" />
    </div>
    <div className="flex flex-col space-y-6">
      {Array(3)
        .fill({})
        .map((_, i) => (
          <div key={`skeleton-tab-${i}`} className="space-y-1">
            <Skeleton className="h-4 w-2/6" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        ))}
    </div>
  </div>
);
