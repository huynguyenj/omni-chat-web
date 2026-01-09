import Logo from '@/assets/logo.jpg'
import { FiBell } from 'react-icons/fi'
import { RxExit } from 'react-icons/rx'


export default function MainNavbar() {
  return (
    <div className="sticky flex items-center justify-between top-0 w-full h-25 bg-primary px-5">
      <img src={Logo} alt="Logo" loading='lazy' className='w-15 h-15' />
      <div className='flex items-center justify-between gap-8'>
        <FiBell className='w-6 h-6 text-white'/>
        <div className='h-15 w-[0.1rem] bg-white'></div>
        <div className='flex items-center gap-3'>
          <img src={Logo} alt="avatar" loading='lazy' className='w-11 h-11 rounded-full' />
          <div className=''>
            <p className='text-m-body-desktop text- text-white'>nguyenhuyjobs</p>
            <p className='text-foreground-light-blue'>staff</p>
          </div>
        </div>
        <RxExit className='w-6 h-6 text-white'/>
      </div>
    </div>
  )
}
