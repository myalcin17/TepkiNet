import api from '@/services/api'

const COMPANIES_PATH = '/companies'

export async function fetchCompanies() {
  const { data } = await api.get(COMPANIES_PATH)
  return Array.isArray(data) ? data : []
}
