import { Link } from 'react-router-dom'
import { APP_NAME } from '@/constants/app'
import { ROUTES } from '@/constants/routes'

export default function AppFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
            © {year} {APP_NAME}
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Kurumsal şikayet ve destek yönetimi.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm" aria-label="Alt bilgi">
          <Link
            to={ROUTES.HOME}
            className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            Ana sayfa
          </Link>
          <Link
            to={ROUTES.LOGIN}
            className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            Giriş yap
          </Link>
        </nav>
      </div>
    </footer>
  )
}
