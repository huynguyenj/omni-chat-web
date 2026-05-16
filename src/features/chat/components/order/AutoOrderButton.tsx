import Alert from '@/components/ui/alert/Alert'
import Button from '@/components/ui/button/Button'
import Input from '@/components/ui/input/Input'
import PopupBasic from '@/components/ui/popup/PopupBasic'
import { AlertCircle } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { MdOutlineShoppingCart } from 'react-icons/md'
import useAutoCreateOrder from '../../hooks/useAutoCreateOrder'
import LoadingSpinner from '@/components/ui/loading/LoadingSpinner'

export default function AutoOrderButton() {
  const [isOpen, setIsOpen] = useState(false)
  const { errors, loading, register, handleSubmit, onSubmit } = useAutoCreateOrder()
  const handleOpen = () => {
    setIsOpen((prev) => !prev)
  }

  return (
    <>
      <Button className='bg-transparent text-black rounded-lg w-full justify-start p-2 hover:bg-secondary hover:text-white hover:border-none gap-2' onClick={handleOpen}>
        <MdOutlineShoppingCart className='size-4'/>
        <p className='text-nowrap'>Tạo đơn hàng tự động</p>
      </Button>
      <AnimatePresence>
        {isOpen &&
            <PopupBasic onClose={handleOpen} title='Tạo đơn tự động'>
              <p className='text-sm-body-desktop mb-2 text-soft-gray'>Điền nội dung tin nhắn để tiến hành tạo đơn tự động</p>
              <Input {...register('message')} variant='gray' label='Tin nhắn' placeholder='Tôi muốn đặt sữa Long Thành, 180ml...' error={errors.message?.message}/>
              <Alert variant='danger' className='rounded-[10px] my-2'>
                <div className='flex gap-2 items-center'>
                  <AlertCircle className='size-4'/>
                  <p>Chắn chắn rằng tin nhắn bao gồm đủ thông tin về sản phẩm</p>
                </div>
              </Alert>
              { loading ?
                <LoadingSpinner/>
                :
                <Button className='w-full mt-5' onClick={handleSubmit(onSubmit)}>
                        Tạo đơn
                </Button>
              }
            </PopupBasic>
        }
      </AnimatePresence>
    </>
  )
}
