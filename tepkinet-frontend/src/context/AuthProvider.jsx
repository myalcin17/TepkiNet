import { useCallback, useEffect, useMemo, useState } from 'react'
import { hasRole } from '@/constants/roles'
import { AuthContext } from '@/context/authContext'
import { subscribeUnauthorized } from '@/services/authEvents'
import {
  clearSession,
  fetchCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  persistSession,
  readStoredSession,
  register as registerRequest,
} from '@/services/authService'
import { getDefaultRouteForRole } from '@/utils/authRedirect'

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isBootstrapping, setIsBootstrapping] = useState(true)

  const applySession = useCallback((session) => {
    const nextToken = session?.token ?? null
    const nextUser = session?.user ?? null

    setToken(nextToken)
    setUser(nextUser)

    if (nextToken) {
      persistSession({ token: nextToken, user: nextUser })
    }
  }, [])

  const resetSession = useCallback(() => {
    clearSession()
    setToken(null)
    setUser(null)
  }, [])

  useEffect(() => {
    let isMounted = true

    async function bootstrap() {
      const stored = readStoredSession()

      if (!stored.token) {
        if (isMounted) {
          setIsBootstrapping(false)
        }
        return
      }

      if (isMounted) {
        applySession(stored)
      }

      try {
        const currentUser = await fetchCurrentUser()
        if (isMounted && currentUser) {
          setUser(currentUser)
        }
      } catch {
        if (isMounted) {
          resetSession()
        }
      } finally {
        if (isMounted) {
          setIsBootstrapping(false)
        }
      }
    }

    bootstrap()

    return () => {
      isMounted = false
    }
  }, [applySession, resetSession])

 useEffect(() => {

   if (isBootstrapping) {
     return
   }

   if (token) {
     persistSession({ token, user })
   } else {
     clearSession()
   }

 }, [token, user, isBootstrapping])

  useEffect(() => subscribeUnauthorized(resetSession), [resetSession])

  const login = useCallback(
    async (credentials) => {
      const session = await loginRequest(credentials)
      applySession(session)
      return session
    },
    [applySession],
  )

  const register = useCallback(
    async (payload) => {
      const session = await registerRequest(payload)
      applySession(session)
      return session
    },
    [applySession],
  )

  const logout = useCallback(() => {
    logoutRequest()
    resetSession()
  }, [resetSession])

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isBootstrapping,
      role: user?.role ?? null,
      login,
      register,
      logout,
      userHasRole: (allowedRoles) => hasRole(user?.role, allowedRoles),
      getDefaultRoute: () => getDefaultRouteForRole(user?.role),
    }),
    [user, token, isBootstrapping, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
