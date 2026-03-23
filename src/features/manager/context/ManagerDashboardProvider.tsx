import { createContext, useMemo, useState, type PropsWithChildren } from 'react'
import type { ManagerStaff } from '../data/manager-dashboard-data'
import { ITEMS_PER_PAGE } from '../data/manager-dashboard-data'

export type ManagerDashboardTab =
  | 'staff'
  | 'keywords'
  | 'products'
  | 'orders'
  | 'warehouse'
  | 'claims'
  | 'warnings'
  | 'shippers'

export type ManagerDashboardContextValue = {
  activeTab: ManagerDashboardTab
  setActiveTab: (tab: ManagerDashboardTab) => void

  // Pagination for Staff tab.
  staffPage: number
  setStaffPage: (page: number) => void

  // Staff dialogs
  addStaffDialogOpen: boolean
  setAddStaffDialogOpen: (open: boolean) => void
  editStaffDialogOpen: boolean
  setEditStaffDialogOpen: (open: boolean) => void
  selectedStaff: ManagerStaff | null
  setSelectedStaff: (staff: ManagerStaff | null) => void

  // Constants (useful for tabs/components)
  itemsPerPage: number
}

const ManagerDashboardContext = createContext<ManagerDashboardContextValue | undefined>(undefined)

export function ManagerDashboardProvider({ children }: PropsWithChildren) {
  const [activeTab, setActiveTab] = useState<ManagerDashboardTab>('staff')

  // Staff pagination
  const [staffPage, setStaffPage] = useState(1)

  // Staff dialogs
  const [addStaffDialogOpen, setAddStaffDialogOpen] = useState(false)
  const [editStaffDialogOpen, setEditStaffDialogOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<ManagerStaff | null>(null)

  const value = useMemo<ManagerDashboardContextValue>(
    () => ({
      activeTab,
      setActiveTab,
      staffPage,
      setStaffPage,
      addStaffDialogOpen,
      setAddStaffDialogOpen,
      editStaffDialogOpen,
      setEditStaffDialogOpen,
      selectedStaff,
      setSelectedStaff,
      itemsPerPage: ITEMS_PER_PAGE
    }),
    [
      activeTab,
      addStaffDialogOpen,
      editStaffDialogOpen,
      selectedStaff,
      staffPage
    ]
  )

  return <ManagerDashboardContext value={value}>{children}</ManagerDashboardContext>
}
export default ManagerDashboardContext
