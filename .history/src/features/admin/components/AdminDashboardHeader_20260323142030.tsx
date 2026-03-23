import { Calendar as CalendarIcon } from 'lucide-react'
import { useAdminDashboard } from '../hooks/useAdminDashboard'
import { fromDateInputValue, toDateInputValue } from '../utils/date'
import Input from '@/components/ui/input/Input'

export default function AdminDashboardHeader() {
  const { dateFrom, dateTo, setDateFrom, setDateTo } = useAdminDashboard()
  const openNativeDatePicker = (input: HTMLInputElement) => {
    // Chromium supports showPicker(); fallback keeps normal date input behavior.
    ;(input as HTMLInputElement & { showPicker?: () => void }).showPicker?.()
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-primary text-m-title-desktop font-bold">Admin Dashboard</h1>
        <p className="text-m-body-desktop mt-1">Tổng quan hệ thống OmniChat</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            {/* <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3366CC] pointer-events-none" /> */}
            <Input
              variant='gray'
              type="date"
              value={toDateInputValue(dateFrom)}
              onChange={(e) => setDateFrom(fromDateInputValue(e.target.value))}
              onClick={(e) => openNativeDatePicker(e.currentTarget)}
              onFocus={(e) => openNativeDatePicker(e.currentTarget)}
              className="bg-white border border-border-primary"
            />
          </div>
          <span className="text-gray-500">-</span>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3366CC] pointer-events-none" />
            <Input
              variant='gray'
              type="date"
              value={toDateInputValue(dateTo)}
              onChange={(e) => setDateTo(fromDateInputValue(e.target.value))}
              onClick={(e) => openNativeDatePicker(e.currentTarget)}
              onFocus={(e) => openNativeDatePicker(e.currentTarget)}
              className="b"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

