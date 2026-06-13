import { useEffect, useState } from 'react'
import { fetchAllComplaints } from '@/services/complaintService'
import { fetchCompanies } from '@/services/companyService'
import { fetchUsers } from '@/services/userService'
import { getApiErrorMessage } from '@/utils/apiError'
import { COMPLAINT_STATUS } from '@/constants/complaintStatus'

export function useGuestHomeData() {
  const [topCompanies, setTopCompanies] = useState([])
  const [stats, setStats] = useState({
    totalComplaints: 0,
    totalResolved: 0,
    companies: 0,
    users: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadHomeData() {
      setIsLoading(true)
      setError('')

      try {
        const [complaints, companies, users] = await Promise.all([
          fetchAllComplaints(),
          fetchCompanies(),
          fetchUsers(),
        ])

        if (!isMounted) return

        const totalComplaints = complaints.length
        const totalResolved = complaints.filter(
          (complaint) => complaint.status === COMPLAINT_STATUS.RESOLVED,
        ).length

        const resolvedByCompany = complaints.reduce((acc, complaint) => {
          if (complaint.status !== COMPLAINT_STATUS.RESOLVED) {
            return acc
          }

          const companyName = complaint.companyName || `Şirket ${complaint.id ?? ''}`.trim()
          if (!companyName) {
            return acc
          }

          acc[companyName] = (acc[companyName] || 0) + 1
          return acc
        }, {})

        const topCompanies = Object.keys(resolvedByCompany)
          .map((companyName) => ({
            name: companyName,
            count: resolvedByCompany[companyName],
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)

        setTopCompanies(topCompanies)
        setStats({
          totalComplaints,
          totalResolved,
          companies: companies.length,
          users: users.length,
        })
      } catch (err) {
        if (!isMounted) return
        setTopCompanies([])
        setStats({ totalComplaints: 0, totalResolved: 0, companies: 0, users: 0 })
        setError(getApiErrorMessage(err, 'Ana sayfa verileri yüklenemedi.'))
      } finally {
        if (!isMounted) return
        setIsLoading(false)
      }
    }

    loadHomeData()

    return () => {
      isMounted = false
    }
  }, [])

  return {
    topCompanies,
    stats,
    isLoading,
    error,
  }
}
