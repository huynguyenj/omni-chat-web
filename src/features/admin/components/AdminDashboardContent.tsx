import { useAdminDashboard } from '../hooks/useAdminDashboard'
import OverviewTab from './tabs/OverviewTab'
import RevenueTab from './tabs/RevenueTab'
import StaffTab from './tabs/StaffTab'

export default function AdminDashboardContent() {
  const { activeTab } = useAdminDashboard()

  // Tab switcher: keep page component clean; render the right tab content here.
  if (activeTab === 'revenue') return <RevenueTab />
  if (activeTab === 'staff') return <StaffTab />
  return <OverviewTab />
}

