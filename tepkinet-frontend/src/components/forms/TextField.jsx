export default function TextField({
  id,
  label,
  type = 'text',
  error,
  hint,
  className = '',
  trailing,
  ...props
}) {
  const inputId = id ?? props.name
  const hasTrailing = Boolean(trailing)

  return (
    <div className={className}>
      {label ? (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      ) : null}

      <div className={hasTrailing ? 'relative' : ''}>
        <input
          id={inputId}
          type={type}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={[
            'w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors',
            hasTrailing ? 'pr-12' : '',
            'placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30',
            'dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-400',
            error
              ? 'border-red-300 focus:border-red-500 dark:border-red-800'
              : 'border-slate-300 focus:border-brand-600 dark:border-slate-700 dark:focus:border-brand-500',
          ].join(' ')}
          {...props}
        />

        {hasTrailing ? (
          <div className="absolute inset-y-0 right-3 flex items-center">
            {trailing}
          </div>
        ) : null}
      </div>

      {hint && !error ? (
        <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-slate-600 dark:text-slate-300">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
