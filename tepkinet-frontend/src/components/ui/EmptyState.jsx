import { cn } from '@/utils/cn'

const icons = {
  inbox: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
    />
  ),
  search: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
    />
  ),
  document: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
    />
  ),
}

export default function EmptyState({
  title,
  description,
  icon = 'inbox',
  children,
  className = '',
  compact = false,
}) {
  const iconPath = icons[icon] ?? icons.inbox

  return (
    <div
      className={cn(
        'rounded-xl border border-dashed border-slate-300 bg-white text-center dark:border-slate-700 dark:bg-slate-900',
        compact ? 'px-5 py-8' : 'px-6 py-12',
        className,
      )}
    >
      <div
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
        aria-hidden="true"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          {iconPath}
        </svg>
      </div>
      {title ? (
        <h2 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
      ) : null}
      {description ? (
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{description}</p>
      ) : null}
      {children ? <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div> : null}
    </div>
  )
}
