import { cn } from '../cn'

type LoadingVariant = 'default' | 'primary' | 'white' | 'danger'

type LoadingSpinnerProps = {
  variant?: LoadingVariant
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const variantStyles: Record<LoadingVariant, string> = {
  default: 'border-gray-300 border-t-gray-500',
  primary: 'border-gray-200 border-t-primary',
  white: 'border-white/30 border-t-white',
  danger: 'border-red-200 border-t-red-500'
}

const sizeStyles = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-3'
}

export default function LoadingSpinner({
  variant = 'default',
  size = 'md',
  className
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    />
  )
}