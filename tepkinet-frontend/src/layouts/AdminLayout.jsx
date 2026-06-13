import { NavLink, Outlet } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

const navigation = [
  { to: ROUTES.ADMIN_DASHBOARD, label: 'Ana Sayfa', icon: '🏠' },
  { to: ROUTES.COMPLAINTS, label: 'Tüm Şikayetler', icon: '📣' },
  { to: ROUTES.ADMIN_COMPANY_APPLICATIONS, label: 'Kurumsal Başvurular', icon: '📨' },
  { to: ROUTES.ADMIN_COMPANIES, label: 'Kurumsal Hesaplar', icon: '🏢' },
]

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="lg:flex lg:min-h-screen">
        <aside className="mini-rail relative z-10 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:overflow-auto">
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-3 px-3 py-4">
              <div className="h-8 w-8 rounded-md bg-brand-600 text-white grid place-items-center font-semibold">Y</div>
              <div className="hidden pl-2 text-sm font-semibold text-slate-900 dark:text-white lg:block">Yönetici</div>
            </div>

            <nav className="mt-4 flex flex-col gap-1 px-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      'group flex items-center gap-3 overflow-hidden rounded-full px-3 py-3 text-sm transition-all',
                      'lg:px-4 lg:py-3',
                      isActive
                        ? 'bg-brand-600 text-white'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
                    ].join(' ')
                  }
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center text-lg">{item.icon}</span>
                  <span className="ml-2 hidden truncate text-sm font-medium lg:block">{item.label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto px-3 py-6">
              <div className="hidden lg:block text-xs text-slate-600 dark:text-slate-300">Platform denetimi</div>
            </div>
          </div>

          <style>{`
            .mini-rail { width:72px; transition: width .18s ease; overflow:hidden }
            .mini-rail:hover { width:240px; }
            @media (max-width: 1023px) { .mini-rail { width:72px; } }
          `}</style>
        </aside>

        <main className="flex-1 bg-slate-50 p-4 dark:bg-slate-950 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
