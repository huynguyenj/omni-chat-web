import AdminDashboardContent from '@/features/admin/components/AdminDashboardContent'
import AdminDashboardHeader from '@/features/admin/components/AdminDashboardHeader'
import AdminDashboardShell from '@/features/admin/components/AdminDashboardShell'
import AdminDashboardTabs from '@/features/admin/components/AdminDashboardTabs'
import { AdminDashboardProvider } from '@/features/admin/context/AdminDashboardProvider'

/**
 * Admin dashboard route component.
 *
 * Pattern (same idea as `ChatPage`):
 * - This file stays "thin": it only composes the page out of feature components.
 * - All UI state + logic live under `src/features/admin/**`.
 *
 * Data flow:
 * - `AdminDashboardProvider` stores shared UI state (activeTab, sort, dialogs, selected staff, date range).
 * - `AdminDashboardTabs` updates `activeTab` in the provider when you click a tab.
 * - `AdminDashboardContent` reads `activeTab` and renders the matching tab component (Overview / Revenue / Staff).
 */
export default function AdminDashboard() {
  return (
    // Provider boundary: everything inside can read/write dashboard state via `useAdminDashboard()`.
    <AdminDashboardProvider>
      // Shell = consistent spacing + max width + background for the whole dashboard.
      <AdminDashboardShell>
        {/* Header = title + date range display (UI placeholder for now). */}
        <AdminDashboardHeader />
        {/* Tabs = controls `activeTab` in context. */}
        <AdminDashboardTabs />
        {/* Content = renders tab body based on `activeTab`. */}
        <AdminDashboardContent />
      </AdminDashboardShell>
    </AdminDashboardProvider>
  )
}

