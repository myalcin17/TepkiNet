import Skeleton from '@/components/ui/Skeleton'
import { cn } from '@/utils/cn'

export default function ComplaintDetailSkeleton({ className = '' }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8',
        className,
      )}
      aria-hidden="true"
      aria-busy="true"
    >
      <Skeleton className="h-6 w-28 rounded-full" />
      <Skeleton className="mt-6 h-8 w-2/3" />
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-full" shimmer={false} />
        <Skeleton className="h-4 w-full" shimmer={false} />
        <Skeleton className="h-4 w-4/5" shimmer={false} />
      </div>
    </div>
  )
}
