export default function SelectField({
  id,
  label,
  options,
  error,
  className = '',
  ...props
}) {
  const selectId = id ?? props.name

  return (
    <div className={className}>
      {label ? (
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      ) : null}

      <select
        id={selectId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${selectId}-error` : undefined}
        className={[
          'w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:bg-slate-950 dark:text-white',
          error
            ? 'border-red-300 focus:border-red-500 dark:border-red-800'
            : 'border-slate-300 focus:border-brand-600 dark:border-slate-700 dark:focus:border-brand-500',
        ].join(' ')}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error ? (
        <p id={`${selectId}-error`} className="mt-1.5 text-xs text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
