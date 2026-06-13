import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { COMPLAINT_STATUS } from '@/constants/complaintStatus'
import kart1 from '../../assets/kart1.png'
import kart2 from '../../assets/kart2.png'

const SLIDE_DURATION_MS = 5000
const PROGRESS_UPDATE_MS = 50

function AnimatedStat({ value, label }) {
  const [current, setCurrent] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    let start = null
    function step(timestamp) {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / 700, 1)
      setCurrent(Math.floor(progress * value))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step)
      }
    }

    rafRef.current = requestAnimationFrame(step)

    return () => cancelAnimationFrame(rafRef.current)
  }, [value])

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 shadow-lg dark:border-orange-200/60 dark:bg-white/10 dark:text-white dark:shadow-orange-500/10">
      <p className="text-4xl font-semibold tracking-tight text-orange-600 dark:text-orange-100">{current}</p>
      <p className="mt-2 text-sm uppercase tracking-[0.24em] text-slate-600 dark:text-orange-200/90">{label}</p>
    </div>
  )
}

export default function HomeHeroSlider({ createComplaintTo, createComplaintLabel, createComplaintState, topCompanies, stats, statsLoading }) {
  const slides = useMemo(
    () => [
      {
        id: 'platform-stats',
        type: 'stats',
        title: 'Toplam çözüm, kullanıcı ve kayıtlı şirket sayısı',
        description: 'TepkiNet üzerinde çözüme ulaşan şikayetler, kayıtlı kullanıcılar ve platforma kayıtlı şirketler hakkında net bir görünüm.',
        theme: 'dark',
      },
      {
        id: 'visual-1',
        type: 'visual',
        title: 'Müşteri sesini kurumsal güce çevirin.',
        description:
          'TepkiNet ile şikayet süreçleri daha şeffaf, hızlı ve profesyonel hale geliyor. Sorun bildirimlerini takip edin, çözüme odaklanın.',
        theme: 'orange',
        imageLabel: 'Görsel 1',
        imageSrc: kart1,
      },
      {
        id: 'visual-2',
        type: 'visual',
        title: 'Hızlı çözüm, güçlü geri bildirim kültürü.',
        description:
          'Şirketler için sonuç odaklı raporlama, müşteriler için güvenli şikayet yönetimi. Platformumuz ile her adım kontrollü ve görünür.',
        theme: 'amber',
        imageLabel: 'Görsel 2',
        imageSrc: kart2,
      },
      {
        id: 'top-companies',
        type: 'companies',
        title: 'Son 1 Yılda En Çok Çözüm Üreten Şirketler',
        description:
          'Çözüme odaklı performanslarıyla öne çıkan şirketler. Gerçek çözüm sayılarıyla sıralanmıştır.',
        theme: 'navy',
      },
    ],
    [],
  )

  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef(null)
  const startRef = useRef(Date.now())

  useEffect(() => {
    setProgress(0)
    startRef.current = Date.now()

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current
      const ratio = Math.min(elapsed / SLIDE_DURATION_MS, 1)
      setProgress(ratio * 100)
      if (ratio >= 1) {
        setActiveIndex((current) => (current + 1) % slides.length)
      }
    }, PROGRESS_UPDATE_MS)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [activeIndex, slides.length])

  const handleNavigation = (direction) => {
    setActiveIndex((current) => {
      const nextIndex = direction === 'next' ? current + 1 : current - 1
      return (nextIndex + slides.length) % slides.length
    })
    setProgress(0)
    startRef.current = Date.now()
  }

  const activeSlide = slides[activeIndex]

  return (
    <section aria-labelledby="guest-home-hero-heading"
    className="
      relative overflow-hidden rounded-[2rem]
      border border-slate-200
      bg-slate-50
      pb-8
      shadow-xl
      dark:bg-slate-950
      dark:border-slate-800
      dark:shadow-slate-900/20
      lg:min-h-[560px]
    ">

      <div className="h-1 bg-slate-800">
        <div className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400 transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="relative px-6 py-10 sm:px-10 sm:py-12 lg:py-14">
        <div className="grid gap-10 lg:items-stretch lg:min-h-[460px] lg:grid-cols-1">
          {activeSlide.type === 'visual' ? (
            <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 shadow-2xl shadow-slate-950/30">
  <img
    src={activeSlide.imageSrc}
    alt={activeSlide.imageLabel}
    className="w-full h-auto"
  />
</div>
          ) : (
            <>
              <div className="space-y-6">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-300">
                  Şimdi keşfedin
                </p>
                <h2
                  id="guest-home-hero-heading"
                  className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl"
                >
                  {activeSlide.title}
                </h2>
                <p className="max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                  {activeSlide.description}
                </p>

                {activeSlide.type === 'companies' ? (
                  <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/40">
                    {topCompanies.length > 0 ? (
                      <ol className="space-y-3">
                        {topCompanies.map((company, index) => (
                          <li key={company.name} className="flex items-center justify-between rounded-2xl bg-slate-800/80 px-4 py-3 text-sm text-slate-100">
                            <span className="font-medium text-orange-100">{index + 1}. {company.name}</span>
                            <span className="text-slate-400">{company.count} çözüm</span>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/80 p-6 text-sm text-slate-400">
                        Şirket performansı yükleniyor...
                      </div>
                    )}
                  </div>
                ) : activeSlide.type === 'stats' ? (
                  <div className="grid gap-4 sm:grid-cols-3">
                    <AnimatedStat value={stats.totalResolved} label="Toplam Çözülen" />
                    <AnimatedStat value={stats.users} label="Toplam Kullanıcı" />
                    <AnimatedStat value={stats.companies} label="Kayıtlı Şirket" />
                  </div>
                ) : null}

                {activeSlide.type === 'stats' ? (
                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Link
                      to={createComplaintTo}
                      state={createComplaintState}
                      className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-orange-400"
                    >
                      {createComplaintLabel}
                    </Link>
                    <Link
                      to={ROUTES.COMPLAINTS}
                      className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-slate-900"
                    >
                      Tüm Şikayetleri Gör
                    </Link>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-3 flex items-center justify-between px-6 sm:px-10 z-20">
        <button
          type="button"
          aria-label="Önceki slayt"
          onClick={() => handleNavigation('prev')}
          className="
          inline-flex h-12 w-12 items-center justify-center rounded-full
          border border-slate-300
          bg-white
          text-slate-900
          transition hover:bg-slate-100

          dark:border-white/10
          dark:bg-white/5
          dark:text-white
          dark:hover:bg-white/10
          "
        >
          ←
        </button>
        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Slayt ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 w-8 rounded-full transition ${
                activeIndex === index
                  ? 'bg-orange-400'
                  : 'bg-slate-300 dark:bg-white/30'
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Sonraki slayt"
          onClick={() => handleNavigation('next')}
          className="
          inline-flex h-12 w-12 items-center justify-center rounded-full
          border border-slate-300
          bg-white
          text-slate-900
          transition hover:bg-slate-100

          dark:border-white/10
          dark:bg-white/5
          dark:text-white
          dark:hover:bg-white/10
          "
        >
          →
        </button>
      </div>
    </section>
  )
}
