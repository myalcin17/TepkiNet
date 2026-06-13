import { MetricCardsSkeleton } from '@/components/ui'

export default function CompanyDashboardMetrics({
  openCount,
  inProgressCount,
  resolvedCount,
  totalCount,
  isLoading,
}) {
  const items = [
    {
      label: 'Açık vakalar',
      value: openCount,
      description: 'İlk incelemeyi bekliyor',
    },
    {
      label: 'Devam eden',
      value: inProgressCount,
      description: 'İnceleniyor veya yanıtlandı',
    },
    {
      label: 'Çözüldü',
      value: resolvedCount,
      description: 'Müşteri tarafından kapatıldı',
    },
  ]

  if (isLoading) {
    return <MetricCardsSkeleton count={3} />
  }

  return (
    <section aria-label="Vaka iş yükü özeti" className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-300">
            {item.label}
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
            {item.value}
          </p>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{item.description}</p>
        </div>
      ))}

      <p className="sr-only">
        Şirketinize atanmış toplam {totalCount} şikayet
      </p>
    </section>
  )
}
