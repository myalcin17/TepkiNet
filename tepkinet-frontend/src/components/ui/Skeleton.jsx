import { cn } from '@/utils/cn'

export default function Skeleton({ className = '', shimmer = true, ...props }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'rounded-md',
        shimmer ? 'skeleton-shimmer' : 'animate-pulse bg-slate-200 dark:bg-slate-700',
        className,
      )}
      {...props}
    />
  )
}

export function SkeletonText({ lines = 3, className = '' }) {
  const widths = ['w-full', 'w-11/12', 'w-4/5', 'w-3/5']

  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton key={index} className={cn('h-3', widths[index % widths.length])} />
      ))}
    </div>
  )
}

export function SkeletonCircle({ className = 'h-10 w-10' }) {
  return <Skeleton className={cn('rounded-full', className)} />
}
