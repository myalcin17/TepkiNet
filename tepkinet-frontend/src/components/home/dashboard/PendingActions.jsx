import { Link } from 'react-router-dom'
import StatusBadge from '@/components/complaints/StatusBadge'
import { InlineError } from '@/components/ui'
import { COMPLAINT_STATUS } from '@/constants/complaintStatus'
import { complaintDetailSupportPath } from '@/constants/routes'
import { formatComplaintDate } from '@/utils/formatDate'

function getActionableComplaints(complaints) {
  return complaints
    .filter((complaint) => complaint.status === COMPLAINT_STATUS.ANSWERED)
    .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
    .slice(0, 3)
}

function PendingActionSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800" />
      <div className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800" />
    </div>
  )
}

export default function PendingActions({ complaints = [], isLoading, error, onRetry }) {
  const actions = getActionableComplaints(complaints)

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Bekleyen aksiyonlar
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
            Dikkatinizi bekleyenler
          </h3>
        </div>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <PendingActionSkeleton />
        ) : error ? (
          <InlineError message={error} onRetry={onRetry} />
        ) : actions.length > 0 ? (
          <div className="space-y-3">
            {actions.map((complaint) => (
              <Link
                key={complaint.id}
                to={complaintDetailSupportPath(complaint.id)}
                className="group block rounded-xl border border-amber-200 bg-amber-50 p-4 transition-colors hover:border-amber-300 hover:bg-amber-100 dark:border-amber-900/70 dark:bg-amber-950/30 dark:hover:border-amber-800 dark:hover:bg-amber-950/50"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={complaint.status} />
                      <span className="text-xs text-amber-900/80 dark:text-amber-100/80">
                        Yanıtı inceleyin
                      </span>
                    </div>
                    <p className="mt-2 truncate text-sm font-semibold text-slate-950 dark:text-white">
                      {complaint.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                      {complaint.companyName ? `${complaint.companyName} yanıt verdi.` : 'Şikayetinize yanıt geldi.'}
                    </p>
                  </div>
                  <time
                    dateTime={complaint.createdAt ?? undefined}
                    className="shrink-0 text-xs text-slate-500 dark:text-slate-400"
                  >
                    {formatComplaintDate(complaint.createdAt)}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        ) : (
           <div className="rounded-xl border border-green-200 bg-green-50 p-5 dark:border-green-900/50 dark:bg-green-950/20">
    <p className="text-sm font-semibold text-green-800 dark:text-green-300">
      🎉 Harika!
    </p>

    <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
      Şu anda sizden işlem bekleyen herhangi bir şikayet bulunmuyor.
    </p>

    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
      Şirket yanıtı geldiğinde veya yeni bir işlem gerektiğinde bu alan otomatik olarak güncellenecektir.
    </p>
  </div>
        )}
      </div>
    </section>
  )
}
