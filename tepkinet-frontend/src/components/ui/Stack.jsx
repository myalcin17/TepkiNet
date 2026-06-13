import { cn } from '@/utils/cn'

const gapStyles = {
  none: 'gap-0',
  xs: 'gap-2',
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
}

export default function Stack({
  as: Component = 'div',
  direction = 'column',
  gap = 'md',
  align,
  justify,
  wrap = false,
  className = '',
  children,
  ...props
}) {
  return (
    <Component
      className={cn(
        'flex',
        direction === 'row' ? 'flex-row' : 'flex-col',
        gapStyles[gap],
        wrap && 'flex-wrap',
        align === 'center' && 'items-center',
        align === 'start' && 'items-start',
        align === 'end' && 'items-end',
        align === 'stretch' && 'items-stretch',
        justify === 'between' && 'justify-between',
        justify === 'center' && 'justify-center',
        justify === 'end' && 'justify-end',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
