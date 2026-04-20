import Button from '@/components/ui/button/Button'
import { FiCheckCircle, FiEdit2 } from 'react-icons/fi'
import { IoMdTime } from 'react-icons/io'
import { MdChatBubbleOutline, MdMailOutline, MdOutlineMail } from 'react-icons/md'
import { LuPhone, LuShoppingBag } from 'react-icons/lu'
import { IoCalendarClearOutline, IoLocationOutline } from 'react-icons/io5'
import Card from '@/components/ui/card/Card'
import { useEffect, useState } from 'react'
import PopupBasic from '@/components/ui/popup/PopupBasic'
import Input from '@/components/ui/input/Input'
import { CiPhone } from 'react-icons/ci'
import useGetCustomerInfo from '../../hooks/useGetCustomerInfo'
import NodataCard from '@/components/ui/card/NodataCard'
import { formatDate } from '@/utils/date-resolver'
import { FaImage } from 'react-icons/fa6'
import useUpdateCustomerInfo from '../../hooks/useUpdateCustomerInfo'
import LoadingSpinner from '@/components/ui/loading/LoadingSpinner'
import CustomerInfoSkeleton from '@/components/ui/skeleton/CustomerInfoSkeleton'


export default function CustomerProfile() {
  const { customerInfo, loading, setIsRefetch } = useGetCustomerInfo()
  const { errors, handleSubmit, loading: updateLoading, onSubmit, register, reset } = useUpdateCustomerInfo({ customerId: customerInfo?.id, setIsRefetch: setIsRefetch })
  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = () => {
    setIsOpen((prev) => !prev)
  }

  useEffect(() => {
    reset({
      address: customerInfo?.address,
      avatarUrl: customerInfo?.avatarUrl,
      customerName: customerInfo?.customerName,
      email: customerInfo?.email,
      phoneNumber: customerInfo?.customerPhone
    })
  }, [customerInfo])
  return (
    <div className='flex flex-col gap-3'>
      { loading ?
        <CustomerInfoSkeleton count={5}/>
        :
        <>
          { customerInfo ?
            <>
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
                  <p className='text-sm-body-desktop font-medium'>{customerInfo.customerPhone}</p>
                </div>
              </div>
              <div className='flex items-start gap-3 bg-gray-100 rounded-[7px] py-4 px-3'>
                <MdOutlineMail className='text-secondary'/>
                <div>
                  <p className='text-[0.85rem] text-gray-500'>Email</p>
                  <p className='text-sm-body-desktop font-medium'>{customerInfo.email}</p>
                </div>
              </div>
              <div className='flex items-start gap-3 bg-gray-100 rounded-[7px] py-4 px-3'>
                <IoLocationOutline className='text-secondary'/>
                <div>
                  <p className='text-[0.85rem] text-gray-500'>Địa chỉ</p>
                  <p className='text-sm-body-desktop font-medium'>{customerInfo.address}</p>
                </div>
              </div>
              <div className='flex items-start gap-3 bg-gray-100 rounded-[7px] py-4 px-3'>
                <MdChatBubbleOutline className='text-secondary'/>
                <div>
                  <p className='text-[0.85rem] text-gray-500'>Nền tảng</p>
                  <p className='text-sm-body-desktop font-medium'>{customerInfo.providerName}</p>
                </div>
              </div>
              <div className='flex items-start gap-3 bg-gray-100 rounded-[7px] py-4 px-3'>
                <IoMdTime className='text-secondary'/>
                <div>
                  <p className='text-[0.85rem] text-gray-500'>Thời gian bắt đầu</p>
                  <p className='text-sm-body-desktop font-medium'>{formatDate(customerInfo.timeStartSupport)}</p>
                </div>
              </div>
              <hr className='text-gray-300'/>
              <p className='text-primary font-medium'>Thông tin bổ sung</p>
              <div className='flex items-start gap-3 bg-gray-100 rounded-[7px] py-4 px-3'>
                <LuShoppingBag className='text-secondary'/>
                <div>
                  <p className='text-[0.85rem] text-gray-500'>Tổng đơn hàng</p>
                  <p className='text-sm-body-desktop font-medium'>{customerInfo.totalOrder} đơn</p>
                </div>
              </div>
              <div className='flex items-start gap-3 bg-gray-100 rounded-[7px] py-4 px-3'>
                <IoCalendarClearOutline className='text-secondary'/>
                <div>
                  <p className='text-[0.85rem] text-gray-500'>Khách hàng từ</p>
                  <p className='text-sm-body-desktop font-medium'>{formatDate(customerInfo.becomeCustomerDate)}</p>
                </div>
              </div>
              <Card className='bg-green-50 border border-green-200 flex gap-2 rounded-[10px]'>
                <FiCheckCircle className='text-green-accent'/>
                <div>
                  <p className='text-[0.85rem] text-gray-500'>Tổng chi tiêu</p>
                  <p className='text-green-accent font-bold'>{customerInfo.totalPay.toLocaleString()}đ</p>
                </div>
              </Card>
            </>
            :
            <NodataCard/>
          }
        </>
      }
      { isOpen &&
        <PopupBasic onClose={handleOpen} title='Chỉnh sửa thông tin khách hàng'>
          <p className='text-[0.85rem] text-gray-400'>Cập nhật thông tin liên hệ của khách hàng</p>
          <div className='flex flex-col gap-2 mt-3'>
            <Input {...register('customerName')} variant='gray' placeholder='Nguyễn Văn A' label='Họ và tên' error={errors.customerName?.message}/>
            <Input {...register('phoneNumber')} icon={CiPhone} variant='gray' placeholder='0901234567' label='Số điện thoại' error={errors.phoneNumber?.message}/>
            <Input {...register('email')} icon={MdMailOutline} variant='gray' placeholder='nguyenvana@email.com' label='Email' error={errors.email?.message}/>
            <Input {...register('address')} icon={IoLocationOutline} variant='gray' placeholder='123 Đường ABC, Quận 1, TP.HCM' label='Địa chỉ' error={errors.address?.message}/>
            <Input {...register('avatarUrl')} icon={FaImage} variant='gray' placeholder='' label='Đường dẫn của ảnh'/>
          </div>
          <hr className='text-gray-200 my-7'/>
          <div className='w-full justify-center items-center flex gap-2'>
            { updateLoading ?
              <LoadingSpinner size='lg'/>
              :
              <>
                <Button className='border border-gray-200 bg-white text-black flex-1 hover:bg-gray-300' onClick={handleOpen}>
                  <p>Hủy</p>
                </Button>
                <Button className='flex-1' onClick={handleSubmit(onSubmit)}>
                  <FiCheckCircle/>
                Lưu thay đổi
                </Button>
              </>
            }
          </div>
        </PopupBasic>
      }
    </div>
  )
}
