import Skeleton from '@/components/ui/Skeleton'
import { cn } from '@/utils/cn'

export default function ComplaintRowSkeleton({ className = '' }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6',
        className,
      )}
      aria-hidden="true"
      aria-busy="true"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-4 w-24" shimmer={false} />
          <Skeleton className="h-5 w-2/3" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" shimmer={false} />
            <Skeleton className="h-3 w-4/5" shimmer={false} />
          </div>
        </div>
        <Skeleton className="h-10 w-full rounded-lg lg:w-48" shimmer={false} />
      </div>
      <div className="mt-5 flex gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <Skeleton className="h-8 w-24 rounded-lg" shimmer={false} />
        <Skeleton className="h-8 w-36 rounded-lg" shimmer={false} />
      </div>
    </div>
  )
}
