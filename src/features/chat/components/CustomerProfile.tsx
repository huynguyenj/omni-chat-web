import Button from '@/components/ui/button/Button'
import { FiCheckCircle, FiEdit2 } from 'react-icons/fi'
import { IoMdTime } from 'react-icons/io'
import { MdChatBubbleOutline, MdMailOutline, MdOutlineMail } from 'react-icons/md'
import { LuPhone, LuShoppingBag } from 'react-icons/lu'
import { IoCalendarClearOutline, IoLocationOutline } from 'react-icons/io5'
import { GoPerson } from 'react-icons/go'
import Tag from '@/components/ui/tag/Tag'
import Card from '@/components/ui/card/Card'
import { useState } from 'react'
import PopupBasic from '@/components/ui/popup/PopupBasic'
import Input from '@/components/ui/input/Input'
import { CiPhone } from 'react-icons/ci'

type CustomerProfileType = {
  phone: string
  email: string
  address: string
  platform: string
  statedTime: string
}

type ProvidedInfoType = {
  customerType: string
  totalOrder: number
  date: string
  totalAmount: number
}

const CustomerProfileData: CustomerProfileType = {
  phone: '091234567',
  email: 'nguyenvana@email.com',
  address: '123 đường ABC, Quận 1, TP.HCM',
  platform: 'Facebook Messenger',
  statedTime: '10:30'
}

const ProvidedData: ProvidedInfoType = {
  customerType: 'Vip',
  totalOrder: 8,
  date: '15/08/2024',
  totalAmount: 2712000
}

export default function CustomerProfile() {
  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = () => {
    setIsOpen((prev) => !prev)
  }
  return (
    <div className='flex flex-col gap-3'>
      <div className="flex justify-between items-center">
        <p className="text-sm-body-desktop text-primary font-medium">Thông tin khách hàng</p>
        <Button className="bg-white text-secondary font-medium hover:bg-blue-100" onClick={handleOpen}>
          <FiEdit2/>
          <p className="text-sm-body-desktop">Chỉnh sửa</p>
        </Button>
      </div>
      <div className='flex items-start gap-3 bg-gray-100 rounded-[7px] py-4 px-3'>
        <LuPhone className='text-secondary'/>
        <div>
          <p className='text-[0.85rem] text-gray-500'>Số điện thoại</p>
          <p className='text-sm-body-desktop font-medium'>{CustomerProfileData.phone}</p>
        </div>
      </div>
      <div className='flex items-start gap-3 bg-gray-100 rounded-[7px] py-4 px-3'>
        <MdOutlineMail className='text-secondary'/>
        <div>
          <p className='text-[0.85rem] text-gray-500'>Email</p>
          <p className='text-sm-body-desktop font-medium'>{CustomerProfileData.email}</p>
        </div>
      </div>
      <div className='flex items-start gap-3 bg-gray-100 rounded-[7px] py-4 px-3'>
        <IoLocationOutline className='text-secondary'/>
        <div>
          <p className='text-[0.85rem] text-gray-500'>Địa chỉ</p>
          <p className='text-sm-body-desktop font-medium'>{CustomerProfileData.address}</p>
        </div>
      </div>
      <div className='flex items-start gap-3 bg-gray-100 rounded-[7px] py-4 px-3'>
        <MdChatBubbleOutline className='text-secondary'/>
        <div>
          <p className='text-[0.85rem] text-gray-500'>Nền tảng</p>
          <p className='text-sm-body-desktop font-medium'>{CustomerProfileData.platform}</p>
        </div>
      </div>
      <div className='flex items-start gap-3 bg-gray-100 rounded-[7px] py-4 px-3'>
        <IoMdTime className='text-secondary'/>
        <div>
          <p className='text-[0.85rem] text-gray-500'>Thời gian bắt đầu</p>
          <p className='text-sm-body-desktop font-medium'>{CustomerProfileData.statedTime}</p>
        </div>
      </div>
      <hr className='text-gray-300'/>
      <p className='text-primary font-medium'>Thông tin bổ sung</p>
      <div className='flex items-start gap-3 bg-gray-100 rounded-[7px] py-4 px-3'>
        <GoPerson className='text-secondary'/>
        <div>
          <p className='text-[0.85rem] text-gray-500'>Loại khách hàng</p>
          <Tag variant='primary' className='text-sm-body-desktop text-white px-3 py-0.5 w-fit font-medium'>
            {ProvidedData.customerType}
          </Tag>
        </div>
      </div>
      <div className='flex items-start gap-3 bg-gray-100 rounded-[7px] py-4 px-3'>
        <LuShoppingBag className='text-secondary'/>
        <div>
          <p className='text-[0.85rem] text-gray-500'>Tổng đơn hàng</p>
          <p className='text-sm-body-desktop font-medium'>{ProvidedData.totalOrder} đơn</p>
        </div>
      </div>
      <div className='flex items-start gap-3 bg-gray-100 rounded-[7px] py-4 px-3'>
        <IoCalendarClearOutline className='text-secondary'/>
        <div>
          <p className='text-[0.85rem] text-gray-500'>Khách hàng từ</p>
          <p className='text-sm-body-desktop font-medium'>{ProvidedData.date}</p>
        </div>
      </div>
      <Card className='bg-green-50 border border-green-200 flex gap-2 rounded-[10px]'>
        <FiCheckCircle className='text-green-accent'/>
        <div>
          <p className='text-[0.85rem] text-gray-500'>Tổng chi tiêu</p>
          <p className='text-green-accent font-bold'>{ProvidedData.totalAmount.toLocaleString('vi-VN')}đ</p>
        </div>
      </Card>
      { isOpen &&
        <PopupBasic onClose={handleOpen} title='Chỉnh sửa thông tin khách hàng'>
          <p className='text-[0.85rem] text-gray-400'>Cập nhật thông tin liên hệ của khách hàng</p>
          <div className='flex flex-col gap-2 mt-3'>
            <Input variant='gray' placeholder='Nguyễn Văn A' label='Họ và tên'/>
            <Input icon={CiPhone} variant='gray' placeholder='0901234567' label='Số điện thoại'/>
            <Input icon={MdMailOutline} variant='gray' placeholder='nguyenvana@email.com' label='Email'/>
            <Input icon={IoLocationOutline} variant='gray' placeholder='123 Đường ABC, Quận 1, TP.HCM' label='Địa chỉ'/>
          </div>
          <hr className='text-gray-200 my-7'/>
          <div className='w-full flex gap-2'>
            <Button className='border border-gray-200 bg-white text-black flex-1'>
              <p>Hủy</p>
            </Button>
            <Button className='flex-1'>
              <FiCheckCircle/>
              Lưu thay đổi
            </Button>
          </div>
        </PopupBasic>
      }
    </div>
  )
}
