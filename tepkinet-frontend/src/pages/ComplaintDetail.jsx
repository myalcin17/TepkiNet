import { useEffect, useState } from 'react'
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom'
import PageHeader from '@/components/common/PageHeader'
import { ComplaintDetailSkeleton, ErrorState, StatusBadge } from '@/components/ui'
import ComplaintComments from '@/components/comments/ComplaintComments'
import SupportConversation from '@/components/support/SupportConversation'
import { useAuth } from '@/hooks/useAuth'
import ModerationConfirmModal from '@/components/ui/ModerationConfirmModal'
import { useToast } from '@/hooks/useToast'
import { ROLES } from '@/constants/roles'
import { COMPLAINT_STATUS } from '@/constants/complaintStatus'
import { COMPLAINT_SUPPORT_HASH, ROUTES } from '@/constants/routes'
import { fetchComplaintById, closeComplaint, updateComplaintStatus } from '@/services/complaintService'
import { getApiErrorMessage } from '@/utils/apiError'
import { formatComplaintDate } from '@/utils/formatDate'


export default function ComplaintDetail() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, userHasRole } = useAuth()
  const { showToast } = useToast()
  const [complaint, setComplaint] = useState(location.state?.complaint ?? null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(location.state?.complaint ? false : true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function load() {
      setError('')

      try {
        const data = await fetchComplaintById(id)

        if (!isMounted) return

        const complaintCompanyId = data?.companyId ?? data?.company?.id ?? data?.company?.companyId
        const userCompanyId = user?.companyId ?? user?.company?.id ?? user?.company?.companyId

        if (userHasRole([ROLES.COMPANY]) && complaintCompanyId && userCompanyId && String(complaintCompanyId) !== String(userCompanyId)) {
          setComplaint(null)
          setError('Bu şikayete erişim yetkiniz yok.')
        } else {
          setComplaint(data)
        }
      } catch (err) {
        if (!isMounted) return
        setComplaint(null)
        setError(getApiErrorMessage(err, 'Bu şikayet yüklenemedi.'))
      } finally {
        if (!isMounted) return
        setIsLoading(false)
      }
    }

    if (id) {
      if (location.state?.complaint) {
        
        load()
      } else {
        setIsLoading(true)
        load()
      }
    }

    return () => {
      isMounted = false
    }
  }, [id, location.state, user, userHasRole])

  useEffect(() => {
    if (isLoading || !complaint || location.hash !== COMPLAINT_SUPPORT_HASH) return

    const supportSection = document.getElementById('support')
    if (supportSection) supportSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [complaint, isLoading, location.hash]) 

  if (isLoading) {
    return (
      <section>
        <PageHeader title="Şikayet detayları" description="Şikayet bilgileri yükleniyor…" />
        <ComplaintDetailSkeleton />
      </section>
    )
  }

  if (error || !complaint) {
    return (
      <section>
        <PageHeader title="Şikayet detayları" description="Bu şikayet yüklenemedi." />
        <ErrorState title="Şikayet yüklenemedi" message={error || 'Şikayet bulunamadı.'} />
        <p className="mt-6">
          <Link to={ROUTES.COMPLAINTS} className="text-sm font-medium text-brand-700 hover:text-brand-800 dark:text-brand-100 dark:hover:text-white">
            ← Şikayetlere dön
          </Link>
        </p>
      </section>
    )
  }

  const { title, content, username, companyName, status, createdAt } = complaint

  const isOwnComplaint = isAuthenticated && user?.username && username && user.username.toLowerCase() === username.toLowerCase()
  const isClosed = status === COMPLAINT_STATUS.CLOSED_BY_CUSTOMER || status === COMPLAINT_STATUS.RESOLVED

  const backRoute = userHasRole([ROLES.COMPANY])
    ? ROUTES.COMPANY_DASHBOARD
    : userHasRole([ROLES.ADMIN])
    ? ROUTES.ADMIN_COMPLAINTS
    : isOwnComplaint
    ? ROUTES.MY_COMPLAINTS
    : ROUTES.COMPLAINTS

  const guestBackRoute = !isAuthenticated ? ROUTES.HOME : null

  const backLabel = userHasRole([ROLES.COMPANY])
    ? '← Şirket paneli'
    : userHasRole([ROLES.ADMIN])
    ? '← Şikayet Yönetimi'
    : backRoute === ROUTES.MY_COMPLAINTS
    ? '← Şikayetlerim'
    : '← Tüm şikayetler'

  return (
    <section>
      <p className="mb-4">
        { !isAuthenticated ? (
          <Link to={guestBackRoute} className="text-sm font-medium text-brand-700 transition-colors hover:text-brand-800 dark:text-brand-100 dark:hover:text-white">
            ← Ana menüye dön
          </Link>
        ) : (
          <Link to={backRoute} className="text-sm font-medium text-brand-700 transition-colors hover:text-brand-800 dark:text-brand-100 dark:hover:text-white">
            {backLabel}
          </Link>
        ) }
      </p>

      <PageHeader title={title} description={isOwnComplaint ? 'Gönderdiğiniz şikayet — durumu ve yanıtları aşağıdan takip edin.' : `${username ?? 'Bir topluluk üyesi'} tarafından gönderildi`} />

      <article className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <header className="border-b border-slate-100 px-6 py-5 dark:border-slate-800 sm:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={status} />
            <time dateTime={createdAt ?? undefined} className="text-sm text-slate-600 dark:text-slate-300">Gönderim: {formatComplaintDate(createdAt)}</time>
          </div>
        </header>

        <div className="grid gap-6 px-6 py-6 sm:px-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">Şikayet</h2>
            <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">{content}</div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Şirket</h3>
              <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{companyName ?? '—'}</p>
            </div>


            <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Durum</h3>
              <div className="mt-2"><StatusBadge status={status} /></div>
            </div>

            {(isOwnComplaint || userHasRole([ROLES.ADMIN])) ? (
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Eylemler</h3>
                <div className="mt-2 flex flex-col gap-2">
                  {isOwnComplaint ? (
                  <div className="mt-2 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const updated = await updateComplaintStatus(complaint.id, COMPLAINT_STATUS.RESOLVED)
                          setComplaint(updated)
                          showToast({ type: 'success', message: 'Şikayet çözülmüş olarak işaretlendi.' })
                        } catch (err) {
                          showToast({ type: 'error', message: getApiErrorMessage(err, 'Şikayet durumu güncellenemedi.') })
                        }
                      }}
                      disabled={isClosed}
                      className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white disabled:cursor-not-allowed"
                    >
                      Sorunum Çözüldü
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const updated = await closeComplaint(complaint.id)
                          setComplaint(updated)
                          showToast({ type: 'success', message: 'Şikayet kapatıldı.' })
                        } catch (err) {
                          showToast({ type: 'error', message: getApiErrorMessage(err, 'Şikayet kapanamadı.') })
                        }
                      }}
                      disabled={isClosed}
                      className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-medium text-white disabled:cursor-not-allowed"
                    >
                      {isClosed ? 'Şikayet zaten kapatıldı' : 'Şikayeti Kapat'}
                    </button>
                  </div>
                ) : null}

                  {userHasRole([ROLES.ADMIN]) ? (
                    <div>
                      <button
                        type="button"
                        onClick={() => setConfirmOpen(true)}
                        className="inline-flex items-center justify-center rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
                      >
                        Şikayeti Sil
                      </button>
                      <ModerationConfirmModal
                        open={confirmOpen}
                        title="Şikayeti sil"
                        message="Bu şikayeti kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
                        onCancel={() => setConfirmOpen(false)}
                        onConfirm={async () => {
                          try {
                            setConfirmOpen(false)
                            await (await import('@/services/complaintService')).deleteComplaint(complaint?.id)
                            showToast({ type: 'success', message: 'Şikayet silindi.' })
                            navigate(ROUTES.ADMIN_COMPLAINTS, { replace: true })
                          } catch (err) {
                            showToast({ type: 'error', message: 'Şikayet silinirken hata oluştu.' })
                          }
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Gönderen</h3>
              <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{username ?? '—'}</p>
            </div>
          </aside>
        </div>
      </article>

      <ComplaintComments complaintId={complaint.id} isClosed={isClosed} />

      <SupportConversation complaint={complaint} isClosed={isClosed} />
    </section>
  )

  
}
