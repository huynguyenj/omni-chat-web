import type React from 'react'

type InputType = {
  variant: 'gray'
  label?: string
  placeHolder?: string
  ref?: React.Ref<HTMLInputElement>
  type: 'text' | 'number'| 'password'
  error?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
}
export default function Input({ variant, label, placeHolder, ref, type, error, ...rest }: InputType) {
  return (
    <div className='flex flex-col'>
      <p className='mb-1'>{label}</p>
      <input placeholder={placeHolder} type={type} ref={ref} {...rest} className={variantSelection(variant)} />
      {error && <p className='text-sm-body-desktop text-red-400'>{error}</p>}
    </div>
  )
}

function variantSelection(variant: string) {
  const defaults = 'w-full px-3 py-2 rounded-[6px]'
  const variants: Record<string, string> = {
    gray: 'bg-gray-100'
  }
  return `${defaults} ${variants[variant]}`
}
