import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../cn'

const cardVariants = cva(
  'border border-gray-300 rounded-[20px]',
  {
    variants: {
      variant: {
        default: 'bg-white',
        primary: 'border-l-7 border-l-secondary hover:shadow-[3px_3px_9px_1px_rgba(0,0,0,0.1))]',
        secondary: 'border-l-7 border-l-green-accent hover:shadow-[3px_3px_9px_1px_rgba(0,0,0,0.1))]',
        warn: 'border-l-7 border-l-[#FF9800] hover:shadow-[3px_3px_9px_1px_rgba(0,0,0,0.1))]',
        black: 'border-l-7 border-l-black hover:shadow-[3px_3px_9px_1px_rgba(0,0,0,0.1))]'
      },
      size: {
        default: 'py-3 px-4',
        sm: 'py-4 px-5',
        lg: 'py-6 px-8'
      },
      default: {
        variant: 'default',
        size: 'default'
      }
    }
  }
)

export default function Card({
  className,
  variant='default',
  size='default',
  ...prop }: React.ComponentProps<'div'> & VariantProps<typeof cardVariants>) {
  return (
    <div
      data-slot='card'
      className={cn(cardVariants({ variant, size, className }))} {...prop}></div>
  )
}

