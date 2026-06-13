  import { Link } from 'react-router-dom'
  import StatusBadge from '@/components/complaints/StatusBadge'
  import { complaintDetailPath, complaintDetailSupportPath, dashboardComplaintDetailPath } from '@/constants/routes'
  import { formatComplaintDate } from '@/utils/formatDate'
  import { useAuth } from '@/hooks/useAuth'

  function truncate(text, maxLength = 120) {
    if (!text || text.length <= maxLength) {
      return text
    }

    return `${text.slice(0, maxLength).trimEnd()}…`
  }

  export default function CompanyComplaintRow({
    complaint,
    isUpdating,
    onStatusChange,
  }) {
    const { isAuthenticated } = useAuth()
    const { id, title, content, username, status, createdAt } = complaint
    const detailPath = isAuthenticated ? dashboardComplaintDetailPath(id) : complaintDetailPath(id)

    return (
      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={status} className="lg:hidden" />
              <time
                dateTime={createdAt ?? undefined}
                className="text-xs text-slate-600 dark:text-slate-300"
              >
                {formatComplaintDate(createdAt)}
              </time>
            </div>

            <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">
              <Link
                to={detailPath}
                className="transition-colors hover:text-brand-700 dark:hover:text-brand-100"
              >
                {title}
              </Link>
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {truncate(content)}
            </p>

            <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
              {username ? (
                <div>
                  <dt className="sr-only">Müşteri</dt>
                  <dd>
                    <span className="font-medium text-slate-700 dark:text-slate-300">Müşteri:</span>{' '}
                    {username}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-end lg:w-72 lg:flex-col">
            <div className="hidden lg:block">
              <p className="mb-1 text-xs font-medium text-slate-600 dark:text-slate-300">Mevcut</p>
              <StatusBadge status={status} />
            </div>
            
          </div>
        </div>

        <footer className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <Link
            to={detailPath}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Detayları gör
          </Link>
          <Link
            to={complaintDetailSupportPath(id)}
            className="inline-flex items-center justify-center rounded-lg bg-brand-700 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-800 dark:bg-brand-600 dark:hover:bg-brand-500"
          >
            Destek görüşmesi
          </Link>
        
        </footer>
      </article>
    )
  }
