import AlertBanner from '@/components/ui/AlertBanner'
import { cn } from '@/utils/cn'

export default function ErrorState({
  title = 'Bir şeyler ters gitti',
  message,
  onRetry,
  retryLabel = 'Tekrar dene',
  className = '',
}) {
  if (!message && !title) {
    return null
  }

  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8',
        className,
      )}
    >
      <div className="mx-auto max-w-md text-center">
        <div
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
          aria-hidden="true"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>
        <h2 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
        {message ? (
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{message}</p>
        ) : null}
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-800 dark:bg-brand-600 dark:hover:bg-brand-500"
          >
            {retryLabel}
          </button>
        ) : null}
      </div>
    </div>
  )
}

/** Inline error for list/section contexts — lighter than ErrorState. */
export function InlineError({ message, className = '', onRetry, retryLabel = 'Yeniden dene' }) {
  if (!message) {
    return null
  }

  return (
    <AlertBanner variant="error" className={className}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span>{message}</span>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="shrink-0 rounded-md border border-current/20 px-2.5 py-1 text-xs font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/10"
          >
            {retryLabel}
          </button>
        ) : null}
      </div>
    </AlertBanner>
  )
}
