import type React from 'react'
import { cn } from '../cn'

type InputType = {
  variant: 'gray'
  label?: string
  error?: string
  icon?: React.ComponentType<{ className?:string }>
} & React.ComponentProps<'input'>
export default function Input({ variant, label, error, className, icon:Icon, ...rest }: InputType) {
  return (
    <div className='w-full flex flex-col'>
      {label ? <p className='mb-1 text-sm-body-desktop font-medium text-primary'>{label}</p> : null}
      <div className={cn(variantSelection(variant), className)} >
        { Icon && <Icon className='size-5 text-soft-gray'/> }
        <input {...rest} className='w-full py-2 focus:outline-none'/>
      </div>
      {error && <p className='text-sm-body-desktop text-red-400 font-medium'>{error}</p>}
    </div>
  )
}

function variantSelection(variant: string) {
  const defaults = 'w-full flex px-3 items-center gap-2 rounded-[6px] focus-within:border focus-within:shadow-[0px_0px_1px_3px_rgba(0,0,0,0.2)] transition-all'
  const variants: Record<string, string> = {
    gray: 'bg-gray-100'
  }
  return `${defaults} ${variants[variant]}`
}
