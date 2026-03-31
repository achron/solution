import { cn } from '../utils/cn';

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
};

export const SkeletonCard = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card p-6 shadow-sm',
        className
      )}
      {...props}
    >
      <div className="space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
};

export const SkeletonList = ({ count = 3, className }) => {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export const SkeletonDashboardCard = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card p-6 shadow-sm',
        className
      )}
      {...props}
    >
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded" />
      </div>
      <div className="pt-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="mt-1 h-3 w-20" />
      </div>
    </div>
  );
};

export const SkeletonChart = ({ className, height = 300 }) => {
  return (
    <div
      className={cn('rounded-lg border bg-card p-6 shadow-sm', className)}
      style={{ height }}
    >
      <Skeleton className="h-5 w-32 mb-4" />
      <Skeleton className="h-full w-full rounded" />
    </div>
  );
};
