export default function TextareaField({
  id,
  label,
  error,
  hint,
  className = '',
  rows = 5,
  ...props
}) {
  const textareaId = id ?? props.name

  return (
    <div className={className}>
      {label ? (
        <label htmlFor={textareaId} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      ) : null}

      <textarea
        id={textareaId}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
        className={[
          'w-full resize-y rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors',
          'placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30',
          'dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-400',
          error
            ? 'border-red-300 focus:border-red-500 dark:border-red-800'
            : 'border-slate-300 focus:border-brand-600 dark:border-slate-700 dark:focus:border-brand-500',
        ].join(' ')}
        {...props}
      />

      {hint && !error ? (
        <p id={`${textareaId}-hint`} className="mt-1.5 text-xs text-slate-600 dark:text-slate-300">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={`${textareaId}-error`} className="mt-1.5 text-xs text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
