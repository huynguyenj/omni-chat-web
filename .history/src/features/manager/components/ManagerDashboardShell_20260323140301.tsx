import type { PropsWithChildren } from 'react'

export default function ManagerDashboardShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-[#F5F7FA] w-full">
      <div className="p-6">
        <div className="w-full mx-auto">{children}</div>
      </div>
    </div>
  )
}

