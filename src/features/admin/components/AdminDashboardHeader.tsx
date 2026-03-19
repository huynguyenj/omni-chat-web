import Button from '@/components/ui/button/Button'
import { Calendar as CalendarIcon } from 'lucide-react'
import { useAdminDashboard } from '../hooks/useAdminDashboard'
import { formatDateVi } from '../utils/date'

export default function AdminDashboardHeader() {
  const { dateFrom, dateTo } = useAdminDashboard()

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-[#003366] text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-[#2F3542] mt-1">Tổng quan hệ thống OmniChat</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" className="w-[140px] justify-start text-left font-normal" type="button">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateVi(dateFrom)}
          </Button>
          <span className="text-gray-500">-</span>
          <Button variant="outline" className="w-[140px] justify-start text-left font-normal" type="button">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateVi(dateTo)}
          </Button>
        </div>
      </div>
    </div>
  )
}

