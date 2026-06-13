import { Link } from 'react-router-dom'
import StatusBadge from '@/components/complaints/StatusBadge'
import { EmptyState, InlineError } from '@/components/ui'
import { ROUTES, complaintDetailPath } from '@/constants/routes'
import { formatComplaintDate } from '@/utils/formatDate'

function getRecentComplaints(complaints) {
  return [...complaints]
    .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
    .slice(0, 3)
}

function RecentComplaintSkeleton() {
  return (
    <div className="space-y-2">
      <div className="h-14 rounded-xl bg-slate-100 dark:bg-slate-800" />
      <div className="h-14 rounded-xl bg-slate-100 dark:bg-slate-800" />
      <div className="h-14 rounded-xl bg-slate-100 dark:bg-slate-800" />
    </div>
  )
}

export default function MyRecentComplaints({ complaints = [], isLoading, error, onRetry }) {
  const recentComplaints = getRecentComplaints(complaints)

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Son kayıtlar
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
            Son 3 şikayet
          </h3>
        </div>
        <Link
          to={ROUTES.MY_COMPLAINTS}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Tümünü aç
        </Link>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <RecentComplaintSkeleton />
        ) : error ? (
          <InlineError message={error} onRetry={onRetry} />
        ) : recentComplaints.length > 0 ? (
          <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
            {recentComplaints.map((complaint) => (
              <Link
                key={complaint.id}
                to={complaintDetailPath(complaint.id)}
                className="grid gap-3 bg-white p-4 transition-colors hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/70 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">
                    {complaint.title}
                  </p>
                  <p className="mt-1 truncate text-xs text-slate-600 dark:text-slate-300">
                    {complaint.companyName || 'Şirket bilgisi yok'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <StatusBadge status={complaint.status} />
                  <time
                    dateTime={complaint.createdAt ?? undefined}
                    className="text-xs text-slate-500 dark:text-slate-400"
                  >
                    {formatComplaintDate(complaint.createdAt)}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            compact
            icon="document"
            title="Henüz şikayet yok"
            description="İlk şikayetinizi oluşturduğunuzda son kayıtlarınız burada görünecek."
          >
            <Link
              to={ROUTES.CREATE_COMPLAINT}
              className="inline-flex items-center justify-center rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-800 dark:bg-brand-600 dark:hover:bg-brand-500"
            >
              İlk şikayeti oluştur
            </Link>
          </EmptyState>
        )}
      </div>
    </section>
  )
}
