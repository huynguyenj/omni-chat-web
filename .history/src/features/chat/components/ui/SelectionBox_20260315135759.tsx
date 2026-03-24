import { cn } from '@/components/ui/cn'
import type React from 'react'

type SelectionBoxType = {
   isChosen?: boolean
} & React.ComponentProps<'div'>

export default function SelectionBox({ className, isChosen, ...props }: SelectionBoxType) {
  return (
    <div className={cn(`flex justify-center items-center py-3 px-8 border-2 border-border-primary rounded-xl ${isChosen && 'border-secondary font-bold text-secondary bg-[#EFF6FF]'}`, className)} {...props}>
    </div>
  )
}
