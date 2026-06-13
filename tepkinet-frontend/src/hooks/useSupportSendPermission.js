import { useEffect, useState } from 'react'
import { ROLES } from '@/constants/roles'
import { fetchCompanyComplaints, fetchMyComplaints } from '@/services/complaintService'
import { useAuth } from '@/hooks/useAuth'
import { canSendSupportMessage, isComplaintOwner } from '@/utils/supportPermissions'

export function useSupportSendPermission(complaint) {
  const { user, isAuthenticated } = useAuth()
  const [relatedComplaints, setRelatedComplaints] = useState([])
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function resolveRelatedComplaints() {
      if (!isAuthenticated || !user || !complaint?.id) {
        if (isMounted) {
          setRelatedComplaints([])
          setIsChecking(false)
        }
        return
      }

      if (isComplaintOwner(user, complaint)) {
        if (isMounted) {
          setRelatedComplaints([])
          setIsChecking(false)
        }
        return
      }

      setIsChecking(true)

      try {
        if (user.role === ROLES.COMPANY) {
          const complaints = await fetchCompanyComplaints()
          if (isMounted) {
            setRelatedComplaints(complaints)
          }
          return
        }

        if (user.role === ROLES.USER || user.role === ROLES.ADMIN) {
          const complaints = await fetchMyComplaints()
          if (isMounted) {
            setRelatedComplaints(complaints)
          }
        }
      } catch {
        if (isMounted) {
          setRelatedComplaints([])
        }
      } finally {
        if (isMounted) {
          setIsChecking(false)
        }
      }
    }

    resolveRelatedComplaints()

    return () => {
      isMounted = false
    }
  }, [complaint, isAuthenticated, user])

  const canSend =
    isAuthenticated && canSendSupportMessage(user, complaint, relatedComplaints)

  return { canSend, isCheckingPermission: isChecking }
}
