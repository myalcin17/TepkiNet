import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import FormAlert from '@/components/forms/FormAlert'
import { CommentThreadSkeleton, EmptyState } from '@/components/ui'
import ModerationConfirmModal from '@/components/ui/ModerationConfirmModal'
import SubmitButton from '@/components/forms/SubmitButton'
import TextareaField from '@/components/forms/TextareaField'
import CommentItem from '@/components/comments/CommentItem'
import { ROUTES } from '@/constants/routes'
import { useComplaintComments } from '@/hooks/useComplaintComments'
import { useAuth } from '@/hooks/useAuth'

export default function ComplaintComments({ complaintId, isClosed }) {
  const location = useLocation()
  const { user, isAuthenticated } = useAuth()
  const {
    comments,
    isLoading,
    isSubmitting,
    deletingId,
    error,
    submitError,
    deleteError,
    addComment,
    removeComment,
    clearDeleteError,
  } = useComplaintComments(complaintId)

  const [draft, setDraft] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)
  const [moderationTarget, setModerationTarget] = useState(null)
  const [moderationOpen, setModerationOpen] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    if (isClosed) {
      return
    }

    const posted = await addComment(draft)

    if (posted) {
      setDraft('')
    }
  }

  async function handleDelete(comment) {
    // If current user is admin, show modal confirmation
    if (user?.role === 'ADMIN') {
      setModerationTarget(comment)
      setModerationOpen(true)
      return
    }

    if (pendingDelete?.id === comment.id) {
      const removed = await removeComment(comment.id)
      setPendingDelete(null)

      if (!removed) {
        return
      }

      return
    }

    clearDeleteError()
    setPendingDelete(comment)
  }

  function cancelDelete() {
    setPendingDelete(null)
    clearDeleteError()
  }

  async function handleModerationConfirm() {
    if (!moderationTarget) return
    const removed = await removeComment(moderationTarget.id)
    setModerationOpen(false)
    setModerationTarget(null)
    if (!removed) {
      return
    }
  }

  return (
    <section
      aria-labelledby="complaint-comments-heading"
      className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <header className="border-b border-slate-100 px-6 py-4 dark:border-slate-800 sm:px-8">
        <h2
          id="complaint-comments-heading"
          className="text-base font-semibold text-slate-900 dark:text-white"
        >
          Topluluk tartışması
        </h2>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
          Bu şikayet hakkında topluluk üyelerinin kamuya açık yorumları.
        </p>
      </header>

      <div aria-live="polite" aria-busy={isLoading}>
        {isLoading ? (
          <CommentThreadSkeleton />
        ) : error ? (
          <div className="px-6 py-6 sm:px-8">
            <FormAlert>{error}</FormAlert>
          </div>
        ) : comments.length === 0 ? (
          <EmptyState
            compact
            icon="document"
            title="Henüz yorum yok"
            description="Bu şikayet hakkında görüşünüzü paylaşan ilk kişi siz olun."
            className="mx-6 my-6 border-none bg-transparent dark:bg-transparent sm:mx-8"
          />
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {comments.map((comment) => (
              <li key={comment.id} className="px-6 py-5 sm:px-8">
                <CommentItem
                  comment={comment}
                  currentUser={user}
                  isDeleting={deletingId === comment.id}
                  onDelete={handleDelete}
                />

                {pendingDelete?.id === comment.id ? (
                  <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-700 dark:bg-slate-950/50">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      Bu yorum silinsin mi? Bu işlem geri alınamaz.
                    </p>
                    {deleteError ? (
                      <p className="mt-2 text-sm text-red-700 dark:text-red-300" role="alert">
                        {deleteError}
                      </p>
                    ) : null}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleDelete(comment)}
                        disabled={deletingId === comment.id}
                        className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed"
                      >
                        {deletingId === comment.id ? 'Siliniyor…' : 'Silmeyi onayla'}
                      </button>
                      <button
                        type="button"
                        onClick={cancelDelete}
                        disabled={deletingId === comment.id}
                        className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        İptal
                      </button>
                    </div>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>

      <footer className="border-t border-slate-100 px-6 py-4 dark:border-slate-800 sm:px-8">
        {isClosed ? (
          <div className="px-6 py-6 sm:px-8">
            <FormAlert>Bu şikayet kapatıldığı için yeni mesaj veya yorum gönderemezsiniz.</FormAlert>
          </div>
        ) : !isAuthenticated ? (
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Yorum yapabilmek için{' '}
            <Link
              to={ROUTES.LOGIN}
              state={{ from: location }}
              className="font-medium text-brand-700 hover:text-brand-800 dark:text-brand-100 dark:hover:text-white"
            >
              giriş yapmanız gerekiyor.
            </Link>
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {submitError ? <FormAlert>{submitError}</FormAlert> : null}

            <TextareaField
              id="complaint-comment"
              name="complaint-comment"
              label="Yorum ekle"
              rows={3}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Topluluk için yapıcı bir gözlem veya soru paylaşın…"
              disabled={isSubmitting}
              hint="Yorumlar oturum açmış üyelere görünür. Kendi yorumlarınızı silebilirsiniz."
            />

            <div className="flex justify-end">
              <SubmitButton
                isLoading={isSubmitting}
                disabled={!draft.trim()}
                className="w-full sm:w-auto sm:min-w-[10rem]"
              >
                Yorumu gönder
              </SubmitButton>
            </div>
          </form>
        )}
      </footer>
        <ModerationConfirmModal
          open={moderationOpen}
          title="Yorumu sil"
          message="Bu yorumu kalıcı olarak silmek istediğinize emin misiniz?"
          onCancel={() => setModerationOpen(false)}
          onConfirm={handleModerationConfirm}
          confirmLabel="Yorumu Sil"
        />
    </section>
  )
}
