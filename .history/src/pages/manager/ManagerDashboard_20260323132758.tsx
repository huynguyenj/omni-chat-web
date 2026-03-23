
import ManagerDashboardContent from '@/features/manager/components/ManagerDashboardContent'
import ManagerDashboardHeader from '@/features/manager/components/ManagerDashboardHeader'
import ManagerDashboardShell from '@/features/manager/components/ManagerDashboardShell'
import ManagerDashboardTabs from '@/features/manager/components/ManagerDashboardTabs'
import { ManagerDashboardProvider } from '@/features/manager/context/ManagerDashboardProvider'

// Manager dashboard route component (thin page).
export default function ManagerDashboard() {
  return (
    <ManagerDashboardProvider>
      <ManagerDashboardShell>
        <ManagerDashboardHeader />
        <ManagerDashboardTabs />
        <ManagerDashboardContent />
      </ManagerDashboardShell>
    </ManagerDashboardProvider>
  )
}
