import type { PropsWithChildren } from 'react'

export default function ManagerDashboardShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  )
}

