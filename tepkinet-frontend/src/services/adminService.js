import api from '@/services/api'

const ADMIN_PATH = '/admin'

export async function fetchCompanyApplications() {
  const { data } = await api.get(`${ADMIN_PATH}/company-applications`)
  return Array.isArray(data) ? data : []
}

export async function getCompanyApplication(id) {
  const { data } = await api.get(`${ADMIN_PATH}/company-applications/${id}`)
  return data
}

export async function approveApplication(id, adminNotes) {
  const { data } = await api.post(`${ADMIN_PATH}/company-applications/${id}/approve`, {
    adminNotes,
  })
  return data
}

export async function rejectApplication(id, adminNotes) {
  const { data } = await api.post(`${ADMIN_PATH}/company-applications/${id}/reject`, {
    adminNotes,
  })
  return data
}

export async function fetchAdminCompanies() {
  const { data } = await api.get(`${ADMIN_PATH}/companies`)
  return Array.isArray(data) ? data : []
}

export async function fetchAdminComplaints() {
  const { data } = await api.get('/complaints')
  return Array.isArray(data) ? data : []
}

export async function deleteAdminComplaint(id) {
  await api.delete(`/complaints/${id}`)
}

export async function fetchAdminUsers() {
  const { data } = await api.get(`${ADMIN_PATH}/users`)
  return Array.isArray(data) ? data : []
}

export async function deleteCompany(id) {
  await api.delete(`/companies/${id}`)
}