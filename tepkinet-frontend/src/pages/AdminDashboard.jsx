import { Link } from 'react-router-dom'
import PageHeader from '@/components/common/PageHeader'
import PageSection from '@/components/ui/PageSection'
import { ROLES } from '@/constants/roles'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { useEffect, useState } from 'react'
import api from '@/services/api'
import { fetchAdminCompanies } from '@/services/adminService'


export default function AdminDashboard() {
  const { userHasRole } = useAuth()
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [companies, setCompanies] = useState([])

  if (!userHasRole([ROLES.ADMIN])) {
    return null
  }

  useEffect(() => {
  async function loadDashboard() {
    try {
      const { data } = await api.get('/admin/dashboard')
      const companyData = await fetchAdminCompanies()
      setCompanies(companyData)
      setDashboard(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  loadDashboard()
}, [])

if (loading) {
  return <div>Yükleniyor...</div>
}

  return (
    <section>
      <PageHeader
        title="TepkiNet'e hoş geldiniz"
        description="Yönetici panelinde platformu kontrol etmek, şikayetleri izlemek ve moderasyon görevlerine hızlıca erişmek için buradasınız."
      />

      <PageSection>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

<Link
  to={ROUTES.ADMIN_USERS}
  className="
    rounded-3xl
    border
    border-slate-200
    dark:border-slate-800
    bg-white
    dark:bg-slate-900
    p-6
    transition
    hover:shadow-lg
  "
>
  <p className="text-sm text-slate-500 dark:text-slate-400">
    Toplam Kullanıcı
  </p>

  <h2 className="mt-3 text-4xl font-bold text-slate-900 dark:text-slate-100">
    {dashboard?.totalUsers}
  </h2>
</Link>

<Link
  to={ROUTES.ADMIN_COMPANIES}
  className="
    rounded-3xl
    border
    border-slate-200
    dark:border-slate-800
    bg-white
    dark:bg-slate-900
    p-6
    transition
    hover:shadow-lg
  "
>
  <p className="text-sm text-slate-500 dark:text-slate-400">
    Toplam Şirket
  </p>

  <h2 className="mt-3 text-4xl font-bold text-slate-900 dark:text-slate-100">
      {dashboard?.totalCompanies}
    </h2>
</Link>

<Link
  to={ROUTES.ADMIN_COMPLAINTS}
  className="
    rounded-3xl
    border
    border-slate-200
    dark:border-slate-800
    bg-white
    dark:bg-slate-900
    p-6
    transition
    hover:shadow-lg
  "
>
  <p className="text-sm text-slate-500 dark:text-slate-400">
    Toplam Şikayet
  </p>

  <h2 className="mt-3 text-4xl font-bold text-slate-900 dark:text-slate-100">
    {dashboard?.totalComplaints}
  </h2>
</Link>

<Link
  to={ROUTES.ADMIN_STATISTICS}
  className="
    rounded-3xl
    border
    border-slate-200
    dark:border-slate-800
    bg-white
    dark:bg-slate-900
    p-6
    transition
    hover:shadow-lg
  "
>
  <p className="text-sm text-slate-500 dark:text-slate-400">
      Çözülen Şikayet
    </p>

    <h2 className="mt-3 text-4xl font-bold text-slate-900 dark:text-slate-100">
      {dashboard?.resolvedComplaints}
    </h2>
</Link>


</div>

    <div
  className="
    mt-8
    rounded-3xl
    border
    border-slate-200
    dark:border-slate-800
    bg-white
    dark:bg-slate-900
    p-6
  "
>
  <h2 className="mb-4 text-xl font-semibold">
    En Çok Şikayet Alan 5 Şirket
  </h2>

  {[...companies]
    .sort((a, b) => b.totalComplaints - a.totalComplaints)
    .slice(0, 5)
    .map((company, index) => (
      <div
        key={company.id}
        className="flex justify-between border-b py-3 last:border-0"
      >
        <span>
          {index + 1}. {company.companyName}
        </span>

        <span className="font-semibold">
          {company.totalComplaints} şikayet
        </span>
      </div>
    ))}

</div>

      </PageSection>
    </section>
  )
}