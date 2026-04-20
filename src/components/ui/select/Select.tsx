import { cva, type VariantProps } from 'class-variance-authority'
import type React from 'react'
import { cn } from '../cn'

const selectVariants = cva(
  'px-4 py-3 rounded-[10px] w-full',
  {
    variants: {
      variant: {
        default: 'border-2 border-primary'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

export default function Select({
  className,
  variant='default',
  ...prop
}: React.ComponentProps<'select'> & VariantProps<typeof selectVariants>) {
  return (
    <select
      data-slot='select'
      className={cn(selectVariants({ variant, className }))} {...prop}></select>
  )
}
