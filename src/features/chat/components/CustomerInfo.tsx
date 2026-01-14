import Avatar from '@/assets/avatar-sample.jpg'
import { GoPerson } from 'react-icons/go'
import { IoMdTime } from 'react-icons/io'
import { CiChat1 } from 'react-icons/ci'
import { FiCheckCircle } from 'react-icons/fi'
import { FaExchangeAlt } from 'react-icons/fa'

export default function CustomerInfo() {
  return (
    <div className='px-3 py-4'>
      <div className='border border-gray-200 rounded-lg px-2 py-5'>
        <div className='flex flex-col justify-center items-center'>
          <img src={Avatar} alt="avatar" className='w-20 h-20 rounded-full'/>
          <div>
            <p className='text-sm-body-desktop text-center'>Nguyen Van A</p>
            <p className='text-[0.9rem] text-gray-500 text-center'>Khách hàng</p>
          </div>
        </div>
        <hr className='text-gray-200 mt-8'/>
        <div className='mt-5'>
          <div className='flex items-center gap-4'>
            <GoPerson className='text-secondary
             text-[1.2rem]'/>
            <div>
              <p className='text-sm-body-desktop text-gray-400'>ID khách hàng</p>
              <p className='text-[1rem]'>#CUS0001</p>
            </div>
          </div>
          <div className='flex items-center gap-4 my-3'>
            <IoMdTime className='text-secondary
             text-[1.2rem]'/>
            <div>
              <p className='text-sm-body-desktop text-gray-400'>Thời gian bắt đầu</p>
              <p className='text-[1rem]'>10:30</p>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <CiChat1 className='text-secondary
             text-[1.2rem]'/>
            <div>
              <p className='text-sm-body-desktop text-gray-400'>Nền tảng</p>
              <p className='text-[1rem]'>Messenger</p>
            </div>
          </div>
        </div>
      </div>
      <div className='my-5 flex flex-col gap-3'>
        <button className='bg-green-accent py-2 px-5 flex items-center  justify-center gap-5 text-white font-bold rounded-[10px] w-full hover:bg-green-hover'>
          <FiCheckCircle/>
          <p>Hoàn thành hỗ trợ</p>
        </button>
        <button className='bg-secondary py-2 px-5 flex items-center justify-center gap-5 text-white font-bold rounded-[10px] w-full hover:bg-secondary-hover'>
          <FaExchangeAlt/>
          <p>Chuyển tin nhắn</p>
        </button>
      </div>
    </div>
  )
}
