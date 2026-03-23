import type { ReactNode } from 'react'
import { DollarSign, Users } from 'lucide-react'
import { useAdminDashboard } from '../hooks/useAdminDashboard'
import type { AdminDashboardTab } from '../context/AdminDashboardProvider'
import Card from '@/components/ui/card/Card';

function TabButton({ value, children }: { value: AdminDashboardTab; children: ReactNode }) {
  const { activeTab, setActiveTab } = useAdminDashboard()
  const active = activeTab === value
  return (
    <button
      type="button"
      onClick={() => setActiveTab(value)}
      className={`px-4 py-2 text-sm rounded-md ${active ? 'bg-[#3366CC] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
    >
      {children}
    </button>
  )
}

export default function AdminDashboardTabs() {
  return (
    <Card className="flex">
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

