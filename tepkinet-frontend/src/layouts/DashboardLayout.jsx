import { NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'
import AppHeader from '@/components/layout/AppHeader'
import { ROUTES } from '@/constants/routes'
import { ROLES } from '@/constants/roles'
import { useAuth } from '@/hooks/useAuth'

const sidebarConfig = {
  [ROLES.ADMIN]: [
    { to: ROUTES.ADMIN_DASHBOARD, label: 'Ana Sayfa', icon: '🏠' },
    { to: ROUTES.ADMIN_COMPLAINTS, label: 'Şikayet Yönetimi', icon: '📣' },
    { to: ROUTES.ADMIN_COMPANY_APPLICATIONS, label: 'Kurumsal Başvurular', icon: '📨' },
    { to: ROUTES.ADMIN_COMPANIES, label: 'Kurumsal Hesaplar', icon: '🏢' },
    { to: ROUTES.ADMIN_USERS, label: 'Tüm Kullanıcılar', icon: '👥' },
    { to: ROUTES.ADMIN_STATISTICS, label: 'İstatistikler', icon: '📊' },
    { to: ROUTES.ADMIN_PROFILE, label: 'Profilim', icon: '👤' },

  ],
  [ROLES.COMPANY]: [
    { to: ROUTES.COMPANY_DASHBOARD, label: 'Ana Sayfa', icon: '🏢' },
    { to: ROUTES.COMPANY_PROFILE, label: 'Profilim', icon: '👤' },
  ],

  [ROLES.USER]: [
    { to: ROUTES.USER_HOME, label: 'Ana Sayfa', icon: '🏠' },
    { to: ROUTES.MY_COMPLAINTS, label: 'Şikayetlerim', icon: '📝' },
    { to: ROUTES.CREATE_COMPLAINT, label: 'Şikayet Oluştur', icon: '➕' },
    { to: ROUTES.PROFILE, label: 'Profilim', icon: '👤' },
  ],
}

export default function DashboardLayout() {
  const { userHasRole } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const sidebarItems = userHasRole([ROLES.ADMIN])
    ? sidebarConfig[ROLES.ADMIN]
    : userHasRole([ROLES.COMPANY])
      ? sidebarConfig[ROLES.COMPANY]
      : sidebarConfig[ROLES.USER]

  const footerLabel = userHasRole([ROLES.ADMIN])
    ? 'Platform denetimi'
    : userHasRole([ROLES.COMPANY])
      ? 'Kurumsal araçlar'
      : 'Kullanıcı paneli'

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <AppHeader />
      <div className="lg:flex lg:min-h-[calc(100vh-64px)]">
        <div className="border-b bg-white p-3 dark:bg-slate-900 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg border px-4 py-2"
          >
            ☰ Menü
          </button>
        </div>
        <aside
          className={`
    mini-rail
    relative
    z-10
    border-r
    border-slate-200
    bg-white
    dark:border-slate-800
    dark:bg-slate-900
    lg:sticky
    lg:top-16
    lg:h-[calc(100vh-4rem)]
    lg:overflow-auto
    ${mobileMenuOpen ? 'block' : 'hidden'}
    lg:block
  `}
        >          <div className="flex h-full flex-col">
            <div className="flex items-center gap-3 px-3 py-4">
              <div className="h-8 w-8 rounded-md bg-brand-600 text-white grid place-items-center font-semibold">T</div>
              <div className=" pl-2 text-sm font-semibold text-slate-900 dark:text-white ">TepkiNet</div>
            </div>

            <nav className="mt-4 flex flex-col gap-1 px-1">
              {sidebarItems.map((item) => (
                <NavLink
                
                  key={item.to}
                  to={item.to}
                  end={
                    item.to === ROUTES.ADMIN_DASHBOARD ||
                    item.to === ROUTES.COMPANY_DASHBOARD ||
                    item.to === ROUTES.USER_HOME
                  }
                  onClick={() => setMobileMenuOpen(false)}
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
                  <span className="ml-2 truncate text-sm font-medium ">{item.label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto px-3 py-6 hidden lg:block text-xs text-slate-600 dark:text-slate-300">{footerLabel}</div>
          </div>

          <style>{`
            .mini-rail {
  width:72px;
  transition: width .18s ease;
  overflow:hidden;
}

.mini-rail:hover {
  width:240px;
}
  @media (max-width:1023px) {
  .mini-rail {
    width:100%;
    overflow:visible;
  }
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
