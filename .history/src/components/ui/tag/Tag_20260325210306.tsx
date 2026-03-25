import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../cn'

const tagVariants = cva(
  'text-sm-desktop rounded-[10px] flex items-center justify-center font-medium',
  {
    variants: {
      variant: {
        default: 'bg-white border border-black',
        primary: 'bg-secondary text-white',
        success: 'bg-green-accent text-white',
        danger: 'bg-[#FB2C36] text-white',
        warn: 'bg-[#FF9800] text-white',
        gray: 'bg-gray-400 text-white'
      },
      size: {
        default:'py-1 px-3',
        sm: 'py-3 px-5',
        lg: 'py-5 px-8'
      },
      default: {
        variant: 'default',
        size: 'default'
      }
    }
  }
)

export default function Tag({
  className,
  variant='default',
  size='default',
  ...prop
}: React.ComponentProps<'div'> & VariantProps<typeof tagVariants>) {
  return (
    <div
      data-slot='tag'
      className={cn(tagVariants({ variant, size, className }))}
      {...prop}
    ></div>
  )
}
