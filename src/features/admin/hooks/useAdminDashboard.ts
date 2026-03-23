import { useContext } from 'react'
import { AdminDashboardContext } from '../context/AdminDashboardProvider'

export function useAdminDashboard() {
  const ctx = useContext(AdminDashboardContext)
  // Enforce provider usage so consumers don't silently read `undefined`.
  if (!ctx) throw new Error('useAdminDashboard must be used within AdminDashboardProvider')
  return ctx
}

