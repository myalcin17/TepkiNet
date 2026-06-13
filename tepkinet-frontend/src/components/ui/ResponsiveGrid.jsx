import { cn } from '@/utils/cn'

const columnStyles = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5',
}

const gapStyles = {
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
}

export default function ResponsiveGrid({
  columns = 3,
  gap = 'md',
  className = '',
  children,
  ...props
}) {
  return (
    <div
      className={cn('grid', columnStyles[columns] ?? columnStyles[3], gapStyles[gap], className)}
      {...props}
    >
      {children}
    </div>
  )
}
