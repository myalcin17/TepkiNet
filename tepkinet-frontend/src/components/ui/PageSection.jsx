import { cn } from '@/utils/cn'

export default function PageSection({
  as: Component = 'section',
  spacing = 'default',
  className = '',
  children,
  ...props
}) {
  const spacingStyles = {
    none: '',
    sm: 'mt-4',
    default: 'mt-6',
    lg: 'mt-8',
  }

  return (
    <Component className={cn(spacingStyles[spacing], className)} {...props}>
      {children}
    </Component>
  )
}
