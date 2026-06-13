import { cn } from '@/utils/cn'

const sizeStyles = {
  sm: 'h-4 w-4 border',
  md: 'h-5 w-5 border-2',
  lg: 'h-8 w-8 border-2',
}

export default function Spinner({ size = 'md', className = '', label }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)} role="status">
      <span
        className={cn(
          'inline-block animate-spin rounded-full border-slate-300 border-t-brand-700 dark:border-slate-600 dark:border-t-brand-100',
          sizeStyles[size],
        )}
        aria-hidden="true"
      />
      {label ? <span className="text-sm text-slate-600 dark:text-slate-300">{label}</span> : null}
      {!label ? <span className="sr-only">Yükleniyor</span> : null}
    </span>
  )
}
