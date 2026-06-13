export default function Pagination({ page, totalPages, onPageChange, totalElements, pageSize }) {
  if (totalPages <= 1) {
    return null
  }

  const from = page * pageSize + 1
  const to = Math.min((page + 1) * pageSize, totalElements)

  function goToPage(nextPage) {
    if (nextPage >= 0 && nextPage < totalPages) {
      onPageChange(nextPage)
    }
  }

  const pageNumbers = buildPageNumbers(page, totalPages)

  return (
    <nav
      className="flex flex-col gap-3 border-t border-slate-200 pt-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between"
      aria-label="Şikayet sayfalama"
    >
      <p className="text-sm text-slate-600 dark:text-slate-300">
        <span className="font-medium text-slate-900 dark:text-slate-200">{totalElements}</span> kayıttan{' '}
        <span className="font-medium text-slate-900 dark:text-slate-200">{from}</span>–
        <span className="font-medium text-slate-900 dark:text-slate-200">{to}</span> arası gösteriliyor
      </p>

      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={() => goToPage(page - 1)}
          disabled={page === 0}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:brightness-90 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Önceki
        </button>

        {pageNumbers.map((item, index) =>
          item === '…' ? (
            <span key={`ellipsis-${index}`} className="px-2 text-slate-600 dark:text-slate-300">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => goToPage(item)}
              aria-current={item === page ? 'page' : undefined}
              className={[
                'min-w-9 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                item === page
                  ? 'border-brand-600 bg-brand-700 text-white dark:border-brand-500 dark:bg-brand-600'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800',
              ].join(' ')}
            >
              {item + 1}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => goToPage(page + 1)}
          disabled={page >= totalPages - 1}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:brightness-90 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Sonraki
        </button>
      </div>
    </nav>
  )
}

function buildPageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index)
  }

  const pages = new Set([0, total - 1, current])

  if (current > 0) {
    pages.add(current - 1)
  }

  if (current < total - 1) {
    pages.add(current + 1)
  }

  const sorted = [...pages].sort((a, b) => a - b)
  const result = []

  for (let index = 0; index < sorted.length; index += 1) {
    const value = sorted[index]
    const previous = sorted[index - 1]

    if (index > 0 && value - previous > 1) {
      result.push('…')
    }

    result.push(value)
  }

  return result
}
