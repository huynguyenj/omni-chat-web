import React from 'react'
import { Checkbox as CheckboxPrimitive } from 'radix-ui'
import { cn } from '../cn'
import { FaCheck } from 'react-icons/fa6'

export default function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot='checkbox'
      className={cn('peer border-2 border-[#DFDFE1] bg-[#F3F3F5] data-[state=checked]:bg-primary data-[state=checked]:text-white data-[state=checked]:border-primary focus-visible:ring-[3px] flex items-center justify-center size-4.5 shadow-xs transition-colors rounded-sm outline-none disabled:cursor-not-allowed disabled:opacity-50', className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot='checkbox-indicator'
        className='flex items-center justify-center transition-none'
      >
        <FaCheck className='size-3.5'/>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}
