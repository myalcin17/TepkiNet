import { Link } from 'react-router-dom'
import StatusBadge from '@/components/complaints/StatusBadge'
import { complaintDetailPath, dashboardComplaintDetailPath } from '@/constants/routes'
import { formatComplaintDate } from '@/utils/formatDate'
import { useAuth } from '@/hooks/useAuth'

function truncate(text, maxLength = 140) {
  if (!text || text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength).trimEnd()}…`
}

export default function ComplaintCard({ complaint, variant = 'public' }) {
  const { isAuthenticated } = useAuth()
  const { id, title, content, username, companyName, status, createdAt } =
    complaint
  const showAuthor = variant === 'public'
  const detailPath = isAuthenticated ? dashboardComplaintDetailPath(id) : complaintDetailPath(id)

  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <StatusBadge status={status} />
        <time
          dateTime={createdAt ?? undefined}
          className="text-xs text-slate-600 dark:text-slate-300"
        >
          {formatComplaintDate(createdAt)}
        </time>
      </div>

      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
        <Link
          to={detailPath}
          className="transition-colors hover:text-brand-700 dark:hover:text-brand-100"
        >
          {title}
        </Link>
      </h3>

      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {truncate(content)}
      </p>

      <footer className="mt-4 space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
          {companyName ? (
            <span>
              <span className="font-medium text-slate-700 dark:text-slate-300">Şirket:</span>{' '}
              {companyName}
            </span>
          ) : null}
         
          {showAuthor && username ? (
            <span>
              <span className="font-medium text-slate-700 dark:text-slate-300">Kullanıcı:</span>{' '}
              {username}
            </span>
          ) : null}
        </div>

        <Link
          to={detailPath}
          className="inline-flex text-sm font-medium text-brand-700 transition-colors hover:text-brand-800 dark:text-brand-100 dark:hover:text-white"
        >
          Detayları gör →
        </Link>
      </footer>
    </article>
  )
}
