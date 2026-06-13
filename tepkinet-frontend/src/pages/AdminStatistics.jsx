import { useEffect, useMemo, useState } from 'react'
import PageHeader from '@/components/common/PageHeader'
import PageSection from '@/components/ui/PageSection'
import { fetchAdminCompanies } from '@/services/adminService'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import AdminBackButton from '@/components/admin/AdminBackButton'


export default function AdminStatistics() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortType, setSortType] = useState('complaintsDesc')
  const [sortField, setSortField] = useState('totalComplaints')
  const [sortDirection, setSortDirection] = useState('desc')
  const [query, setQuery] = useState('')

  useEffect(() => {
    loadCompanies()
  }, [])

  async function loadCompanies() {
    try {
      const data = await fetchAdminCompanies()
      setCompanies(data)
    } finally {
      setLoading(false)
    }
  }

  function handleSort(field) {

    if (sortField === field) {

      setSortDirection(
        sortDirection === 'asc'
          ? 'desc'
          : 'asc'
      )

    } else {

      setSortField(field)
      setSortDirection('desc')

    }
  }

  function getSortIcon(field) {

    if (sortField !== field) {
      return '↕'
    }

    return sortDirection === 'asc'
      ? '↑'
      : '↓'
  }
  const filteredCompanies = useMemo(() => {

    const q = query.trim().toLowerCase()

    if (!q) {
      return companies
    }

    return companies.filter(
      (company) =>
        company.companyName
          ?.toLowerCase()
          .includes(q)
    )

  }, [companies, query])

  const sortedCompanies = useMemo(() => {

    const list = [...filteredCompanies]

    list.sort((a, b) => {

      const first = a[sortField]
      const second = b[sortField]

      if (typeof first === 'string') {

        return sortDirection === 'asc'
          ? first.localeCompare(second)
          : second.localeCompare(first)

      }

      return sortDirection === 'asc'
        ? first - second
        : second - first

    })

    return list

  }, [companies, sortField, sortDirection])

  if (loading) {
    return <div>Yükleniyor...</div>
  }

  return (
    <section>

      <PageHeader
        title="İstatistikler"
        description="Kayıtlı tüm şirketlerin performans ve şikayet istatistikleri."
      />

      <div className="mb-4">
        <AdminBackButton />
      </div>

      <PageSection>

      


        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Şirket ara..."
          className="mb-4 w-full rounded border p-2"
        />

        <div className="overflow-x-auto">

          <table className="w-full border-collapse">

            <thead>

              <tr className="border-b">





                <th
                  onClick={() => handleSort('companyName')}
                  className="cursor-pointer p-3 text-left"
                >
                  Şirket Adı (A-Z) {getSortIcon('companyName')}
                </th>
                <th
                  onClick={() => handleSort('totalComplaints')}
                  className="cursor-pointer p-3 text-left"
                >
                  Toplam {getSortIcon('totalComplaints')}
                </th>

                <th
                  onClick={() => handleSort('pendingComplaints')}
                  className="cursor-pointer p-3 text-left"
                >
                  Beklemede {getSortIcon('pendingComplaints')}
                </th>
                <th
                  onClick={() => handleSort('openComplaints')}
                  className="cursor-pointer p-3 text-left"
                >
                  Açık {getSortIcon('openComplaints')}
                </th>

                <th
                  onClick={() => handleSort('inReviewComplaints')}
                  className="cursor-pointer p-3 text-left"
                >
                  İnceleniyor {getSortIcon('inReviewComplaints')}
                </th>

                <th
                  onClick={() => handleSort('answeredComplaints')}
                  className="cursor-pointer p-3 text-left"
                >
                  Yanıtlandı {getSortIcon('answeredComplaints')}
                </th>

                <th
                  onClick={() => handleSort('resolvedComplaints')}
                  className="cursor-pointer p-3 text-left"
                >
                  Çözüldü {getSortIcon('resolvedComplaints')}
                </th>

              </tr>

            </thead>

            <tbody>

              {sortedCompanies.map((company) => (

                <tr
                  key={company.id}
                  className="border-b"
                >

                  <td className="p-3 font-medium">
                    {company.companyName}
                  </td>

                  <td className="p-3">
                    {company.totalComplaints}
                  </td>

                  <td className="p-3">
                    {company.pendingComplaints}
                  </td>

                  <td className="p-3">
                    {company.openComplaints}
                  </td>

                  <td className="p-3">
                    {company.inReviewComplaints}
                  </td>

                  <td className="p-3">
                    {company.answeredComplaints}
                  </td>

                  <td className="p-3 text-green-600 font-semibold">
                    {company.resolvedComplaints}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </PageSection>

    </section>
  )
}