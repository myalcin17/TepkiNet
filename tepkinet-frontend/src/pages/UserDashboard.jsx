import Announcements from '@/components/home/dashboard/Announcements'
import MyRecentComplaints from '@/components/home/dashboard/MyRecentComplaints'
import PendingActions from '@/components/home/dashboard/PendingActions'
import WelcomeSection from '@/components/home/dashboard/WelcomeSection'
import PageHeader from '@/components/common/PageHeader'
import { useAuth } from '@/hooks/useAuth'
import { useMyComplaints } from '@/hooks/useMyComplaints'

export default function UserDashboard() {
  const { user } = useAuth()
  const {
    allComplaints,
    isLoading,
    error,
    reload,
  } = useMyComplaints()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ana Sayfa"
        description={
          user
            ? `${user.firstName || user.username || 'Merhaba'}, bugün ilgilenmeniz gereken başlıkları tek yerden yönetin.`
            : 'Bugün ilgilenmeniz gereken başlıkları tek yerden yönetin.'
        }
      />

      <WelcomeSection
  user={user}
  complaints={allComplaints}
/>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <PendingActions
            complaints={allComplaints}
            isLoading={isLoading}
            error={error}
            onRetry={reload}
          />
          <MyRecentComplaints
            complaints={allComplaints}
            isLoading={isLoading}
            error={error}
            onRetry={reload}
          />
        </div>

        <Announcements />
      </section>
    </div>
  )
}
