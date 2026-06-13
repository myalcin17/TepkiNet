import { Link, Outlet } from 'react-router-dom'
import ThemeToggle from '@/components/common/ThemeToggle'
import { APP_NAME } from '@/constants/app'
import { ROUTES } from '@/constants/routes'

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link
            to={ROUTES.HOME}
            className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white"
          >
            {APP_NAME}
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
