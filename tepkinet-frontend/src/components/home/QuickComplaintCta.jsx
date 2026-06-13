import { Link } from 'react-router-dom'

const primaryButtonClass =
  'inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-brand-800 transition-colors hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-white/40'

const secondaryButtonClass =
  'inline-flex items-center justify-center rounded-lg border border-white/30 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30'

export default function QuickComplaintCta({
  createComplaintTo,
  createComplaintLabel,
  createComplaintState,
  secondaryTo,
  secondaryLabel,
}) {
  return (
    <section
      aria-labelledby="quick-complaint-heading"
      className="mt-14 sm:mt-16"
    >
      <div className="rounded-2xl bg-brand-700 px-6 py-10 sm:px-10 sm:py-12 dark:bg-brand-800">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="quick-complaint-heading" className="text-2xl font-semibold text-white sm:text-3xl">
            Bir sorun mu bildirmek istiyorsunuz?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-100 sm:text-base">
            Deneyiminizi belgeleyin, doğru kategoriyi seçin ve şirketin yapılandırılmış destek
            süreci üzerinden yanıt vermesini sağlayın.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to={createComplaintTo} state={createComplaintState} className={primaryButtonClass}>
              {createComplaintLabel}
            </Link>
            <Link to={secondaryTo} className={secondaryButtonClass}>
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
