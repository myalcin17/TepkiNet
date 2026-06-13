import Skeleton from '@/components/ui/Skeleton'
import { cn } from '@/utils/cn'

export default function MetricCardsSkeleton({ count = 3, className = '' }) {
  return (
    <div
      className={cn('grid gap-4 sm:grid-cols-3', className)}
      aria-hidden="true"
      aria-busy="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
        >
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-3 h-8 w-12" shimmer={false} />
          <Skeleton className="mt-2 h-3 w-32" shimmer={false} />
        </div>
      ))}
    </div>
  )
}
