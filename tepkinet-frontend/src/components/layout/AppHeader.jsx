import { Link, useNavigate } from 'react-router-dom'
import ThemeToggle from '@/components/common/ThemeToggle'
import { APP_NAME } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import { getDefaultRouteForRole } from '@/utils/authRedirect'
import { getNavbarConfig } from '@/config/navbar'
import { useAuth } from '@/hooks/useAuth'
import { getDisplayName } from '@/utils/user'

export default function AppHeader() {
  const navigate = useNavigate()
  const { isAuthenticated, isBootstrapping, user, logout } = useAuth()
  const { guestActions, showLogout } = getNavbarConfig({ isAuthenticated })
  const logoDestination = isAuthenticated ? getDefaultRouteForRole(user?.role) : ROUTES.HOME

  function handleLogout() {
    logout()
    navigate(ROUTES.HOME, { replace: true })
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to={logoDestination} className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
          {APP_NAME}
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {isBootstrapping ? (
            <span className="px-3 py-2 text-sm text-slate-600 dark:text-slate-300" aria-hidden="true">
              …
            </span>
          ) : guestActions ? (
            <div className="flex items-center gap-2">
              <Link
                to={ROUTES.LOGIN}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                Giriş yap
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="rounded-md bg-brand-700 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-800"
              >
                Kayıt ol
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="max-w-[10rem] truncate text-sm text-slate-600 dark:text-slate-300">
                {getDisplayName(user)}
              </span>
              {showLogout ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Çıkış yap
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
