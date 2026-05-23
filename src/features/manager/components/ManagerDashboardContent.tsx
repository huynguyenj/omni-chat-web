import { useEffect } from 'react'
import { useManagerDashboard } from '../hooks/useManagerDashboard'
import StaffTab from './tabs/StaffTab'
import KeywordsTab from './tabs/KeywordsTab'
import ProductsTab from './tabs/ProductsTab'
import OrdersTab from './tabs/OrdersTab'
// import WarehouseTab from './tabs/WarehouseTab' // ẩn tab Kho hàng
import ClaimsTab from './tabs/ClaimsTab'
import WarningsTab from './tabs/WarningsTab'
import ShippersTab from './tabs/ShippersTab'
import InvoicesTab from './tabs/InvoicesTab'
import WalletTab from './tabs/WalletTab.tsx'
import ChatTemplateTab from './tabs/ChatTemplateTab.tsx'
import ProductBatchAuditTab from './tabs/ProductBatchAuditTab.tsx'

export default function ManagerDashboardContent() {
  const { activeTab, setActiveTab } = useManagerDashboard()

  // Tab Kho hàng đã ẩn — tránh kẹt tab cũ
  useEffect(() => {
    if (activeTab === 'warehouse') setActiveTab('orders')
  }, [activeTab, setActiveTab])

  if (activeTab === 'staff') return <StaffTab />
  if (activeTab === 'keywords') return <KeywordsTab />
  if (activeTab === 'chat-template') return <ChatTemplateTab/>
  if (activeTab === 'products') return <ProductsTab />
  if (activeTab === 'product-batch-audit') return <ProductBatchAuditTab />
  if (activeTab === 'orders') return <OrdersTab />
  // if (activeTab === 'warehouse') return <WarehouseTab />
  if (activeTab === 'claims') return <ClaimsTab />
  if (activeTab === 'warnings') return <WarningsTab />
  if (activeTab === 'shippers') return <ShippersTab />
  if (activeTab === 'invoice') return <InvoicesTab />
  if (activeTab === 'wallet') return <WalletTab />
  return (
    <div className="p-6 bg-white rounded-[20px] border border-gray-200">
      Tạm thời chưa port: <b>{activeTab}</b>
    </div>
  )
}

