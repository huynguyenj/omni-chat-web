import { cn } from '@/components/ui/cn'
import { cva, type VariantProps } from 'class-variance-authority'
import type React from 'react'

const taskAnalysisBoxVariant = cva(
  'py-4 px-4 rounded-xl flex items-center',
  {
    variants: {
      variant: {
        default: 'bg-[#DBEAFE] text-secondary',
        success: 'bg-[#DBFCE7] text-green-accent',
        purple: 'bg-[#F3E8FF] text-[#9810FA]',
        yellow: 'bg-[#FEF9C2] text-[#D4900F]'
      },
      default: {
        variant: 'default'
      }
    }
  }
)

export default function TaskAnalysisBox({
  className,
  variant='default',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof taskAnalysisBoxVariant>) {
  return (
    <div
      data-slot='analysis-icon-box'
      className={cn(taskAnalysisBoxVariant({ variant, className }))}
      {...props}>
    </div>
  )
}
