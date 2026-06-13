import { canDeleteComment } from '@/utils/comment'
import { formatMessageTime } from '@/utils/formatDate'

function getInitials(username) {
  if (!username) {
    return '?'
  }

  const parts = username.trim().split(/\s+/).filter(Boolean)

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }

  return username.slice(0, 2).toUpperCase()
}

export default function CommentItem({
  comment,
  currentUser,
  isDeleting,
  onDelete,
}) {
  const { id, content, username, createdAt } = comment
  const showDelete = canDeleteComment(comment, currentUser)

  return (
    <article
      className="group flex gap-3 sm:gap-4"
      aria-labelledby={`comment-author-${id}`}
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-100 sm:h-10 sm:w-10"
        aria-hidden="true"
      >
        {getInitials(username)}
      </div>

      <div className="min-w-0 flex-1">
        <header className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p
              id={`comment-author-${id}`}
              className="text-sm font-semibold text-slate-900 dark:text-slate-100"
            >
              {username || 'Topluluk üyesi'}
            </p>
              <time
                dateTime={createdAt ?? undefined}
                className="text-xs text-slate-600 dark:text-slate-300"
              >
              {formatMessageTime(createdAt)}
            </time>
          </div>

          {showDelete ? (
            <button
              type="button"
              onClick={() => onDelete?.(comment)}
              disabled={isDeleting}
              className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-slate-800 transition-colors hover:bg-slate-100 hover:text-red-700 disabled:cursor-not-allowed dark:text-slate-100 dark:hover:bg-slate-800 dark:hover:text-red-300"
              aria-label={`${username || 'sizin'} yorumunuzu sil`}
            >
              {isDeleting ? 'Siliniyor…' : 'Sil'}
            </button>
          ) : null}
        </header>

        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {content}
        </p>
      </div>
    </article>
  )
}
