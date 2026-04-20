import { useState } from 'react'
import Button from '@/components/ui/button/Button'
import { MdHistory } from 'react-icons/md'
import { AnimatePresence } from 'motion/react'
import PopupBasic from '@/components/ui/popup/PopupBasic'
import CustomerOrder from '../customer/CustomerOrder'

export default function OrderHistorySection() {
  const [isHistoryOrderOpen, setIsHistoryOrderOpen] = useState(false)

  const handleHistoryOrderOpen = () => {
    setIsHistoryOrderOpen((prev) => !prev)
  }

  return (
    <>
      <Button variant='outline' className='rounded-2xl py-2 border border-border-secondary hover:bg-secondary hover:text-white hover:border-none gap-2' onClick={handleHistoryOrderOpen}>
        <MdHistory className='text-[1.25rem]'/>
        Lịch sử đơn hàng
      </Button>
      <AnimatePresence>
        { isHistoryOrderOpen &&
            <PopupBasic title='Thông tin sản phẩm' onClose={handleHistoryOrderOpen}>
              <CustomerOrder/>
            </PopupBasic>
        }
      </AnimatePresence>

    </>
  )
}
