import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import FormAlert from '@/components/forms/FormAlert'
import { ConversationSkeleton, EmptyState } from '@/components/ui'
import SubmitButton from '@/components/forms/SubmitButton'
import TextareaField from '@/components/forms/TextareaField'
import SupportMessageBubble from '@/components/support/SupportMessageBubble'
import { ROUTES } from '@/constants/routes'
import { useSupportConversation } from '@/hooks/useSupportConversation'
import { useSupportSendPermission } from '@/hooks/useSupportSendPermission'
import { useAuth } from '@/hooks/useAuth'
import { COMPLAINT_STATUS } from '@/constants/complaintStatus'

export default function SupportConversation({ complaint, isClosed: closedByParent = false }) {
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const { canSend, isCheckingPermission } = useSupportSendPermission(complaint)
  const {
    messages,
    isLoading,
    isSending,
    error,
    sendError,
    sendMessage,
    messagesEndRef,
    listRef,
  } = useSupportConversation(complaint?.id)

  const isClosed =
    closedByParent ||
    complaint?.status === COMPLAINT_STATUS.CLOSED_BY_CUSTOMER ||
    complaint?.status === COMPLAINT_STATUS.RESOLVED

  const [draft, setDraft] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    if (isClosed) {
      return
    }

    const sent = await sendMessage(draft)

    if (sent) {
      setDraft('')
    }
  }

  return (
    <section
      id="support"
      aria-labelledby="support-conversation-heading"
      className="mt-8 scroll-mt-24 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <header className="border-b border-slate-100 px-6 py-4 dark:border-slate-800 sm:px-8">
        <h2
          id="support-conversation-heading"
          className="text-base font-semibold text-slate-900 dark:text-white"
        >
          Destek görüşmesi
        </h2>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
          Şikayet sahibi ile bu vakayı yöneten şirket arasındaki doğrudan mesajlar.
        </p>
      </header>

      <div
        ref={listRef}
        className="max-h-[min(28rem,60vh)] min-h-[12rem] overflow-y-auto bg-slate-50 dark:bg-slate-950"
        aria-live="polite"
        aria-busy={isLoading}
      >
        {isLoading ? (
          <ConversationSkeleton />
        ) : error ? (
          <div className="px-6 py-6 sm:px-8">
            <FormAlert>{error}</FormAlert>
          </div>
        ) : messages.length === 0 ? (
          <EmptyState
            compact
            icon="inbox"
            title="Henüz mesaj yok"
            description="Müşteri veya şirket görüşmeyi başlattığında mesajlar burada görünecektir."
            className="mx-4 my-6 border-none bg-transparent dark:bg-transparent sm:mx-6"
          />
        ) : (
          <ul className="space-y-4 px-4 py-6 sm:px-6">
            {messages.map((item) => (
              <li key={item.id}>
                <SupportMessageBubble message={item} />
              </li>
            ))}
          </ul>
        )}
        <div ref={messagesEndRef} className="h-px shrink-0" aria-hidden="true" />
      </div>

      <footer className="border-t border-slate-100 px-6 py-4 dark:border-slate-800 sm:px-8">
        {isClosed ? (
          <div className="px-6 py-6 sm:px-8">
            <FormAlert>Bu şikayet kapatıldığı için yeni mesaj gönderemezsiniz.</FormAlert>
          </div>
        ) : !isAuthenticated ? (
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Mesaj gönderebilmek için{' '}
            <Link
              to={ROUTES.LOGIN}
              state={{ from: location }}
              className="font-medium text-brand-700 hover:text-brand-800 dark:text-brand-100 dark:hover:text-white"
            >
              giriş yapmanız gerekiyor.
            </Link>
          </p>
        ) : isCheckingPermission ? (
          <p className="text-sm text-slate-700 dark:text-slate-300">Mesaj izinleri kontrol ediliyor…</p>
        ) : canSend ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            {sendError ? <FormAlert>{sendError}</FormAlert> : null}

            <TextareaField
              id="support-message"
              name="support-message"
              label="Mesajınız"
              rows={3}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Karşı taraf için net ve profesyonel bir güncelleme yazın…"
              disabled={isSending}
              hint="Buraya yalnızca şikayet sahibi ve ilgili şirket yazabilir."
            />

            <div className="flex justify-end">
              <SubmitButton
                isLoading={isSending}
                disabled={!draft.trim()}
                className="w-full sm:w-auto sm:min-w-[10rem]"
              >
                Mesaj gönder
              </SubmitButton>
            </div>
          </form>
        ) : (
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Bu görüşmeyi okuyabilirsiniz. Mesaj gönderebilecek tek kişiler şikayet sahibi ve bu vakaya
            atanmış şirkettir.
          </p>
        )}
      </footer>
    </section>
  )
}
