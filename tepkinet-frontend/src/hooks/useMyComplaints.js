import { useCallback, useEffect, useMemo, useState } from 'react'
import { COMPLAINTS_PAGE_SIZE } from '@/constants/complaintList'
import { fetchMyComplaints } from '@/services/complaintService'
import { getApiErrorMessage } from '@/utils/apiError'
import {
  filterComplaintsBySearch,
  filterComplaintsByStatus,
  paginateComplaints,
  sortComplaints,
} from '@/utils/complaintFilters'
import { computeComplaintStatusCounts } from '@/utils/complaintStatusStats'

export function useMyComplaints() {
  const [allComplaints, setAllComplaints] = useState([])
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [status, setStatus] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [page, setPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

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
      const data = await fetchMyComplaints()
      setAllComplaints(data)
    } catch (err) {
      setAllComplaints([])
      setError(
        getApiErrorMessage(err, 'Şikayetleriniz yüklenemedi. Lütfen kısa süre sonra tekrar deneyin.'),
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
    const searched = filterComplaintsBySearch(allComplaints, debouncedSearch)
    const byStatus = filterComplaintsByStatus(searched, status)
    return sortComplaints(byStatus, sortBy)
  }, [allComplaints, debouncedSearch, status, sortBy])

  const totalElements = filteredComplaints.length
  const totalPages =
    totalElements === 0 ? 0 : Math.ceil(totalElements / COMPLAINTS_PAGE_SIZE)

  const complaints = useMemo(
    () => paginateComplaints(filteredComplaints, page, COMPLAINTS_PAGE_SIZE),
    [filteredComplaints, page],
  )

  const hasAnyComplaints = allComplaints.length > 0
  const hasFilteredResults = filteredComplaints.length > 0

  return {
    complaints,
    allComplaints,
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
  }
}
