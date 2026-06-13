import axios from 'axios'
import { STORAGE_KEYS } from '@/constants/app'
import { emitUnauthorized } from '@/services/authEvents'
import { getStorageItem, removeStorageItem } from '@/utils/storage'

function clearStoredAuth() {
  removeStorageItem(STORAGE_KEYS.ACCESS_TOKEN)
  removeStorageItem(STORAGE_KEYS.CURRENT_USER)
}

const api = axios.create({
  baseURL:'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = getStorageItem(STORAGE_KEYS.ACCESS_TOKEN)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const requestUrl = error.config?.url ?? ''
    const isAuthRequest = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register')

    if (status === 401 && !isAuthRequest) {
      clearStoredAuth()
      emitUnauthorized()
    }

    return Promise.reject(error)
  },
)

export default api
