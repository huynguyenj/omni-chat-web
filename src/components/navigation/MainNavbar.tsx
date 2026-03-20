import Logo from '@/assets/logo.jpg'
import { FiBell } from 'react-icons/fi'
import { RxExit } from 'react-icons/rx'


export default function MainNavbar() {
  return (
     <div className="sticky top-0 z-20 flex items-center justify-between w-full h-20 bg-primary px-5">
      <img src={Logo} alt="Logo" loading='lazy' className='w-10 h-10' />
     
     {/* nav cho home, admin và manager */}
      <nav className="flex items-center gap-6">
        <a href="/" className="text-white hover:underline">Home</a>
        <a href="/admin" className="text-white hover:underline">Admin</a>
        <a href="/manager" className="text-white hover:underline">Manager</a>
      </nav>
     
      <div className='flex items-center justify-between gap-8'>
        <FiBell className='w-6 h-6 text-white'/>
        <div className='h-15 w-[0.1rem] bg-white'></div>
        <div className='flex items-center gap-3'>
          <img src={Logo} alt="avatar" loading='lazy' className='w-10 h-10 rounded-full' />
          <div className=''>
            <p className='text-sm-body-desktop text-white'>nguyenhuyjobs</p>
            <p className='text-foreground-light-blue'>staff</p>
          </div>
        </div>
        <RxExit className='w-6 h-6 text-white'/>
      </div>
    </div>
  )
}
