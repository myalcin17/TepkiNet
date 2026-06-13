import { useCallback, useEffect, useMemo, useState } from 'react'
import { COMPLAINTS_PAGE_SIZE } from '@/constants/complaintList'
import { COMPLAINT_STATUS } from '@/constants/complaintStatus'
import {
  fetchCompanyComplaints,
  updateComplaintStatus,
} from '@/services/complaintService'
import { getApiErrorMessage } from '@/utils/apiError'
import {
  filterCompanyComplaintsBySearch,
  filterComplaintsByStatus,
  paginateComplaints,
  sortComplaints,
} from '@/utils/complaintFilters'
import { computeComplaintStatusCounts } from '@/utils/complaintStatusStats'

export function useCompanyComplaints() {
  const [allComplaints, setAllComplaints] = useState([])
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [status, setStatus] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [page, setPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const [statusUpdateError, setStatusUpdateError] = useState('')

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim())
      setPage(0)
    }, 300)

    return () => window.clearTimeout(timer)
  }, [search])

  useEffect(() => {
    setPage(0)
  }, [status, sortBy])

  const loadComplaints = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const data = await fetchCompanyComplaints()
      setAllComplaints(data)
    } catch (err) {
      setAllComplaints([])
      setError(
        getApiErrorMessage(err, 'Şirket şikayetleri yüklenemedi. Lütfen kısa süre sonra tekrar deneyin.'),
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadComplaints()
  }, [loadComplaints])

  const statusCounts = useMemo(
    () => computeComplaintStatusCounts(allComplaints),
    [allComplaints],
  )

  const filteredComplaints = useMemo(() => {
    const searched = filterCompanyComplaintsBySearch(allComplaints, debouncedSearch)
    const byStatus = filterComplaintsByStatus(searched, status)
    return sortComplaints(byStatus, sortBy)
  }, [allComplaints, debouncedSearch, status, sortBy])

  const totalElements = filteredComplaints.length
  const totalPages =
    totalElements === 0 ? 0 : Math.ceil(totalElements / COMPLAINTS_PAGE_SIZE)

  useEffect(() => {
    if (page > 0 && totalPages > 0 && page >= totalPages) {
      setPage(totalPages - 1)
    } else if (page > 0 && totalPages === 0) {
      setPage(0)
    }
  }, [page, totalPages])

  const complaints = useMemo(
    () => paginateComplaints(filteredComplaints, page, COMPLAINTS_PAGE_SIZE),
    [filteredComplaints, page],
  )

  const hasAnyComplaints = allComplaints.length > 0
  const hasFilteredResults = filteredComplaints.length > 0

  const updateComplaintStatusById = useCallback(async (complaintId, newStatus) => {
    setUpdatingId(complaintId)
    setStatusUpdateError('')

    try {
      const updated = await updateComplaintStatus(complaintId, newStatus)

      if (!updated?.id) {
        setStatusUpdateError('Durum güncellenemedi. Yetkilerinizi kontrol edip tekrar deneyin.')
        return null
      }

      setAllComplaints((previous) =>
        previous.map((item) => (item.id === complaintId ? updated : item)),
      )

      return updated
    } catch (err) {
      setStatusUpdateError(
        getApiErrorMessage(err, 'Şikayet durumu güncellenemedi. Lütfen tekrar deneyin.'),
      )
      return null
    } finally {
      setUpdatingId(null)
    }
  }, [])

  const clearStatusUpdateError = useCallback(() => {
    setStatusUpdateError('')
  }, [])

  const openCount = statusCounts[COMPLAINT_STATUS.OPEN] ?? 0
  const inProgressCount =
    (statusCounts[COMPLAINT_STATUS.IN_REVIEW] ?? 0) +
    (statusCounts[COMPLAINT_STATUS.ANSWERED] ?? 0)
  const resolvedCount = statusCounts[COMPLAINT_STATUS.RESOLVED] ?? 0

  return {
    complaints,
    isLoading,
    error,
    search,
    setSearch,
    status,
    setStatus,
    sortBy,
    setSortBy,
    page,
    setPage,
    totalElements,
    totalPages,
    pageSize: COMPLAINTS_PAGE_SIZE,
    statusCounts,
    hasAnyComplaints,
    hasFilteredResults,
    reload: loadComplaints,
    updatingId,
    statusUpdateError,
    clearStatusUpdateError,
    updateComplaintStatusById,
    openCount,
    inProgressCount,
    resolvedCount,
  }
}
