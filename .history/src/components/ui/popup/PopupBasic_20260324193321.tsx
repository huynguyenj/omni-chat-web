import type { PropsWithChildren } from 'react'
import { IoIosClose } from 'react-icons/io'
import { motion } from 'motion/react'
import { ScrollArea } from '../scrollbar/ScrollArea'
type PopupProps = PropsWithChildren & {
  title: string
  onClose: () => void
}

export default function PopupBasic({ onClose, title, children }: PopupProps) {
  return (
    <div className="min-h-screen min-w-screen absolute inset-0 backdrop-blur-none bg-black/50 flex items-center justify-center z-9999">
      <motion.div
        initial = {{ scale: 0, opacity: 0 }}
        animate = {{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="min-w-[35%] max-h-[85vh] bg-white px-5 py-5 rounded-xl relative">
        <ScrollArea className='h-[85vh]'>
          <p className="text-m-body-desktop font-bold text-primary">{title}</p>
          <div className="absolute top-4 right-4 cursor-pointer active:border active:border-gray-400 rounded-lg" onClick={onClose}>
            <IoIosClose className="text-xl-body-desktop"/>
          </div>
          <div>
            {children}
          </div>
        </ScrollArea>
      </motion.div>
    </div>
  )
}
