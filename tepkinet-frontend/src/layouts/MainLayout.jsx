import { Outlet } from 'react-router-dom'
import AppFooter from '@/components/layout/AppFooter'
import AppHeader from '@/components/layout/AppHeader'

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  )
}
