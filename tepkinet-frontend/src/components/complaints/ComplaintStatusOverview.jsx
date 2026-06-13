import { StatusOverviewSkeleton } from '@/components/ui'
import { COMPLAINT_STATUS, getComplaintStatusConfig } from '@/constants/complaintStatus'
import { getComplaintStatusOverviewItems } from '@/utils/complaintStatusStats'

const STATUS_ORDER = [
  COMPLAINT_STATUS.PENDING,
  COMPLAINT_STATUS.OPEN,
  COMPLAINT_STATUS.IN_REVIEW,
  COMPLAINT_STATUS.ANSWERED,
  COMPLAINT_STATUS.RESOLVED,
  COMPLAINT_STATUS.CLOSED_BY_CUSTOMER,
]

export default function ComplaintStatusOverview({
  counts,
  activeStatus,
  onStatusChange,
  isLoading,
  isUserPanel = false,
}) {
  const items = getComplaintStatusOverviewItems(counts, isUserPanel)

  if (isLoading) {
    return <StatusOverviewSkeleton />
  }

  return (
    <section aria-label="Şikayet durum özeti">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <button
          type="button"
          onClick={() => onStatusChange('')}
          className={[
            'rounded-xl border p-4 text-left transition-colors lg:col-span-1',
            activeStatus === ''
              ? 'border-brand-600 bg-brand-50 ring-1 ring-brand-600/30 dark:border-brand-500 dark:bg-slate-700 dark:ring-brand-500/40'
              : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700',
          ].join(' ')}
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-300">
            Toplam
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
            {counts.total}
          </p>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Tüm gönderimler</p>
        </button>

        {items.map(({ status, count, label }) => {
          const config = getComplaintStatusConfig(status, isUserPanel)
          const isActive = activeStatus === status

          return (
            <button
              key={status}
              type="button"
              onClick={() => onStatusChange(isActive ? '' : status)}
              className={[
                'rounded-xl border p-4 text-left transition-colors',
                isActive
                  ? 'border-brand-600 bg-brand-50 ring-1 ring-brand-600/30 dark:border-brand-500 dark:bg-slate-700 dark:ring-brand-500/40'
                  : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700',
              ].join(' ')}
            >
              <span
                className={[
                  'inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
                  config.className,
                ].join(' ')}
              >
                {label}
              </span>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                {count}
              </p>
            </button>
          )
        })}
      </div>

      <div className="mt-4 hidden rounded-lg border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 lg:block">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-300">
          Çözüm süreci
        </p>
        <ol className="flex items-center gap-2">
          {STATUS_ORDER.map((status, index) => {
const config = getComplaintStatusConfig(status, isUserPanel)
            const count = counts[status] ?? 0

            return (
              <li key={status} className="flex min-w-0 flex-1 items-center gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs font-medium text-slate-700 dark:text-slate-300">
                      {config.label}
                    </span>
                    <span className="shrink-0 text-xs tabular-nums text-slate-600 dark:text-slate-300">
                      {count}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-brand-600 transition-all dark:bg-brand-500"
                      style={{
                        width:
                          counts.total === 0
                            ? '0%'
                            : `${Math.max((count / counts.total) * 100, count > 0 ? 8 : 0)}%`,
                      }}
                    />
                  </div>
                </div>
                {index < STATUS_ORDER.length - 1 ? (
                  <span
                    className="hidden h-px w-4 shrink-0 bg-slate-200 dark:bg-slate-700 xl:block"
                    aria-hidden="true"
                  />
                ) : null}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
