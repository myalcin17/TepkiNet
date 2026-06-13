import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import AboutPlatform from '@/components/home/AboutPlatform'
import GuestHomeLanding from '@/components/home/GuestHomeLanding'
import LatestComplaintsSection from '@/components/home/LatestComplaintsSection'
import QuickComplaintCta from '@/components/home/QuickComplaintCta'
import { ROLES } from '@/constants/roles'
import { ROUTES } from '@/constants/routes'
import { useLatestComplaints } from '@/hooks/useLatestComplaints'
import { useAuth } from '@/hooks/useAuth'

export default function Home() {
  const { isAuthenticated, userHasRole } = useAuth()
  const { complaints, isLoading, error } = useLatestComplaints()

  const isAdmin = isAuthenticated && userHasRole([ROLES.ADMIN])
  const canCreateComplaint = isAuthenticated && userHasRole([ROLES.USER])

  const createComplaintTo = useMemo(() => {
    if (canCreateComplaint) {
      return ROUTES.CREATE_COMPLAINT
    }

    if (isAdmin) {
      return ROUTES.ADMIN_DASHBOARD
    }

    return ROUTES.LOGIN
  }, [canCreateComplaint, isAdmin])

  const createComplaintLabel = canCreateComplaint
    ? 'Şikayet gönder'
    : isAdmin
      ? 'Yönetici paneli'
      : 'Göndermek için giriş yap'

  const location = useLocation()

  const createComplaintState = useMemo(() => {
    if (canCreateComplaint || isAdmin) {
      return undefined
    }

    return {
      from: { pathname: ROUTES.CREATE_COMPLAINT },
      returnTo: location,
    }
  }, [canCreateComplaint, isAdmin, location])

  const quickCtaSecondary = useMemo(() => {
    if (canCreateComplaint) {
      return {
        to: ROUTES.MY_COMPLAINTS,
        label: 'Şikayetlerim',
      }
    }

    if (isAdmin) {
      return {
        to: ROUTES.ADMIN_DASHBOARD,
        label: 'Yönetici paneli',
      }
    }

    if (isAuthenticated) {
      return {
        to: ROUTES.HOME,
        label: 'Platformu keşfet',
      }
    }

    return {
      to: ROUTES.REGISTER,
      label: 'Hesap oluştur',
    }
  }, [canCreateComplaint, isAdmin, isAuthenticated])

  if (!isAuthenticated) {
    return (
      <GuestHomeLanding
        createComplaintTo={createComplaintTo}
        createComplaintLabel={createComplaintLabel}
        createComplaintState={createComplaintState}
        quickCtaSecondary={quickCtaSecondary}
        complaints={complaints}
        isLoading={isLoading}
        error={error}
      />
    )
  }

  return (
    <div>
      <HomeHero
        createComplaintTo={createComplaintTo}
        createComplaintLabel={createComplaintLabel}
        createComplaintState={createComplaintState}
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
