import { useCallback, useEffect, useMemo, useState } from 'react'
import { COMPLAINTS_PAGE_SIZE } from '@/constants/complaintList'
import {
  fetchComplaintsByStatus,
  fetchComplaintsPaginated,
  fetchComplaintsSorted,
  fetchLatestComplaints,
  searchComplaints,
} from '@/services/complaintService'
import {
  applyClientComplaintFilters,
  extractCompanyOptions,
  paginateComplaints,
  sortComplaints,
} from '@/utils/complaintFilters'
import { getApiErrorMessage } from '@/utils/apiError'

function usesServerPagination({ search, status, sortBy, company }) {
  return !search && !status && !company && sortBy === 'newest'
}

export function useComplaintsList() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [status, setStatus] = useState('')
  const [company, setCompany] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [page, setPage] = useState(0)

  const [complaints, setComplaints] = useState([])
  const [filterSourceComplaints, setFilterSourceComplaints] = useState([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim())
      setPage(0)
    }, 350)

    return () => window.clearTimeout(timer)
  }, [search])

  useEffect(() => {
    setPage(0)
  }, [status, company, sortBy])

  useEffect(() => {
    let isMounted = true

    async function loadFilterSources() {
      try {
        const [latestData] = await Promise.all([
          fetchLatestComplaints(),
        ])

        if (isMounted) {
          
          setFilterSourceComplaints(latestData)
        }
      } catch {
        if (isMounted) {
          
          setFilterSourceComplaints([])
        }
      }
    }

    loadFilterSources()

    return () => {
      isMounted = false
    }
  }, [])

  const loadComplaints = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const serverPagination = usesServerPagination({
        search: debouncedSearch,
        status,
        sortBy,
        company,
        
      })

      if (serverPagination) {
        const result = await fetchComplaintsPaginated(page, COMPLAINTS_PAGE_SIZE)
        setComplaints(result.content)
        setTotalElements(result.totalElements)
        setTotalPages(result.totalPages)
        return
      }

      let source = []

      if (debouncedSearch) {
        source = await searchComplaints(debouncedSearch)
      } else if (status) {
        source = await fetchComplaintsByStatus(status)
      } else if (sortBy === 'title-asc' || sortBy === 'title-desc') {
        source = await fetchComplaintsSorted()
      } else {
        source = await fetchLatestComplaints()
      }

      const filtered = applyClientComplaintFilters(source, {
        companyName: company,
      })

      const sorted =
        sortBy === 'title-asc' || sortBy === 'title-desc'
          ? sortComplaints(filtered, sortBy)
          : sortComplaints(filtered, sortBy)

      const paged = paginateComplaints(sorted, page, COMPLAINTS_PAGE_SIZE)

      setComplaints(paged)
      setTotalElements(sorted.length)
      setTotalPages(
        sorted.length === 0 ? 0 : Math.ceil(sorted.length / COMPLAINTS_PAGE_SIZE),
      )
    } catch (err) {
      setComplaints([])
      setTotalElements(0)
      setTotalPages(0)
      setError(
        getApiErrorMessage(err, 'Şikayetler yüklenemedi. Lütfen kısa süre sonra tekrar deneyin.'),
      )
    } finally {
      setIsLoading(false)
    }
  }, [debouncedSearch, status, company, sortBy, page])

  useEffect(() => {
    loadComplaints()
  }, [loadComplaints])

  const companyOptions = useMemo(
    () => extractCompanyOptions(filterSourceComplaints),
    [filterSourceComplaints],
  )

  

  return {
    complaints,
    isLoading,
    error,
    search,
    setSearch,
    status,
    setStatus,
    company,
    setCompany,
    sortBy,
    setSortBy,
    page,
    setPage,
    totalElements,
    totalPages,
    pageSize: COMPLAINTS_PAGE_SIZE,
    companyOptions,
    
    reload: loadComplaints,
  }
}
