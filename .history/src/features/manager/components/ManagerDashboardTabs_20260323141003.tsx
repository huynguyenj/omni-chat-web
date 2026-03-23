import type { ComponentType } from 'react'
import { AlertTriangle, ClipboardCheck, Package, ShoppingCart, Tag, Truck, Users, Warehouse } from 'lucide-react'
import { useManagerDashboard } from '../hooks/useManagerDashboard'
import type { ManagerDashboardTab } from '../context/ManagerDashboardProvider'
import Card from '@/components/ui/card/Card'
import Button from '@/components/ui/button/Button'

const tabs: Array<{ value: ManagerDashboardTab; label: string; Icon: ComponentType<{ className?: string }> }> = [
  { value: 'staff', label: 'Nhân viên', Icon: Users },
  { value: 'keywords', label: 'Keywords', Icon: Tag },
  { value: 'products', label: 'Sản phẩm', Icon: Package },
  { value: 'orders', label: 'Đơn hàng', Icon: ShoppingCart },
  { value: 'warehouse', label: 'Kho hàng', Icon: Warehouse },
  { value: 'claims', label: 'Claims', Icon: ClipboardCheck },
  { value: 'warnings', label: 'Cảnh báo', Icon: AlertTriangle },
  { value: 'shippers', label: 'Shipper', Icon: Truck }
]

function TabButton({
  value,
  label,
  Icon
}: {
  value: ManagerDashboardTab
  label: string
  Icon: ComponentType<{ className?: string }>
}) {
  const { activeTab, setActiveTab } = useManagerDashboard()
  const active = activeTab === value
  return (
    <Button
      onClick={() => setActiveTab(value)}
      className={`px-3 py-1 text-sm-body-desktop rounded-2xl flex items-center gap-2 ${
        active ? 'bg-[#3366CC] text-white' : 'bg-transparent text-gray-700 hover:bg-gray-100'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  )
}

export default function ManagerDashboardTabs() {
  return (
    <Card className='flex py-2 px-3'>
      {tabs.map(t => (
        <TabButton key={t.value} value={t.value} label={t.label} Icon={t.Icon} />
      ))}
    </Card>
  )
}

