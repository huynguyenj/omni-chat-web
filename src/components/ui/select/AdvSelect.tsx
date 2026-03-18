import type React from 'react'
import { Select as SelectPrimitive } from 'radix-ui'
import { cn } from '../cn'
import { IoIosArrowDown } from 'react-icons/io'
import { IoIosArrowUp } from 'react-icons/io'
import { IoCheckmarkOutline } from 'react-icons/io5'

function AdvSelect({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot='select'{...props}/>
}

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <SelectPrimitive.Group
      data-slot='select-group'
      className={cn('', className)}
      {...props}
    />
  )
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot='select-value' {...props}/>
}

function SelectTrigger({
  className,
  size='default',
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & { size?: 'sm' | 'default' }) {
  return (
    <SelectPrimitive.Trigger
      data-slot='select-trigger'
      data-size={size}
      className={cn('bg-gray-100 w-full flex justify-between items-center gap-2 rounded-md  px-3 py-2 text-sm-body-desktop outline-none focus-visible:border-ring focus-visible:ring-ring/50', className)}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <IoIosArrowDown className="text-soft-gray size-4 pointer-events-none opacity-50"/>
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn('z-10 flex cursor-default items-center justify-center py-1', className)}
      {...props}
    >
      <IoIosArrowUp className='size-4'/>
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn('z-10 flex cursor-default items-center justify-center py-1', className)}
      {...props}
    >
      <IoIosArrowDown className='size-4'/>
    </SelectPrimitive.ScrollDownButton>
  )
}

function SelectContent({
  className,
  children,
  position='popper',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot='select-content'
        className={cn('bg-white mt-1 text-[oklch(0.145 0 0)]  overflow-y-auto rounded-md overflow-x-hidden shadow-[0px_2px_5px_2px_rgba(0,0,0,0.1)]', className)}
        position={position}
        {...props}
      >
        <SelectScrollUpButton/>
        <SelectPrimitive.Viewport
          data-position={position}
          className={cn('p-1', position === 'popper' &&
              'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1')}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton/>

      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot='select-label'
      className={cn('px-2 py-1.5 text-sm-body-desktop', className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn('focus:bg-[#e9ebef] flex w-full items-center rounded-md py-1.5 pr-8 pl-2 outline-hidden select-none',
        className
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center rounded-sm justify-center">
        <SelectPrimitive.ItemIndicator>
          <IoCheckmarkOutline className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn('bg-[#e9ebef] pointer-events-none -mx-1 my-1 h-px', className)}
      {...props}
    />
  )
}

export {
  AdvSelect,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue
}
