import Logo from '@/assets/logo.jpg'
import { FiBell } from 'react-icons/fi'
import { RxExit } from 'react-icons/rx'
import Button from '../ui/button/Button'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { useNavigate } from 'react-router'
import { PUBLIC_PATH } from '@/router/path'

export default function MainNavbar() {
  const clearAuthStore = useAuthStore(s => s.removeAuthInfo)
  const { role } = useAuthStore()
  const navigate = useNavigate()
  const handleLogout = () => {
    clearAuthStore()
    // Thay thê trang hiện tại bằng trang này tránh TH chạy useEffect phụ thuộc vào biến của useAuthStore
    navigate(PUBLIC_PATH.LOGIN, { replace: true })
  }
  return (
    <div className="sticky flex items-center justify-between top-0 w-full h-20 bg-primary px-5 z-10">
      <img src={Logo} alt="Logo" loading='lazy' className='w-10 h-10' />
      <div className='flex items-center justify-between gap-8'>
        <FiBell className='w-6 h-6 text-white'/>
        <div className='h-15 w-[0.1rem] bg-white'></div>
        <div className='flex items-center gap-3'>
          <img src={Logo} alt="avatar" loading='lazy' className='w-10 h-10 rounded-full' />
          <div className=''>
            <p className='text-sm-body-desktop text-white'>nguyenhuyjobs</p>
            <p className='text-foreground-light-blue'>{role}</p>
          </div>
        </div>
        <Button className='bg-transparent text-white border-none' onClick={handleLogout}>
          <RxExit className='w-6 h-6 text-white'/>
        </Button>
      </div>
    </div>
  )
}