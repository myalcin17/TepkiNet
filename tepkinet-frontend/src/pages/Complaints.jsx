import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import ComplaintCard from '@/components/complaints/ComplaintCard'
import ComplaintsToolbar from '@/components/complaints/ComplaintsToolbar'
import Pagination from '@/components/common/Pagination'
import PageHeader from '@/components/common/PageHeader'
import {
  AsyncContent,
  ComplaintCardSkeleton,
  EmptyState,
  PageSection,
  ResponsiveGrid,
  SkeletonList,
} from '@/components/ui'
import { ROUTES } from '@/constants/routes'
import { useComplaintsList } from '@/hooks/useComplaintsList'

export default function Complaints() {
  const {
    complaints,
    isLoading,
    error,
    search,
    setSearch,
    status,
    setStatus,
    company,
    setCompany,
    sortBy,
    setSortBy,
    page,
    setPage,
    totalElements,
    totalPages,
    pageSize,
    companyOptions,
    
    reload,
  } = useComplaintsList()

  const { isAuthenticated } = useAuth()

  return (
    <section>
      <PageHeader
        title="Şikayetler"
        description="Gönderilen şikayetlere göz atın; durum veya şirkete göre filtreleyin ve platform genelindeki çözüm sürecini takip edin."
      />

      { !isAuthenticated ? (
        <p className="mt-2">
          <Link to={ROUTES.HOME} className="text-sm font-medium text-brand-700 hover:text-brand-800 dark:text-brand-100 dark:hover:text-white">← Ana menüye dön</Link>
        </p>
      ) : null }

      <ComplaintsToolbar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        company={company}
        onCompanyChange={setCompany}
        
        sortBy={sortBy}
        onSortChange={setSortBy}
        companyOptions={companyOptions}
        
      />

      <PageSection>
        <AsyncContent
          isLoading={isLoading}
          error={error}
          onRetry={reload}
          loading={
            <SkeletonList
              count={pageSize}
              SkeletonComponent={ComplaintCardSkeleton}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            />
          }
          isEmpty={complaints.length === 0}
          empty={
            <EmptyState
              icon="search"
              title="Eşleşen şikayet bulunamadı"
              description="Başka kayıtlar bulmak için arama terimlerinizi veya filtre kriterlerinizi değiştirmeyi deneyin."
            />
          }
        >
          <ResponsiveGrid columns={3}>
            {complaints.map((complaint) => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))}
          </ResponsiveGrid>

          <PageSection spacing="lg">
            <Pagination
              page={page}
              totalPages={totalPages}
              totalElements={totalElements}
              pageSize={pageSize}
              onPageChange={setPage}
            />
          </PageSection>
        </AsyncContent>
      </PageSection>

      <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-300">
        Bildirmek istediğiniz bir sorun mu var?{' '}
        <Link
          to={ROUTES.CREATE_COMPLAINT}
          className="font-medium text-brand-700 hover:text-brand-800 dark:text-brand-100 dark:hover:text-white"
        >
          Şikayet gönder
        </Link>
      </p>
    </section>
  )
}
