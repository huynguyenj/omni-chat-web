import type { PropsWithChildren } from 'react'
import { IoIosClose } from 'react-icons/io'
import { motion } from 'motion/react'
type PopupProps = PropsWithChildren & {
  title: string
  onClose: () => void
  size?: 'md' | 'sm' | 'lg'
}

const sizeVariant = {
  md: 'max-w-[50%]',
  sm: 'max-w-[40%]',
  lg: 'max-w-[70%]'
}

export default function PopupBasic({ onClose, title, children, size = 'sm' }: PopupProps) {
  return (
    <div className="min-h-screen max-w-screen fixed inset-0 backdrop-blur-none bg-black/50 flex items-center justify-center z-60">
      <motion.div
        initial = {{ scale: 0, opacity: 0 }}
        animate = {{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className={`min-w-[35%] max-h-[90vh] ${sizeVariant[size]} bg-white px-5 py-5 rounded-xl relative overflow-y-auto`}>
        <p className="text-xl-body-desktop font-medium text-primary">{title}</p>
        <div className="absolute top-4 right-4 cursor-pointer active:border active:border-gray-400 rounded-lg" onClick={onClose}>
          <IoIosClose className="text-xl-body-desktop"/>
        </div>
        <div>
          {children}
        </div>
      </motion.div>
    </div>
  )
}
