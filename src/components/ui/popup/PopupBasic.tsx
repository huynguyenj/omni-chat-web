import type { PropsWithChildren } from 'react'
import { IoIosClose } from 'react-icons/io'
import { motion } from 'motion/react'
type PopupProps = PropsWithChildren & {
  title: string
  onClose: () => void
}

export default function PopupBasic({ onClose, title, children }: PopupProps) {
  return (
    <div className="minn-h-screen min-w-screen absolute inset-0 backdrop-blur-none bg-black/50 flex items-center justify-center">
      <motion.div
        initial = {{ scale: 0, opacity: 0 }}
        animate = {{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="min-w-[30%] min-h-[45%] bg-white px-5 py-5 rounded-xl relative">
        <p className="text-sm-body-desktop font-bold text-primary">{title}</p>
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
