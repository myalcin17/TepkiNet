import HomeHeroSlider from '@/components/home/HomeHeroSlider'
import AboutPlatform from '@/components/home/AboutPlatform'
import LatestComplaintsSection from '@/components/home/LatestComplaintsSection'
import QuickComplaintCta from '@/components/home/QuickComplaintCta'
import { useGuestHomeData } from '@/hooks/useGuestHomeData'

export default function GuestHomeLanding({ createComplaintTo, createComplaintLabel, createComplaintState, quickCtaSecondary, complaints, isLoading, error }) {
  const { topCompanies, stats } = useGuestHomeData()

  return (
    <div className="space-y-14">
      <HomeHeroSlider
        createComplaintTo={createComplaintTo}
        createComplaintLabel={createComplaintLabel}
        createComplaintState={createComplaintState}
        topCompanies={topCompanies}
        stats={stats}
      />

      <LatestComplaintsSection
        complaints={complaints}
        isLoading={isLoading}
        error={error}
      />

      <QuickComplaintCta
        createComplaintTo={createComplaintTo}
        createComplaintLabel={createComplaintLabel}
        createComplaintState={createComplaintState}
        secondaryTo={quickCtaSecondary.to}
        secondaryLabel={quickCtaSecondary.label}
      />

      <AboutPlatform />
    </div>
  )
}
