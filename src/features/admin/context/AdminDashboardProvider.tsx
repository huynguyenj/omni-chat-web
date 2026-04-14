import { createContext, useMemo, useState, type PropsWithChildren } from 'react'

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

export function AdminDashboardProvider({ children }: PropsWithChildren) {
  // Centralized UI state for Admin Dashboard tabs/components.
  const today = new Date()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  const [dateFrom, setDateFrom] = useState<Date | undefined>(firstDay)
  const [dateTo, setDateTo] = useState<Date | undefined>(today)
  const setSafeDateFrom = (d: Date | undefined) => {
    if (d && dateTo && d > dateTo) return
    setDateFrom(d)
  }
  
  const setSafeDateTo = (d: Date | undefined) => {
    if (d && dateFrom && d < dateFrom) return
    setDateTo(d)
  }
  const [activeTab, setActiveTab] = useState<AdminDashboardTab>('overview')
  const [addStaffDialogOpen, setAddStaffDialogOpen] = useState(false)
  const [editStaffDialogOpen, setEditStaffDialogOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<StaffAccount | null>(null)
  const [sortBy, setSortBy] = useState<RevenueSortBy>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  const toggleSort = (column: RevenueSortBy) => {
    // Clicking same column toggles asc/desc; clicking new column resets to desc.
    if (sortBy === column) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
      return
    }
    setSortBy(column)
    setSortOrder('desc')
  }

  const value = useMemo<AdminDashboardContextValue>(() => {
    return {
      dateFrom,
      dateTo,
      setDateFrom: setSafeDateFrom,
      setDateTo: setSafeDateTo,
      activeTab,
      setActiveTab,
      addStaffDialogOpen,
      setAddStaffDialogOpen,
      editStaffDialogOpen,
      setEditStaffDialogOpen,
      selectedStaff,
      setSelectedStaff,
      sortBy,
      sortOrder,
      toggleSort
    }
  }, [activeTab, addStaffDialogOpen, dateFrom, dateTo, editStaffDialogOpen, selectedStaff, sortBy, sortOrder])

  return (
    <AdminDashboardContext.Provider value={value}>
      {children}
    </AdminDashboardContext.Provider>
  )
}

