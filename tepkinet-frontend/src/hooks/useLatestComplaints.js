import { useEffect, useState } from 'react'
import { HOME_LATEST_LIMIT } from '@/constants/home'
import { fetchLatestComplaints } from '@/services/complaintService'
import { getApiErrorMessage } from '@/utils/apiError'

export function useLatestComplaints(limit = HOME_LATEST_LIMIT) {
  const [complaints, setComplaints] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function load() {
      setIsLoading(true)
      setError('')

      try {
        const data = await fetchLatestComplaints()

        if (isMounted) {
          setComplaints(data.slice(0, limit))
        }
      } catch (err) {
        if (isMounted) {
          setComplaints([])
          setError(
            getApiErrorMessage(
              err,
              'Son şikayetler yüklenemedi. Lütfen kısa süre sonra tekrar deneyin.',
            ),
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [limit])

  return { complaints, isLoading, error }
}
