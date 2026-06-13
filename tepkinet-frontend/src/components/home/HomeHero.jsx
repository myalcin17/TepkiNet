import { Link } from 'react-router-dom'
import { APP_NAME } from '@/constants/app'
import { PLATFORM_SLOGAN } from '@/constants/home'
import { ROUTES } from '@/constants/routes'

const primaryButtonClass =
  'inline-flex items-center justify-center rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-500/40'

const secondaryButtonClass =
  'inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'

export default function HomeHero({ createComplaintTo, createComplaintLabel, createComplaintState }) {
  return (
    <section
      aria-labelledby="home-hero-heading"
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-50/80 via-white to-slate-50 dark:from-brand-800/10 dark:via-slate-900 dark:to-slate-950"
        aria-hidden="true"
      />

      <div className="relative px-6 py-12 sm:px-10 sm:py-16 lg:py-20">
        <p className="text-sm font-medium uppercase tracking-wider text-brand-700 dark:text-brand-100">
          Kurumsal şikayet ve destek platformu
        </p>

        <h1
          id="home-hero-heading"
          className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl"
        >
          {APP_NAME}&apos;e hoş geldiniz
        </h1>

        <p className="mt-4 max-w-xl text-lg text-slate-600 dark:text-slate-300">{PLATFORM_SLOGAN}</p>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Sorunları bildirin, şeffaf durum güncellemelerini takip edin ve adil çözümlere ulaşmak için
          şirketlerle birlikte çalışın — müşteriler, destek ekipleri ve hesap verebilir işletmeler için tasarlandı.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link to={createComplaintTo} state={createComplaintState} className={primaryButtonClass}>
            {createComplaintLabel}
          </Link>
          <Link to={ROUTES.COMPLAINTS} className={secondaryButtonClass}>
            Tüm şikayetlere göz at
          </Link>
        </div>
      </div>
    </section>
  )
}
