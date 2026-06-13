import Skeleton from '@/components/ui/Skeleton'

export default function ConversationSkeleton() {
  return (
    <div className="space-y-4 px-4 py-6 sm:px-6" aria-hidden="true" aria-busy="true">
      <div className="flex justify-start">
        <Skeleton className="h-20 w-2/3 max-w-xs rounded-xl" shimmer={false} />
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-16 w-2/3 max-w-xs rounded-xl" shimmer={false} />
      </div>
      <div className="flex justify-start">
        <Skeleton className="h-14 w-1/2 max-w-xs rounded-xl" shimmer={false} />
      </div>
    </div>
  )
}
