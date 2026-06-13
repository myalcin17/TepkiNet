import { useEffect, useState } from 'react'
import PageHeader from '@/components/common/PageHeader'
import PageSection from '@/components/ui/PageSection'
import { AsyncContent, EmptyState, SkeletonList } from '@/components/ui'
import { fetchCompanyApplications, getCompanyApplication, approveApplication, rejectApplication } from '@/services/adminService'
import { getApiErrorMessage } from '@/utils/apiError'
import AdminBackButton from '@/components/admin/AdminBackButton'


export default function AdminCompanyApplications() {
  const [apps, setApps] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      setIsLoading(true)
      setError('')
      try {
        const data = await fetchCompanyApplications()
        if (mounted) setApps(data)
      } catch (err) {
        if (mounted) setError(getApiErrorMessage(err, 'Başvurular yüklenemedi'))
      } finally {
        if (mounted) setIsLoading(false)
      }
    }
    load()
    return () => (mounted = false)
  }, [])

  async function handleOpen(id) {
    setSelected(null)
    try {
      const data = await getCompanyApplication(id)
      setSelected(data)
      setAdminNotes(data.adminNotes || '')
    } catch (err) {
      setError(getApiErrorMessage(err, 'Detay yüklenemedi'))
    }
  }

  async function handleApprove() {
    if (!selected) return

    setIsProcessing(true)

    try {
      await approveApplication(selected.id, adminNotes)

      const refreshed = await fetchCompanyApplications()

      setApps(refreshed)
      setSelected(null)
    } finally {
      setIsProcessing(false)
    }
  }
  async function handleReject() {
    if (!selected) return

    setIsProcessing(true)

    try {
      await rejectApplication(selected.id, adminNotes)
      const refreshed = await fetchCompanyApplications()
      setApps(refreshed)
      setSelected(null)
    } finally {
      setIsProcessing(false)
    }
  }
    return (
      <section>
        <PageHeader title="Kurumsal Başvurular" description="Bekleyen başvuruları inceleyin ve yanıtlayın." />

        <div className="mb-4">
          <AdminBackButton />
        </div>

        <PageSection>
          <AsyncContent
            isLoading={isLoading}
            error={error}
            loading={<SkeletonList count={6} SkeletonComponent={() => <div className="h-8 bg-slate-100" />} />}
            isEmpty={!apps.length && !error}
            empty={<EmptyState title="Başvuru yok" description="Bekleyen kurumsal başvuru yok." />}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {apps.map((app) => (
                <div key={app.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{app.companyName}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">{new Date(app.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">
                        {app.status === 'PENDING' ? (
                          <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-900">Beklemede</span>
                        ) : app.status === 'APPROVED' ? (
                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-900">Onaylandı</span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-900">Reddedildi</span>
                        )}
                      </div>
                      <div>
                        <button onClick={() => handleOpen(app.id)} className="mt-2 text-sm text-brand-700 dark:text-brand-100">Detayları Görüntüle</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selected ? (
              <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{selected.companyName}</h3>
                <div className="mt-4 text-sm text-slate-900 dark:text-slate-100">E-posta: {selected.companyEmail}</div>
                <div className="mt-1 text-sm text-slate-900 dark:text-slate-100">Telefon: {selected.phone}</div>
                <div className="mt-1 text-sm text-slate-900 dark:text-slate-100">Vergi Dairesi: {selected.taxOffice}</div>
                <div className="mt-1 text-sm text-slate-900 dark:text-slate-100">Vergi No: {selected.taxNumber}</div>
                <div className="mt-1 text-sm text-slate-900 dark:text-slate-100">Şehir / İlçe: {selected.city} / {selected.district}</div>
                <div className="mt-1 text-sm text-slate-900 dark:text-slate-100">Adres: {selected.address}</div>
                <div className="mt-1 text-sm text-slate-900 dark:text-slate-100">Yetkili: {selected.authorizedPersonName}</div>
                <label className="block mt-4 text-sm font-medium text-slate-900 dark:text-slate-100">Yanıt / Not</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full mt-2 p-2 border rounded bg-white text-slate-900 shadow-sm transition-colors dark:bg-slate-950 dark:text-white dark:border-slate-700"
                  rows={4}
                  disabled={selected.status !== 'PENDING'}
                />

                <div className="mt-4 flex gap-3 items-center">
                  {selected.status === 'PENDING' ? (
                    <>
                      <button
                        onClick={handleApprove}
                        disabled={isProcessing}
                        className="rounded bg-emerald-600 px-4 py-2 text-white disabled:opacity-50"
                      >
                        {isProcessing ? 'Onaylanıyor...' : 'Onayla'}
                      </button>
                      <button
                        onClick={handleReject}
                        disabled={isProcessing}
                        className="rounded bg-rose-600 px-4 py-2 text-white disabled:opacity-50"
                      >
                        {isProcessing ? 'İşleniyor...' : 'Reddet'}
                      </button>                    </>
                  ) : selected.status === 'APPROVED' ? (
                    <>
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-900">Onaylandı</span>
                      {selected.decisionAt ? <div className="ml-4 text-sm text-slate-600 dark:text-slate-200">Karar zamanı: {new Date(selected.decisionAt).toLocaleString()}</div> : null}
                    </>
                  ) : (
                    <>
                      <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-900">Reddedildi</span>
                      {selected.decisionAt ? <div className="ml-4 text-sm text-slate-600 dark:text-slate-200">Karar zamanı: {new Date(selected.decisionAt).toLocaleString()}</div> : null}
                    </>
                  )}

                  <button onClick={() => setSelected(null)} className="rounded border border-slate-300 px-4 py-2 text-slate-900 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800">Kapat</button>
                </div>
              </div>
            ) : null}
          </AsyncContent>
        </PageSection>
      </section>
    )
  }
