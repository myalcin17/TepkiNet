import { ROLES } from '@/constants/roles'
import { formatMessageTime } from '@/utils/formatDate'

const ROLE_LABELS = {
  [ROLES.USER]: 'Müşteri',
  [ROLES.COMPANY]: 'Şirket',
  [ROLES.ADMIN]: 'Yönetici',
}

function getRoleLabel(role) {
  return ROLE_LABELS[role] ?? 'Katılımcı'
}

export default function SupportMessageBubble({ message }) {
  const { message: body, username, role, createdAt } = message
  const isCompany = role === ROLES.COMPANY

  return (
    <div
      className={[
        'flex w-full',
        isCompany ? 'justify-end' : 'justify-start',
      ].join(' ')}
    >
      <div
        className={[
          'max-w-[min(100%,28rem)] rounded-xl px-4 py-3 shadow-sm border text-sm leading-relaxed',
          isCompany
            ? 'rounded-br-md border-brand-200 bg-brand-50 text-slate-900 dark:border-brand-700 dark:bg-slate-800 dark:text-white'
            : 'rounded-bl-md border-slate-200 bg-slate-100 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100',
        ].join(' ')}
      >
        <div
          className={[
            'mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs',
            isCompany ? 'justify-end' : 'justify-start',
          ].join(' ')}
        >
          <span className="font-semibold text-slate-900 dark:text-white">
            {username ?? 'Bilinmiyor'}
          </span>
          <span
            className={[
              'rounded-full px-2 py-0.5 font-medium',
              isCompany
                ? 'bg-brand-100 text-brand-800 dark:bg-slate-800 dark:text-white'
                : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-white',
            ].join(' ')}
          >
            {getRoleLabel(role)}
          </span>
        </div>

        <p className="whitespace-pre-wrap text-slate-900 dark:text-white">
          {body}
        </p>

        <time
          dateTime={createdAt ?? undefined}
          className={[
            'mt-2 block text-[11px] text-slate-600 dark:text-slate-300',
            isCompany ? 'text-right' : 'text-left',
          ].join(' ')}
        >
          {formatMessageTime(createdAt)}
        </time>
      </div>
    </div>
  )
}
