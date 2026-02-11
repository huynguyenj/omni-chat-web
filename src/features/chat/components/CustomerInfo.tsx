import { FiCheckCircle } from 'react-icons/fi'
import type { ConversationDetail } from '../types/message-type'
import { CiSearch } from 'react-icons/ci'
import Button from '@/components/ui/button/Button'
import { useState } from 'react'
import PopupBasic from '@/components/ui/popup/PopupBasic'
import Input from '@/components/ui/input/Input'

type CustomerInfoType = Omit<Partial<ConversationDetail>, 'messages'>

export default function CustomerInfo({ customerName, activeCustomerId, avartarUrl }: CustomerInfoType) {
  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = () => {
    setIsOpen((prev) => !prev)
  }
  return (
    <div className='px-3 py-4'>
      <div className='border border-gray-200 rounded-lg px-2 py-5'>
        <div className='flex flex-col justify-center items-center'>
          {avartarUrl ? 
            <img src={avartarUrl} alt="avatar" className='w-20 h-20 rounded-full'/>
            :
            <div className='w-20 h-20 rounded-full bg-secondary flex items-center justify-center'>
              <p className='text-white text-m-body-desktop'>{customerName ? customerName.charAt(0): 'N'}</p>
            </div>
          }
          <div>
            <p className='text-sm-body-desktop text-center'>{customerName}</p>
            <p className='text-[1rem]'>{activeCustomerId}</p>
          </div>
        </div>
        <div className='mt-5'>
          <div className='my-5 flex flex-col gap-3'>
            <Button variant='success'>
              <FiCheckCircle className='text-[1.25rem]'/>
              Hoàn thành hỗ trợ
            </Button>
            <Button variant='outline' onClick={handleOpen}>
              <CiSearch className='text-[1.25rem]'/>
              Tìm kiếm sản phẩm
            </Button>
          </div>
        </div>
      </div>
      {isOpen &&
      <PopupBasic onClose={handleOpen} title='Tìm kiếm sản phẩm'>
        <p className='text-gray-400 mb-2'>Nhập tên hoặc mã sản phẩm để tra cứu thông tin nhanh</p>
        <Input icon={CiSearch} type='text' variant='gray' placeholder='Tìm kiếm theo tên hoặc mã sản phẩm'/>
        <div className='flex flex-col items-center justify-center py-10'>
          <CiSearch size={50} className='font-bold text-gray-400'/>
          <p className='text-gray-400'>Nhập từ khóa sản phẩm</p>
        </div>
      </PopupBasic>
      }
    </div>
  )
}
