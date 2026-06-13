import { useEffect, useState, useMemo } from 'react'
import PageHeader from '@/components/common/PageHeader'
import PageSection from '@/components/ui/PageSection'
import {
  fetchAdminCompanies,
  deleteCompany,
} from '@/services/adminService'
import { getApiErrorMessage } from '@/utils/apiError'
import AdminBackButton from '@/components/admin/AdminBackButton'

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [expandedCompanyId, setExpandedCompanyId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [companyToDelete, setCompanyToDelete] = useState(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      setIsLoading(true)
      setError('')
      try {
        const data = await fetchAdminCompanies()
        if (mounted) setCompanies(data)
      } catch (err) {
        if (mounted) setError(getApiErrorMessage(err, 'Kurumsal hesaplar yüklenemedi'))
      } finally {
        if (mounted) setIsLoading(false)
      }
    }
    load()
    return () => (mounted = false)
  }, [])

  async function handleDeleteCompany(id) {

    setIsDeleting(true)

    try {

      await deleteCompany(id)

      setCompanies((current) =>
        current.filter((company) => company.id !== id)
      )

    } catch (err) {

      setError(
        getApiErrorMessage(
          err,
          'Şirket silinemedi'
        )
      )

    } finally {
      setIsDeleting(false)
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return companies
    return companies.filter(
      (c) =>
        c.companyName?.toLowerCase().includes(q) ||
        c.supportEmail?.toLowerCase().includes(q)
    )
  }, [companies, query])

  return (
    <section>
      <PageHeader title="Kurumsal Hesaplar" description="Tüm kurumsal hesapları alfabetik sırada görüntüleyin." />

      <div className="mb-4">
        <AdminBackButton />
      </div>

      <PageSection>
        <div className="mb-4">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ara..." className="w-full p-2 border rounded" />
        </div>

        {isLoading ? (
          <div>Yükleniyor…</div>
        ) : error ? (
          <div className="text-rose-600">{error}</div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((c) => (
              <div key={c.id} className="rounded-lg border p-4">

                <div className="flex items-center justify-between">

                  <div>
                    <div className="text-lg font-semibold">
                      {c.companyName}
                    </div>

                    <div className="text-sm text-slate-600">
                      Durum: {c.verified ? 'Aktif' : 'Pasif'}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">

                    <button
                      onClick={() =>
                        setExpandedCompanyId(
                          expandedCompanyId === c.id ? null : c.id
                        )
                      }
                      className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-white"
                    >
                      {expandedCompanyId === c.id
                        ? 'Detayları Gizle'
                        : 'Detayları Gör'}
                    </button>

                    <button
                      onClick={() => setCompanyToDelete(c)}
                      disabled={isDeleting}
                      className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white disabled:opacity-50"
                    >
                      {isDeleting ? 'Siliniyor...' : 'Sil'}
                    </button>

                  </div>

                </div>

                {expandedCompanyId === c.id && (
                  <div className="mt-4 border-t pt-4 space-y-3">

                    <div>
                      <span className="font-medium">
                        Şirket Adı:
                      </span>{' '}
                      {c.companyName}
                    </div>

                    <div>
                      <span className="font-medium">
                        E-posta:
                      </span>{' '}
                      {c.supportEmail || 'Belirtilmedi'}
                    </div>

                    <div>
                      <span className="font-medium">
                        Doğrulama Durumu:
                      </span>{' '}
                      {c.verified
                        ? 'Onaylı Kurumsal Hesap'
                        : 'Doğrulanmamış'}
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">

                      <div>
                        <span className="font-semibold">
                          Toplam Şikayet:
                        </span>{' '}
                        {c.totalComplaints}
                      </div>

                      <div className="text-green-600 font-medium">
                        <span className="font-semibold">
                          Çözüldü:
                        </span>{' '}
                        {c.resolvedComplaints}
                      </div>

                      <div
                        className={
                          c.openComplaints > 0
                            ? 'text-orange-600 font-medium'
                            : 'text-slate-500'
                        }
                      >
                        <span className="font-semibold">
                          Açık:
                        </span>{' '}
                        {c.openComplaints}
                      </div>

                      <div
                        className={
                          c.inReviewComplaints > 0
                            ? 'text-blue-600 font-medium'
                            : 'text-slate-500'
                        }
                      >
                        <span className="font-semibold">
                          İnceleniyor:
                        </span>{' '}
                        {c.inReviewComplaints}
                      </div>

                      <div
                        className={
                          c.pendingComplaints > 0
                            ? 'text-yellow-600 font-medium'
                            : 'text-slate-500'
                        }
                      >
                        <span className="font-semibold">
                          Beklemede:
                        </span>{' '}
                        {c.pendingComplaints}
                      </div>

                      <div
                        className={
                          c.answeredComplaints > 0
                            ? 'text-cyan-600 font-medium'
                            : 'text-slate-500'
                        }
                      >
                        <span className="font-semibold">
                          Yanıtlandı:
                        </span>{' '}
                        {c.answeredComplaints}
                      </div>

                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

        {companyToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

              <h3 className="text-lg font-semibold">
                Şirketi Sil
              </h3>

              <p className="mt-3 text-slate-600">
                <strong>{companyToDelete.companyName}</strong> şirketi
                ve bağlı hesapları silinecek.
              </p>

              <div className="mt-6 flex justify-end gap-3">

                <button
                  onClick={() => setCompanyToDelete(null)}
                  className="rounded-lg border px-4 py-2"
                >
                  İptal
                </button>

                <button
                  onClick={() => {
                    handleDeleteCompany(companyToDelete.id)
                    setCompanyToDelete(null)
                  }}
                  className="rounded-lg bg-red-600 px-4 py-2 text-white"
                >
                  Sil
                </button>

              </div>
            </div>
          </div>
        )}
      </PageSection>
    </section>
  )
}
