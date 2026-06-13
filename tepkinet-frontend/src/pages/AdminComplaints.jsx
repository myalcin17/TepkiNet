import React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { complaintDetailPath } from '@/constants/routes'
import PageHeader from '@/components/common/PageHeader'
import PageSection from '@/components/ui/PageSection'
import {
  fetchAdminComplaints,
  deleteAdminComplaint,
} from '@/services/adminService'
import StatusBadge from '@/components/ui/StatusBadge'
import AdminBackButton from '@/components/admin/AdminBackButton'


export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [expandedComplaintId, setExpandedComplaintId] = useState(null)
  const [complaintToDelete, setComplaintToDelete] = useState(null)

  function getStatusLabel(status) {
    switch (status) {
      case 'PENDING':
        return 'Beklemede'

      case 'OPEN':
        return 'Açık'

      case 'IN_REVIEW':
        return 'İnceleniyor'

      case 'ANSWERED':
        return 'Yanıtlandı'

      case 'RESOLVED':
        return 'Çözüldü'

      case 'CLOSED_BY_CUSTOMER':
        return 'Müşteri Tarafından Kapatıldı'

      default:
        return status
    }
  }

  useEffect(() => {
    loadComplaints()
  }, [])

  async function loadComplaints() {
    try {
      const data = await fetchAdminComplaints()
      setComplaints(data)
    } finally {
      setLoading(false)
    }
  }

async function handleDelete() {
  if (!complaintToDelete) {
    return
  }

  await deleteAdminComplaint(complaintToDelete.id)

  setComplaints((prev) =>
    prev.filter((c) => c.id !== complaintToDelete.id)
  )

  setComplaintToDelete(null)
}

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    if (!q) {
      return complaints
    }

    return complaints.filter(
      (c) =>
        c.title?.toLowerCase().includes(q) ||
        c.companyName?.toLowerCase().includes(q) ||
        c.username?.toLowerCase().includes(q)
    )
  }, [complaints, query])

  return (
    <section>
      <PageHeader
        title="Şikayet Yönetimi"
        description="Sistemdeki tüm şikayetleri görüntüleyin ve yönetin."
      />

      <div className="mb-4">
        <AdminBackButton />
      </div>

      <PageSection>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Şikayet ara..."
          className="mb-4 w-full rounded border p-2"
        />

        {loading ? (
          <div>Yükleniyor...</div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full border-collapse">

              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left">Başlık</th>
                  <th className="p-3 text-left">Şirket</th>
                  <th className="p-3 text-left">Kullanıcı</th>
                  <th className="p-3 text-left">Durum</th>
                  <th className="p-3 text-left">İşlemler</th>
                </tr>
              </thead>

              <tbody>

                {filtered.map((c) => (
                  <React.Fragment key={c.id}>
                    <tr className="border-b">

                      <td className="p-3">
                        {c.title}
                      </td>

                      <td className="p-3">
                        {c.companyName}
                      </td>

                      <td className="p-3">
                        {c.username}
                      </td>

                      <td className="p-3">
                        <StatusBadge status={c.status} />
                      </td>

                      <td className="p-3 flex gap-2">

                        <button
                          onClick={() =>
                            setExpandedComplaintId(
                              expandedComplaintId === c.id
                                ? null
                                : c.id
                            )
                          }
                          className="rounded bg-slate-700 px-3 py-1 text-white"
                        >
                          {expandedComplaintId === c.id
                            ? 'Gizle'
                            : 'Detay'}
                        </button>

                       <button
  onClick={() => setComplaintToDelete(c)}
  className="rounded bg-red-600 px-3 py-1 text-white"
>
  Sil
</button>

                      </td>

                    </tr>

                    {expandedComplaintId === c.id && (
                      <tr className="border-b bg-slate-50 dark:bg-slate-900">

                        <td colSpan="5" className="p-5">

                          <div className="space-y-4">

                            <div>
                              <h4 className="font-semibold">
                                Şikayet Başlığı
                              </h4>

                              <p className="mt-1">
                                {c.title}
                              </p>
                            </div>

                            <div>
                              <h4 className="font-semibold">
                                Şikayet İçeriği
                              </h4>

                              <p className="mt-1 whitespace-pre-wrap">
                                {c.content}
                              </p>
                            </div>

                            <div className="grid gap-2 md:grid-cols-4">

                              <div>
                                <span className="font-medium">
                                  Kullanıcı:
                                </span>{' '}
                                {c.username}
                              </div>

                              <div>
                                <span className="font-medium">
                                  Şirket:
                                </span>{' '}
                                {c.companyName}
                              </div>

                              <div>
                                <span className="font-medium">
                                  Durum:
                                </span>{' '}
                                <StatusBadge status={c.status} />
                              </div>


                              <div>
                                <span className="font-medium">
                                  Oluşturulma:
                                </span>{' '}
                                {c.createdAt
                                  ? new Date(c.createdAt).toLocaleString('tr-TR')
                                  : '-'}
                              </div>

                            </div>

                          </div>
                          <div className="pt-4">

                            <Link
                              to={complaintDetailPath(c.id)}
                              className="inline-flex items-center rounded-lg bg-brand-700 px-4 py-2 text-white"
                            >
                              Şikayet Sayfasına Git
                            </Link>

                          </div>
                        </td>

                      </tr>
                    )}

                  </React.Fragment>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </PageSection>

      {complaintToDelete && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">

      <h3 className="text-lg font-semibold">
        Şikayet Silinsin mi?
      </h3>

      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        "{complaintToDelete.title}" başlıklı şikayet kalıcı olarak silinecek.
      </p>

      <div className="mt-6 flex justify-end gap-3">

        <button
          onClick={() => setComplaintToDelete(null)}
          className="rounded-lg border px-4 py-2"
        >
          İptal
        </button>

        <button
          onClick={handleDelete}
          className="rounded-lg bg-red-600 px-4 py-2 text-white"
        >
          Sil
        </button>

      </div>

    </div>
  </div>
)}
    </section>
  )
}