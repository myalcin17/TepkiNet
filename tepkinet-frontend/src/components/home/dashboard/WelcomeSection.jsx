import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

export default function WelcomeSection({ user, complaints = [] }) {
  const totalComplaints = complaints.length

const activeComplaints = complaints.filter(
  (c) =>
    c.status === 'PENDING' ||
    c.status === 'OPEN' ||
    c.status === 'IN_REVIEW' ||
    c.status === 'ANSWERED'
).length

const resolvedComplaints = complaints.filter(
  (c) => c.status === 'RESOLVED'
).length
  const name = user?.firstName || user?.username || 'Merhaba'

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-wide text-brand-700 dark:text-brand-100">
            Kişisel kontrol merkezi
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white sm:text-3xl">
            Hoş geldiniz, {name}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Şikayet süreçlerinizi tek ekrandan takip edin. Açık kayıtları yönetin,
  şirket yanıtlarını kontrol edin ve yeni bildirimlerinizi hızlıca oluşturun.
          </p>
<div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
    <p className="text-xs text-slate-500">Toplam Şikayet</p>
    <p className="text-lg font-semibold">{totalComplaints}</p>
  </div>

  <div className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 dark:border-orange-700 dark:bg-orange-950/20">
    <p className="text-xs text-slate-500">Aktif Kayıt</p>
    <p className="text-lg font-semibold">{activeComplaints}</p>
  </div>

  <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 dark:border-green-700 dark:bg-green-950/20">
    <p className="text-xs text-slate-500">Çözülen</p>
    <p className="text-lg font-semibold">{resolvedComplaints}</p>
  </div>
</div>

        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <Link
            to={ROUTES.CREATE_COMPLAINT}
            className="inline-flex items-center justify-center rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-800 dark:bg-brand-600 dark:hover:bg-brand-500"
          >
            Yeni şikayet oluştur
          </Link>
          <Link
            to={ROUTES.MY_COMPLAINTS}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Şikayetlerime git
          </Link>
        </div>
      </div>
    </section>
  )
}
