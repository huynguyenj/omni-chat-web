import TabNavbar from '../components/TabNavbar'
import { Outlet } from 'react-router'

export default function ChatLayout() {
  return (
    <div>
      <div>
        <TabNavbar/>
      </div>
      <Outlet/>
    </div>
  )
}
