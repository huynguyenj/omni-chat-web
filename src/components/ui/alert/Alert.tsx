import { cva, type VariantProps } from 'class-variance-authority'
import React from 'react'
import { cn } from '../cn'

const alertVariant = cva(
  'rounded-2xl outline-none  border',
  {
    variants: {
      variant: {
        default: 'bg-white border border-black',
        info: 'bg-[#EFF6FF] border-[#BEDBFF] text-primary',
        danger: 'bg-[#FFF7ED] border-[#FFD8AB] text-[#CA3500]',
        success: 'bg-[#F0FDF4] border-[#B9F8CF] text-[#2ECC71]'
      },
      size: {
        default: 'py-3 px-4',
        sm: 'py-2 px-3',
        lg: 'py-5 px-10'
      },
      default: {
        variant: 'default',
        size: 'default'
      }
    }
  }
)

export default function Alert({
  className,
  variant='default',
  size='default',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariant>) {
  return (
    <div
      data-slot='alert'
      className={cn(alertVariant({ variant, size, className }))}
      {...props}
    ></div>
  )
}
