import { cn } from '@/utils/cn'

const typeStyles = {
  success:
    'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/80 dark:text-emerald-100',
  error:
    'border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/80 dark:text-red-100',
  warning:
    'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/80 dark:text-amber-100',
  info: 'border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900/60 dark:bg-sky-950/80 dark:text-sky-100',
}

const typeIcons = {
  success: '✓',
  error: '!',
  warning: '!',
  info: 'i',
}

export default function ToastViewport({ toasts, onDismiss }) {
  if (toasts.length === 0) {
    return null
  }

  return (
    <div
      aria-live="polite"
      aria-relevant="additions"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-full sm:max-w-sm"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={cn(
            'pointer-events-auto flex items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg',
            typeStyles[toast.type] ?? typeStyles.info,
          )}
        >
          <span
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-current/10 text-xs font-semibold"
            aria-hidden="true"
          >
            {typeIcons[toast.type] ?? typeIcons.info}
          </span>
          <p className="flex-1 leading-relaxed">{toast.message}</p>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            className="shrink-0 rounded p-1 text-current/70 transition-colors hover:bg-black/5 hover:text-current dark:hover:bg-white/10"
            aria-label="Bildirimi kapat"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      ))}
    </div>
  )
}
