import type { PropsWithChildren } from 'react'

export default function ManagerDashboardShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen max-h-[130vh] bg-[#F5F7FA] py-2 px-30">
      <div className="p-6">
        <div className="w-full mx-auto">{children}</div>
      </div>
    </div>
  )
}

