import { useContext } from 'react'

export function useManagerDashboard() {
  const ctx = useContext(ManagerDashboardContext)
  if (!ctx) throw new Error('useManagerDashboard must be used within ManagerDashboardProvider')
  return ctx
}

