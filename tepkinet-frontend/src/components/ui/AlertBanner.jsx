import { cn } from '@/utils/cn'

const variantStyles = {
  error:
    'border-red-200 bg-red-50 text-red-800 dark:border-red-900/50 dark:bg-red-950 dark:text-red-200',
  success:
    'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950 dark:text-emerald-200',
  warning:
    'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950 dark:text-amber-200',
  info: 'border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900/50 dark:bg-sky-950 dark:text-sky-200',
}

export default function AlertBanner({
  variant = 'error',
  title,
  children,
  className = '',
  onDismiss,
}) {
  if (!children && !title) {
    return null
  }

  return (
    <div
      role="alert"
      className={cn(
        'rounded-xl border px-4 py-3 text-sm',
        variantStyles[variant] ?? variantStyles.error,
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {title ? <p className="font-medium">{title}</p> : null}
          {children ? (
            <div className={title ? 'mt-1 leading-relaxed' : 'leading-relaxed'}>{children}</div>
          ) : null}
        </div>
        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 rounded p-1 text-current/70 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="Kapat"
          >
            <span aria-hidden="true">×</span>
          </button>
        ) : null}
      </div>
    </div>
  )
}
