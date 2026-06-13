import { Link } from 'react-router-dom'
import PageHeader from '@/components/common/PageHeader'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'

export default function Unauthorized() {
  const { isAuthenticated, getDefaultRoute } = useAuth()

  return (
    <section className="mx-auto max-w-lg text-center">
      <PageHeader
        title="Erişim reddedildi"
        description="Oturum açmış durumdasınız ancak hesabınızın bu sayfayı görüntüleme yetkisi yok."
      />

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          to={isAuthenticated ? getDefaultRoute() : ROUTES.HOME}
          className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
        >
          {isAuthenticated ? 'Çalışma alanına git' : 'Ana sayfaya dön'}
        </Link>
        <Link
          to={ROUTES.HOME}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          Ana sayfa
        </Link>
      </div>
    </section>
  )
}
