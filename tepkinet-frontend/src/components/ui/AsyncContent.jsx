import { InlineError } from '@/components/ui/ErrorState'

/**
 * Standard async section wrapper: loading → error → empty → content.
 * Pass only the branches you need; omitted branches render nothing.
 */
export default function AsyncContent({
  isLoading = false,
  error = null,
  isEmpty = false,
  loading = null,
  errorContent = null,
  empty = null,
  children,
  className = '',
  onRetry,
}) {
  if (isLoading && loading) {
    return <div className={className}>{loading}</div>
  }

  if (error) {
    const resolvedError =
      errorContent ??
      (typeof error === 'string' ? (
        <InlineError message={error} onRetry={onRetry} />
      ) : (
        error
      ))

    return <div className={className}>{resolvedError}</div>
  }

  if (isEmpty && empty) {
    return <div className={className}>{empty}</div>
  }

  if (isEmpty) {
    return null
  }

  return children ? <div className={className}>{children}</div> : null
}
