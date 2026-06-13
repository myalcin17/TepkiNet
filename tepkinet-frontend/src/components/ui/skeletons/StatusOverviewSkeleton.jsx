import Skeleton from '@/components/ui/Skeleton'
import { cn } from '@/utils/cn'

export default function StatusOverviewSkeleton({ className = '' }) {
  return (
    <div
      className={cn('grid gap-3 sm:grid-cols-2 lg:grid-cols-5', className)}
      aria-hidden="true"
      aria-busy="true"
    >
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 lg:col-span-1">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="mt-3 h-8 w-10" shimmer={false} />
      </div>
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
        >
          <Skeleton className="h-4 w-20" />
          <Skeleton className="mt-3 h-8 w-8" shimmer={false} />
        </div>
      ))}
    </div>
  )
}
