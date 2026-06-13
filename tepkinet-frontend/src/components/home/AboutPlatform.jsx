import { ABOUT_PLATFORM_ITEMS } from '@/constants/home'

const icons = [
  (
    <svg
      key="transparent"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"
      />
    </svg>
  ),
  (
    <svg
      key="community"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87M16 7a4 4 0 11-8 0 4 4 0 018 0zM21 8a3 3 0 11-6 0 3 3 0 016 0zM9 8a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  (
    <svg
      key="trust"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3l7 4v5c0 4.418-3.134 8.168-7 9-3.866-.832-7-4.582-7-9V7l7-4z"
      />
    </svg>
  ),
]

export default function AboutPlatform() {
  return (
    <section aria-labelledby="about-platform-heading" className="mt-14 pb-4 sm:mt-16">
      <div className="text-center">
        <h2
          id="about-platform-heading"
          className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100"
        >
          Platform hakkında
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          TepkiNet, müşterileri ve şirketleri profesyonel ve hesap verebilir bir şikayet süreciyle
          buluşturur — gösterişsiz ve belirsiz bilet sistemleri olmadan.
        </p>
      </div>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ABOUT_PLATFORM_ITEMS.map((item, index) => (
          <li
            key={item.title}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="inline-flex rounded-lg bg-brand-50 p-2.5 text-brand-700 dark:bg-slate-800 dark:text-brand-100">
              {icons[index]}
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {item.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
