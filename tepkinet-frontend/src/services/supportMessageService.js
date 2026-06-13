import api from '@/services/api'

const SUPPORT_MESSAGES_PATH = '/support-messages'

export async function fetchSupportMessages(complaintId) {
  const { data } = await api.get(SUPPORT_MESSAGES_PATH, {
    params: { complaintId },
  })

  return Array.isArray(data) ? data : []
}

export async function sendSupportMessage(complaintId, message) {
  const { data } = await api.post(
    SUPPORT_MESSAGES_PATH,
    { message },
    {
      params: { complaintId },
    },
  )

  return data
}
