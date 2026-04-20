import type { ReactNode } from 'react'
import { DollarSign, Users } from 'lucide-react'
import { useAdminDashboard } from '../hooks/useAdminDashboard'
import type { AdminDashboardTab } from '../context/AdminDashboardContext'
import Card from '@/components/ui/card/Card'
import Button from '@/components/ui/button/Button'

function TabButton({ value, children }: { value: AdminDashboardTab; children: ReactNode }) {
  const { activeTab, setActiveTab } = useAdminDashboard()
  const active = activeTab === value
  return (
    <Button
      onClick={() => setActiveTab(value)}
      className={`px-3 py-2 text-sm-body-desktop rounded-2xl ${active ? 'bg-[#3366CC] text-white' : 'bg-transparent text-gray-700 hover:bg-gray-200'}`}
    >
      {children}
    </Button>
  )
}

export default function AdminDashboardTabs() {
  return (
    <Card className="flex py-2 px-3 gap-2 w-fit mb-5">
      <TabButton value="overview">Tổng quan</TabButton>
      <TabButton value="revenue">
        <span className="inline-flex items-center">
          <DollarSign className="h-4 w-4 mr-2" />
          Doanh thu
        </span>
      </TabButton>
      <TabButton value="staff">
        <span className="inline-flex items-center">
          <Users className="h-4 w-4 mr-2" />
          Quản lý Staff
        </span>
      </TabButton>
    </Card>
  )
}

