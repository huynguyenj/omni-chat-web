
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import { cn } from '../cn'
const buttonVariants = cva(
  'flex items-center justify-center gap-3 rounded-[10px] font-medium text-sm-body-desktop',
  {
    variants: {
      variant: {
        default: 'bg-secondary text-white hover:bg-secondary-hover',
        success: 'bg-green-accent text-white hover:bg-green-hover',
        outline: 'border bg-white text-secondary border-secondary hover:bg-blue/90 hover:text-black',
        basic: 'border bg-white text-black border-gray-300 hover:bg-gray-100',
        danger: 'bg-[#FF5B5B] text-white hover:bg-[#FF5B5B]/90'

      },
      size: {
        default: 'px-3 py-2',
        sm: 'px-4 py-2',
        lg: 'px-6 py-3'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)
export default function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean })
{
  const Comp = asChild ? Slot.Root : 'button'
  return (
    <Comp
      data-slot= 'button'
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}


