import api from '@/services/api'
import { STORAGE_KEYS } from '@/constants/app'
import { normalizeRole } from '@/constants/roles'
import { parseJwtPayload } from '@/utils/jwt'
import { getStorageItem, removeStorageItem, setStorageItem } from '@/utils/storage'
import { normalizeUser } from '@/utils/user'

const AUTH_PATH = '/auth'

function extractToken(data) {
  return data?.accessToken ?? data?.token ?? data?.jwt ?? null
}

function buildSession(data) {
  const token = extractToken(data)

  if (!token) {
    throw new Error('Authentication response did not include a token.')
  }

  const claims = parseJwtPayload(token)
  const user = normalizeUser(data?.user ?? data, claims)

  return { token, user }
}

export function readStoredSession() {
  const token = getStorageItem(STORAGE_KEYS.ACCESS_TOKEN)
  const rawUser = getStorageItem(STORAGE_KEYS.CURRENT_USER)

  if (!token) {
    return { token: null, user: null }
  }

  let user = null

  if (rawUser) {
    try {
      user = normalizeUser(JSON.parse(rawUser), parseJwtPayload(token))
    } catch {
      user = null
    }
  }

  if (!user) {
    user = normalizeUser(null, parseJwtPayload(token))
  }

  return { token, user }
}

export function persistSession({ token, user }) {
  setStorageItem(STORAGE_KEYS.ACCESS_TOKEN, token)

  if (user) {
    setStorageItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
  } else {
    removeStorageItem(STORAGE_KEYS.CURRENT_USER)
  }
}

export function clearSession() {
  removeStorageItem(STORAGE_KEYS.ACCESS_TOKEN)
  removeStorageItem(STORAGE_KEYS.CURRENT_USER)
}

export async function login(credentials) {
  const { data } = await api.post(`${AUTH_PATH}/login`, credentials)
  const session = buildSession(data)
  persistSession(session)
  return session
}

export async function register(payload) {
  const body = {
    username: payload.username || `${payload.firstName} ${payload.lastName}`,
    email: payload.email,
    password: payload.password,
  }

  const { data } = await api.post(`${AUTH_PATH}/register`, body)
  const session = buildSession(data)
  persistSession(session)
  return session
}

export async function submitCompanyApplication(payload) {
  const { data } = await api.post('/company-applications', payload)
  return data
}

export async function fetchCurrentUser() {
  const { data } = await api.get(`${AUTH_PATH}/me`)
  const token = getStorageItem(STORAGE_KEYS.ACCESS_TOKEN)
  const user = normalizeUser(data?.user ?? data, parseJwtPayload(token))

  if (user) {
    setStorageItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
  }

  return user
}
export async function changePassword(payload) {
  const { data } = await api.put(`${AUTH_PATH}/change-password`, payload)
  return data
}

export function logout() {
  clearSession()
}
