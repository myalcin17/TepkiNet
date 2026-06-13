import api from '@/services/api'

const USERS_PATH = '/users'

export async function fetchUsers() {
  const { data } = await api.get(USERS_PATH)
  return Array.isArray(data) ? data : []
}
