import Skeleton from '@/components/ui/Skeleton'
import { cn } from '@/utils/cn'

export default function ComplaintCardSkeleton({ className = '' }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900',
        className,
      )}
      aria-hidden="true"
      aria-busy="true"
    >
      <div className="flex justify-between gap-2">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-4 w-24" shimmer={false} />
      </div>
      <Skeleton className="mt-4 h-5 w-3/4" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-3 w-full" shimmer={false} />
        <Skeleton className="h-3 w-5/6" shimmer={false} />
      </div>
      <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
        <Skeleton className="h-3 w-1/2" shimmer={false} />
      </div>
    </div>
  )
}
