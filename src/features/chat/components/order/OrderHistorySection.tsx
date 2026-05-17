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
      <Button className='bg-transparent text-black rounded-lg w-full justify-start p-2 hover:bg-secondary hover:text-white hover:border-none gap-2' onClick={handleHistoryOrderOpen}>
        <MdHistory className='size-4'/>
        <p className='text-nowrap'>Lịch sử đơn hàng</p>
      </Button>
      <AnimatePresence>
        { isHistoryOrderOpen &&
            <PopupBasic title='Thông tin sản phẩm' onClose={handleHistoryOrderOpen} size='sm'>
              <div className='md:w-90 lg:w-130'>
                <CustomerOrder/>
              </div>
            </PopupBasic>
        }
      </AnimatePresence>

    </>
  )
}
