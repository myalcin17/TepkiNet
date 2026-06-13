import { COMPLAINT_STATUS, getComplaintStatusConfig } from '@/constants/complaintStatus'

const TRACKED_STATUSES = [
  COMPLAINT_STATUS.PENDING,
  COMPLAINT_STATUS.OPEN,
  COMPLAINT_STATUS.IN_REVIEW,
  COMPLAINT_STATUS.ANSWERED,
  COMPLAINT_STATUS.RESOLVED,
  COMPLAINT_STATUS.CLOSED_BY_CUSTOMER,
]

export function computeComplaintStatusCounts(complaints) {
  const counts = {
    total: complaints.length,
    [COMPLAINT_STATUS.PENDING]: 0,
    [COMPLAINT_STATUS.OPEN]: 0,
    [COMPLAINT_STATUS.IN_REVIEW]: 0,
    [COMPLAINT_STATUS.ANSWERED]: 0,
    [COMPLAINT_STATUS.RESOLVED]: 0,
    [COMPLAINT_STATUS.CLOSED_BY_CUSTOMER]: 0,
  }

  complaints.forEach((complaint) => {
    if (Object.hasOwn(counts, complaint.status)) {
      counts[complaint.status] += 1
    }
  })

  return counts
}

export function getComplaintStatusOverviewItems(counts, isUserPanel = false) {
  return TRACKED_STATUSES.map((status) => {
    const config = getComplaintStatusConfig(status, isUserPanel)
    return {
      status,
      count: counts[status] ?? 0,
      label: config.label,
    }
  })
}
