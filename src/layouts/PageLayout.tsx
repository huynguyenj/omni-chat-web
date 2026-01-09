import MainNavbar from '@/components/navigation/MainNavbar'
import { Outlet } from 'react-router'

export default function PageLayout() {
  return (
    <div className='min-h-screen'>
      <MainNavbar/>
      <div>
        <Outlet/>
      </div>
      <div></div>
    </div>
  )
}
