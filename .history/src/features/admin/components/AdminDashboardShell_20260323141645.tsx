import type { PropsWithChildren } from 'react'

export default function AdminDashboardShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen max-h-[130vh] bg-[#F5F7FA] px-30">
      <div className="p-6">
        <div className="w-full mx-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

