import React from 'react'
import { useEffect, useMemo, useState } from 'react'
import PageHeader from '@/components/common/PageHeader'
import PageSection from '@/components/ui/PageSection'
import { fetchAdminUsers } from '@/services/adminService'
import AdminBackButton from '@/components/admin/AdminBackButton'


export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [expandedUserId, setExpandedUserId] = useState(null)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    try {
      const data = await fetchAdminUsers()
      setUsers(data)
    } finally {
      setLoading(false)
    }
  }
  
  function getRoleLabel(role) {
  switch (role) {
    case 'ADMIN':
      return 'Yönetici'

    case 'COMPANY':
      return 'Kurumsal Hesap'

    case 'USER':
      return 'Kullanıcı'

    default:
      return role
  }
}


  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    if (!q) {
      return users
    }

    return users.filter(
      (u) =>
        u.username?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q)
    )
  }, [users, query])

  return (
    <section>
      <PageHeader
        title="Tüm Kullanıcılar"
        description="Sistemde kayıtlı tüm kullanıcıları görüntüleyin."
      />

      <PageSection>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Kullanıcı ara..."
          className="mb-4 w-full rounded border p-2"
        />

        {loading ? (
          <div>Yükleniyor...</div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full border-collapse">

              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left">Kullanıcı</th>
                  <th className="p-3 text-left">E-posta</th>
                  <th className="p-3 text-left">Rol</th>
                  <th className="p-3 text-left">İşlemler</th>
                </tr>
              </thead>

             <tbody>

  {filtered.map((user) => (
    <React.Fragment key={user.id}>

      <tr className="border-b">

        <td className="p-3">
          {user.username}
        </td>

        <td className="p-3">
          {user.email}
        </td>

        <td className="p-3">
          {getRoleLabel(user.role)}
        </td>

        <td className="p-3">

          <button
            onClick={() =>
              setExpandedUserId(
                expandedUserId === user.id
                  ? null
                  : user.id
              )
            }
            className="rounded bg-slate-700 px-3 py-1 text-white"
          >
            {expandedUserId === user.id
              ? 'Detayları Gizle'
              : 'Detayları Gör'}
          </button>

        </td>

      </tr>

      {expandedUserId === user.id && (

        <tr className="border-b bg-slate-50 dark:bg-slate-900">

          <td colSpan="4" className="p-5">

            <div className="grid gap-4 md:grid-cols-3">

              <div>
                <span className="font-medium">
                  Kullanıcı:
                </span>{' '}
                {user.username}
              </div>

              <div>
                <span className="font-medium">
                  E-posta:
                </span>{' '}
                {user.email}
              </div>

              <div>
                <span className="font-medium">
                  Rol:
                </span>{' '}
                {getRoleLabel(user.role)}
              </div>

              <div>
  <span className="font-medium">
    Kayıt Tarihi:
  </span>{' '}
  {user.createdAt
    ? new Date(user.createdAt).toLocaleString('tr-TR')
    : '-'}
</div>

      {user.role === 'USER' && (
  <div>
    <span className="font-medium">
      Şikayet Sayısı:
    </span>{' '}
    {user.complaintCount}
  </div>
)}

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
    </section>
  )
}