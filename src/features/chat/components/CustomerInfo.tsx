import { FiCheckCircle } from 'react-icons/fi'
import type { ConversationDetail } from '../types/message-type'
import { CiSearch } from 'react-icons/ci'
import Button from '@/components/ui/button/Button'
import { useState } from 'react'
import PopupBasic from '@/components/ui/popup/PopupBasic'
import Input from '@/components/ui/input/Input'
import CustomerProfile from './CustomerProfile'
import CustomerOrder from './CustomerOrder'
import Ticket from './Ticket'
import { IoPerson } from 'react-icons/io5'
import { FaShoppingBag, FaTicketAlt } from 'react-icons/fa'
import { GoTasklist } from 'react-icons/go'
import TaskList from './TaskList'

type CustomerInfoType = Omit<Partial<ConversationDetail>, 'messages'>

export default function CustomerInfo({ customerName, activeCustomerId, avartarUrl }: CustomerInfoType) {
  const [isOpen, setIsOpen] = useState(false)
  const [tab, setTab] = useState(1)
  const handleOpen = () => {
    setIsOpen((prev) => !prev)
  }
  function Tab() {
    switch (tab) {
    case 1: return <TaskList/>
    case 2: return <CustomerProfile/>
    case 3: return <CustomerOrder/>
    case 4: return <Ticket/>
    default: return <CustomerProfile/>
    }
  }
  return (
    <div className='flex flex-col py-4 h-full'>
      <div>
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
        <div className='mt-5 px-4'>
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
        <div className='bg-gray-200 w-full px-2 py-1 flex gap-2 items-center justify-between'>
          <Button className={`text-sm-body-desktop px-7 py-1 gap-2 ${tab === 1 ? 'rounded-[18px] shadow-[0px_1px_0px_0px_#3366CC] bg-white text-secondary border' : 'bg-gray-200 border-none text-black'} hover:bg-[initial]`} onClick={() => setTab(1)}>
            <GoTasklist className='text-[1rem]'/>
              Tasks
          </Button>
          <Button className={`text-sm-body-desktop px-7 py-1 gap-2 ${tab === 2 ? 'rounded-[18px] shadow-[0px_1px_0px_0px_#3366CC] bg-white text-secondary border' : 'bg-gray-200 border-none text-black'} hover:bg-[initial]`} onClick={() => setTab(1)}>
            <IoPerson className='text-[1rem]'/>
              Hồ sơ
          </Button>
          <Button className={`text-sm-body-desktop px-7 py-1 gap-2 ${tab === 3 ? 'rounded-[18px] shadow-[0px_1px_0px_0px_#3366CC] bg-white text-secondary border' : 'bg-gray-200 border-none text-black'} hover:bg-[initial]`} onClick={() => setTab(2)}>
            <FaShoppingBag className='text-[1rem]'/>
              Đơn hàng
          </Button>
          <Button className={`text-sm-body-desktop px-7 py-1 gap-2 ${tab === 4 ? 'rounded-[18px] shadow-[0px_1px_0px_0px_#3366CC] bg-white text-secondary border' : 'bg-gray-200 border-none text-black'} hover:bg-[initial]`} onClick={() => setTab(3)}>
            <FaTicketAlt className='text-[1rem]'/>
              Tickets
          </Button>
        </div>
      </div>
      <div className='flex-1 py-5 overflow-y-auto px-3'>
        {Tab()}
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
