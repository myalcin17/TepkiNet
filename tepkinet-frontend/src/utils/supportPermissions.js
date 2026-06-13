import { ROLES } from '@/constants/roles'
import { COMPLAINT_STATUS } from '@/constants/complaintStatus'

function complaintIdMatches(complaints, complaintId) {
  const targetId = Number(complaintId)

  if (!Number.isFinite(targetId)) {
    return false
  }

  return complaints.some((item) => Number(item.id) === targetId)
}

export function isComplaintOwner(user, complaint) {
  if (!user || !complaint) {
    return false
  }

  if (user.username && complaint.username) {
    return user.username === complaint.username
  }

  return false
}

export function canSendSupportMessage(user, complaint, relatedComplaints = []) {
  if (!user || !complaint?.id) {
    return false
  }

  if (
    complaint.status === COMPLAINT_STATUS.CLOSED_BY_CUSTOMER ||
    complaint.status === COMPLAINT_STATUS.RESOLVED
  ) {
    return false
  }

  if (isComplaintOwner(user, complaint)) {
    return true
  }

  if (user.role === ROLES.COMPANY && complaintIdMatches(relatedComplaints, complaint.id)) {
    return true
  }

  if (
    (user.role === ROLES.USER || user.role === ROLES.ADMIN) &&
    complaintIdMatches(relatedComplaints, complaint.id)
  ) {
    return true
  }

  return false
}
