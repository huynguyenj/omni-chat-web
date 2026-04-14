import { createContext } from 'react'

export type AdminDashboardTab = 'overview' | 'revenue' | 'staff'
export type RevenueSortBy = 'date' | 'value' | 'customer'
export type SortOrder = 'asc' | 'desc'

export type StaffAccount = {
  id: string
  name: string
  email: string
  phone?: string
  role: string
  department: string
  status: string
  joinDate: string
}

export type AdminDashboardContextValue = {
  // Date range (UI placeholders for now; hook up calendar later).
  dateFrom: Date | undefined
  dateTo: Date | undefined
  setDateFrom: (d: Date | undefined) => void
  setDateTo: (d: Date | undefined) => void

  // Which dashboard tab is currently visible.
  activeTab: AdminDashboardTab
  setActiveTab: (t: AdminDashboardTab) => void

  // Dialog state for staff management tab.
  addStaffDialogOpen: boolean
  setAddStaffDialogOpen: (open: boolean) => void

  editStaffDialogOpen: boolean
  setEditStaffDialogOpen: (open: boolean) => void
  selectedStaff: StaffAccount | null
  setSelectedStaff: (s: StaffAccount | null) => void

  // Sorting state for revenue orders list.
  sortBy: RevenueSortBy
  sortOrder: SortOrder
  toggleSort: (column: RevenueSortBy) => void
}

export const AdminDashboardContext = createContext<AdminDashboardContextValue | undefined>(undefined)
