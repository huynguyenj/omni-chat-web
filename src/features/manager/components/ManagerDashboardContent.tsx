import { useManagerDashboard } from '../hooks/useManagerDashboard'
import StaffTab from './tabs/StaffTab'
import KeywordsTab from './tabs/KeywordsTab'
import ProductsTab from './tabs/ProductsTab'
import OrdersTab from './tabs/OrdersTab'
import WarehouseTab from './tabs/WarehouseTab'
import ClaimsTab from './tabs/ClaimsTab'
import WarningsTab from './tabs/WarningsTab'
import ShippersTab from './tabs/ShippersTab'
import InvoicesTab from './tabs/InvoicesTab'

export default function ManagerDashboardContent() {
  const { activeTab } = useManagerDashboard()

  if (activeTab === 'staff') return <StaffTab />
  if (activeTab === 'keywords') return <KeywordsTab />
  if (activeTab === 'products') return <ProductsTab />
  if (activeTab === 'orders') return <OrdersTab />
  if (activeTab === 'warehouse') return <WarehouseTab />
  if (activeTab === 'claims') return <ClaimsTab />
  if (activeTab === 'warnings') return <WarningsTab />
  if (activeTab === 'shippers') return <ShippersTab />
  if (activeTab === 'invoice') return <InvoicesTab />

  return (
    <div className="p-6 bg-white rounded-[20px] border border-gray-200">
      Tạm thời chưa port: <b>{activeTab}</b>
    </div>
  )
}

