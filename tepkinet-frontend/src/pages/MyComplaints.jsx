import { Link } from 'react-router-dom'
import ComplaintCard from '@/components/complaints/ComplaintCard'
import ComplaintStatusOverview from '@/components/complaints/ComplaintStatusOverview'
import MyComplaintsToolbar from '@/components/complaints/MyComplaintsToolbar'
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
import { useMyComplaints } from '@/hooks/useMyComplaints'

export default function MyComplaints() {
  const {
    complaints,
    isLoading,
    error,
    search,
    setSearch,
    status,
    setStatus,
    sortBy,
    setSortBy,
    page,
    setPage,
    totalElements,
    totalPages,
    pageSize,
    statusCounts,
    hasAnyComplaints,
    hasFilteredResults,
    reload,
  } = useMyComplaints()

  const showToolbar = hasAnyComplaints || isLoading
  const isFilteredEmpty = hasAnyComplaints && !hasFilteredResults && !isLoading && !error

  return (
    <section>
      <div className="mb-4">
      <Link
        to={ROUTES.USER_HOME}
        className="inline-flex items-center gap-2 text-sm font-medium text-brand-700 transition-colors hover:text-brand-800 dark:text-brand-100 dark:hover:text-white"
      >
        ← Ana Sayfaya Dön
      </Link>
    </div>
      <PageHeader
        title="Şikayetlerim"
        description="Gönderdiğiniz şikayetlerin durumunu takip edin, ilerleme aşamasına göre filtreleyin ve ayrıntılar için kayıtları açın."
      />

      <ComplaintStatusOverview
        counts={statusCounts}
        activeStatus={status}
        onStatusChange={setStatus}
        isLoading={isLoading}
        isUserPanel
      />

      {showToolbar ? (
        <PageSection>
          <MyComplaintsToolbar
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </PageSection>
      ) : null}

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
          isEmpty={!hasAnyComplaints && !error}
          empty={
            <EmptyState
              icon="document"
              title="Henüz şikayet yok"
              description="Bir şikayet gönderdiğinizde, şirket inceleyip yanıtladıkça canlı durum güncellemeleriyle burada görünecektir."
            >
              <Link
                to={ROUTES.CREATE_COMPLAINT}
                className="inline-flex items-center justify-center rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-800 dark:bg-brand-600 dark:hover:bg-brand-500"
              >
                İlk şikayetinizi gönderin
              </Link>
              <Link
                to={ROUTES.COMPLAINTS}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Herkese açık şikayetlere göz atın
              </Link>
            </EmptyState>
          }
        >
          {isFilteredEmpty ? (
            <EmptyState
              icon="search"
              title="Eşleşen şikayet bulunamadı"
              description="Durum filtresini temizlemeyi veya arama terimlerinizi değiştirmeyi deneyin."
            >
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setStatus('')
                }}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Filtreleri temizle
              </button>
            </EmptyState>
          ) : (
            <>
              <ResponsiveGrid columns={3}>
                {complaints.map((complaint) => (
                  <ComplaintCard key={complaint.id} complaint={complaint} variant="personal" />
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
            </>
          )}
        </AsyncContent>
      </PageSection>

      {hasAnyComplaints && !isLoading ? (
        <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-300">
          Başka bir sorun mu bildirmek istiyorsunuz?{' '}
          <Link
            to={ROUTES.CREATE_COMPLAINT}
            className="font-medium text-brand-700 hover:text-brand-800 dark:text-brand-100 dark:hover:text-white"
          >
            Yeni şikayet gönder
          </Link>
        </p>
      ) : null}
    </section>
  )
}
