import api from '@/services/api'

const COMPLAINTS_PATH = '/complaints'

export async function fetchLatestComplaints() {
  const { data } = await api.get(`${COMPLAINTS_PATH}/latest`)
  return Array.isArray(data) ? data : []
}

export async function fetchComplaintsPaginated(page, size) {
  const { data } = await api.get(`${COMPLAINTS_PATH}/pagination`, {
    params: { page, size },
  })

  return {
    content: Array.isArray(data?.content) ? data.content : [],
    totalElements: data?.totalElements ?? 0,
    totalPages: data?.totalPages ?? 0,
    number: data?.number ?? page,
    size: data?.size ?? size,
  }
}

export async function fetchComplaintsSorted() {
  const { data } = await api.get(`${COMPLAINTS_PATH}/sorted`)
  return Array.isArray(data) ? data : []
}

export async function fetchComplaintsByStatus(status) {
  const { data } = await api.get(`${COMPLAINTS_PATH}/status/${status}`)
  return Array.isArray(data) ? data : []
}

export async function searchComplaints(keyword) {
  const { data } = await api.get(`${COMPLAINTS_PATH}/search`, {
    params: { keyword },
  })
  return Array.isArray(data) ? data : []
}

export async function fetchAllComplaints() {
  const { data } = await api.get(COMPLAINTS_PATH)
  return Array.isArray(data) ? data : []
}

export async function fetchComplaintById(id) {
  const { data } = await api.get(`${COMPLAINTS_PATH}/${id}`)
  return data
}

export async function fetchMyComplaints() {
  const { data } = await api.get(`${COMPLAINTS_PATH}/my-complaints`)
  return Array.isArray(data) ? data : []
}

export async function fetchCompanyComplaints() {
  const { data } = await api.get(`${COMPLAINTS_PATH}/company`)
  return Array.isArray(data) ? data : []
}

export async function updateComplaintStatus(id, status) {
  const { data } = await api.patch(`${COMPLAINTS_PATH}/${id}/status`, null, {
    params: { status },
  })
  return data
}

export async function closeComplaint(id) {
  const { data } = await api.post(`${COMPLAINTS_PATH}/${id}/close`)
  return data
}

export async function deleteComplaint(id) {
  await api.delete(`${COMPLAINTS_PATH}/${id}`)
}

export async function createComplaint({ title, content, companyId }) {
  const { data } = await api.post(
    COMPLAINTS_PATH,
    { title, content },
    {
      params: { companyId },
    },
  )
  return data
}
