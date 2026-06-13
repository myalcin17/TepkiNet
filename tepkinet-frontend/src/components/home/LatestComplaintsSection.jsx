import { Link } from 'react-router-dom'
import ComplaintCard from '@/components/complaints/ComplaintCard'
import {
  AsyncContent,
  ComplaintCardSkeleton,
  EmptyState,
  ResponsiveGrid,
  SkeletonList,
} from '@/components/ui'
import { ROUTES } from '@/constants/routes'

export default function LatestComplaintsSection({ complaints, isLoading, error }) {
  return (
    <section aria-labelledby="latest-complaints-heading" className="mt-14 sm:mt-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="latest-complaints-heading"
            className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100"
          >
            Topluluktan son paylaşımlar
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            Platform genelinde son gönderilen şikayetler. Diğerlerinin sorunları nasıl bildirdiğini ve
            süreci nasıl takip ettiğini görün.
          </p>
        </div>

        <Link
          to={ROUTES.COMPLAINTS}
          className="text-sm font-medium text-brand-700 transition-colors hover:text-brand-800 dark:text-brand-100 dark:hover:text-white"
        >
          Tüm şikayetleri gör →
        </Link>
      </div>

      <div className="mt-6">
        <AsyncContent
          isLoading={isLoading}
          error={error}
          loading={
            <SkeletonList
              count={6}
              SkeletonComponent={ComplaintCardSkeleton}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            />
          }
          isEmpty={complaints.length === 0}
          empty={
            <EmptyState
              icon="document"
              compact
              title="Henüz şikayet yok"
              description="Platformda deneyiminizi paylaşan ilk kişi siz olun."
            />
          }
        >
          <ResponsiveGrid columns={3}>
            {complaints.map((complaint) => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))}
          </ResponsiveGrid>
        </AsyncContent>
      </div>
    </section>
  )
}
