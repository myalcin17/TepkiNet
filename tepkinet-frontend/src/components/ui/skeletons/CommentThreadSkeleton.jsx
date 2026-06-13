import { SkeletonCircle } from '@/components/ui/Skeleton'
import Skeleton from '@/components/ui/Skeleton'

export default function CommentThreadSkeleton({ rows = 3 }) {
  return (
    <ul className="space-y-6 px-6 py-6 sm:px-8" aria-hidden="true" aria-busy="true">
      {Array.from({ length: rows }, (_, key) => (
        <li key={key} className="flex gap-4">
          <SkeletonCircle />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" shimmer={false} />
            <Skeleton className="mt-3 h-12 w-full" shimmer={false} />
          </div>
        </li>
      ))}
    </ul>
  )
}
