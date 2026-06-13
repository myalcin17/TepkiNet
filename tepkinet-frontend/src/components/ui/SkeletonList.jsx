export default function SkeletonList({
  count = 3,
  SkeletonComponent,
  className = '',
  itemClassName = '',
}) {
  if (!SkeletonComponent) {
    return null
  }

  return (
    <div className={className} aria-busy="true" aria-live="polite">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={itemClassName}>
          <SkeletonComponent />
        </div>
      ))}
    </div>
  )
}
