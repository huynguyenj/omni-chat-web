import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, CheckCircle, Clock, RefreshCcw, Search, TrendingUp } from 'lucide-react'
import Card from '@/components/ui/card/Card'
import PaginationBar from '@/components/ui/pagination/PaginationBar'
import { ManagerInvoiceApi } from '../../api/invoice-api'
import type { ManagerInvoiceItem } from '../../types/invoice-type'

const INVOICE_PAGE_SIZE = 10
type InvoiceStatusFilter = 'all' | 'Pending' | 'Completed' | 'PendingRefund' | 'Refunded'

const INVOICE_STATUS_FILTERS: Array<{ value: InvoiceStatusFilter; label: string }> = [
  { value: 'all', label: 'Tất cả' },
  { value: 'Pending', label: 'Chờ thanh toán' },
  { value: 'Completed', label: 'Đã thanh toán' },
  { value: 'PendingRefund', label: 'Quá hạn' },
  { value: 'Refunded', label: 'Đã hoàn tiền' }
]

function normalizeInvoice(raw: unknown): ManagerInvoiceItem {
  const item = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  return {
    id: String(item.id ?? ''),
    customerId: String(item.customerId ?? ''),
    customerName: String(item.customerName ?? 'Khách hàng'),
    customerPhoneNumber: String(item.customerPhoneNumber ?? ''),
    customerEmail: String(item.customerEmail ?? ''),
    customerAddress: String(item.customerAddress ?? ''),
    startedDate: String(item.startedDate ?? ''),
    endedDate: String(item.endedDate ?? ''),
    total: Number(item.total ?? 0),
    invoiceStatus: String(item.invoiceStatus ?? ''),
    invoiceMethod: String(item.invoiceMethod ?? ''),
    completedDate: item.completedDate == null ? null : String(item.completedDate),
    paidAmount: Number(item.paidAmount ?? 0),
    deductedAmount: Number(item.deductedAmount ?? 0)
  }
}

function formatMoney(n: number) {
  return `${n.toLocaleString('vi-VN')}đ`
}

function formatKpiMoney(n: number) {
  if (n === 0) return '0 VNĐ'
  return `${Math.round(n / 1000).toLocaleString('vi-VN')}K VNĐ`
}

function formatDateShort(iso: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('vi-VN')
}

function invoiceStatusVisual(statusRaw: string): {
  label: string
  badgeClass: string
  borderTopClass: string
  amountClass: string
} {
  const key = String(statusRaw).trim().toLowerCase()
  if (key === 'completed') {
    return {
      label: 'Đã thanh toán',
      badgeClass: 'bg-[#26C271] text-white',
      borderTopClass: 'border-t-4 border-t-[#26C271]',
      amountClass: 'text-[#16a34a]'
    }
  }
  if (key === 'pending') {
    return {
      label: 'Chờ thanh toán',
      badgeClass: 'bg-[#F59E0B] text-white',
      borderTopClass: 'border-t-4 border-t-[#F59E0B]',
      amountClass: 'text-[#d97706]'
    }
  }
  if (key === 'pendingrefund') {
    return {
      label: 'Quá hạn',
      badgeClass: 'bg-[#EF4444] text-white',
      borderTopClass: 'border-t-4 border-t-[#EF4444]',
      amountClass: 'text-[#dc2626]'
    }
  }
  if (key === 'refunded') {
    return {
      label: 'Đã hoàn tiền',
      badgeClass: 'bg-[#3366CC] text-white',
      borderTopClass: 'border-t-4 border-t-[#3366CC]',
      amountClass: 'text-[#3366CC]'
    }
  }
  return {
    label: statusRaw || '—',
    badgeClass: 'bg-gray-400 text-white',
    borderTopClass: 'border-t-4 border-t-gray-400',
    amountClass: 'text-gray-700'
  }
}

function customerInitial(name: string) {
  const t = name.trim()
  if (!t) return '?'
  return t.charAt(0).toUpperCase()
}

export default function InvoicesTab() {
  const [invoicePage, setInvoicePage] = useState(1)
  const [invoiceLoading, setInvoiceLoading] = useState(false)
  const [invoiceError, setInvoiceError] = useState<string | null>(null)
  const [allInvoices, setAllInvoices] = useState<ManagerInvoiceItem[]>([])
  const [statusFilter, setStatusFilter] = useState<InvoiceStatusFilter>('all')
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    const fetchInvoices = async () => {
      setInvoiceLoading(true)
      setInvoiceError(null)
      try {
        const mergedItems: ManagerInvoiceItem[] = []
        let pageNumber = 1
        let totalPages = 1

        while (pageNumber <= totalPages) {
          const response = await ManagerInvoiceApi.getInvoices({
            pageNumber,
            pageSize: 100,
            sortBy: 'startedDate',
            descending: true
          })
          const body = response
          if (body.is_success === false || body.data == null) {
            throw new Error(body.message || 'Không thể tải danh sách hóa đơn.')
          }
          const items = Array.isArray(body.data.items) ? body.data.items.map((item) => normalizeInvoice(item)) : []
          mergedItems.push(...items)
          totalPages = Math.max(1, Number(body.data.meta?.total_pages ?? 1))
          pageNumber += 1
        }

        setAllInvoices(mergedItems)
      } catch {
        setInvoiceError('Không thể tải danh sách hóa đơn.')
        setAllInvoices([])
      } finally {
        setInvoiceLoading(false)
      }
    }
    void fetchInvoices()
  }, [])

  useEffect(() => {
    setInvoicePage(1)
  }, [statusFilter, searchText])

  const totalRevenue = useMemo(
    () => allInvoices.reduce((sum, invoice) => sum + invoice.total, 0),
    [allInvoices]
  )
  const totalPaid = useMemo(() => {
    return allInvoices.reduce((sum, invoice) => {
      const status = String(invoice.invoiceStatus).toLowerCase()
      if (status !== 'completed') return sum

      // Some API responses (especially "all" status) return paidAmount as 0.
      // Fallback to invoice total so paid KPI remains accurate for completed invoices.
      const paidAmount = Number(invoice.paidAmount ?? 0)
      const totalAmount = Number(invoice.total ?? 0)
      const safePaid = paidAmount > 0 ? paidAmount : totalAmount
      return sum + safePaid
    }, 0)
  }, [allInvoices])
  const totalPending = useMemo(
    () => allInvoices.filter((invoice) => String(invoice.invoiceStatus).toLowerCase() === 'pending').reduce((sum, invoice) => sum + invoice.total, 0),
    [allInvoices]
  )
  const totalOverdue = useMemo(
    () => allInvoices.filter((invoice) => String(invoice.invoiceStatus).toLowerCase() === 'pendingrefund').reduce((sum, invoice) => sum + invoice.total, 0),
    [allInvoices]
  )
  const totalRefunded = useMemo(
    () => allInvoices.filter((invoice) => String(invoice.invoiceStatus).toLowerCase() === 'refunded').reduce((sum, invoice) => sum + invoice.total, 0),
    [allInvoices]
  )
  const visibleInvoices = useMemo(() => {
    const byStatus = statusFilter === 'all'
      ? allInvoices
      : allInvoices.filter((invoice) => String(invoice.invoiceStatus).toLowerCase() === statusFilter.toLowerCase())
    const keyword = searchText.trim().toLowerCase()
    if (!keyword) return byStatus
    return byStatus.filter((invoice) => {
      return (
        invoice.id.toLowerCase().includes(keyword) ||
        invoice.customerId.toLowerCase().includes(keyword) ||
        invoice.customerName.toLowerCase().includes(keyword)
      )
    })
  }, [allInvoices, searchText, statusFilter])

  const invoiceTotalPages = useMemo(
    () => Math.max(1, Math.ceil(visibleInvoices.length / INVOICE_PAGE_SIZE)),
    [visibleInvoices]
  )

  useEffect(() => {
    if (invoicePage > invoiceTotalPages) setInvoicePage(invoiceTotalPages)
  }, [invoicePage, invoiceTotalPages])

  const pagedInvoices = useMemo(() => {
    const start = (invoicePage - 1) * INVOICE_PAGE_SIZE
    return visibleInvoices.slice(start, start + INVOICE_PAGE_SIZE)
  }, [visibleInvoices, invoicePage])

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-[#003366] text-2xl font-bold tracking-tight">Hóa đơn</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý hóa đơn tổng hợp đơn hàng cho khách hàng</p>
        </div>
        {invoiceError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {invoiceError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-6">
          <Card className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1">Tổng tiền</p>
                <p className="text-2xl font-bold tabular-nums text-[#003366] sm:text-3xl">{formatKpiMoney(totalRevenue)}</p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
                <TrendingUp className="h-6 w-6" aria-hidden />
              </div>
            </div>
          </Card>
          <Card className="rounded-2xl border border-green-100 bg-green-50/80 p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-green-800/80 mb-1">Đã thanh toán</p>
                <p className="text-2xl font-bold tabular-nums text-[#15803d] sm:text-3xl">{formatKpiMoney(totalPaid)}</p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#22c55e] shadow-sm">
                <CheckCircle className="h-6 w-6" aria-hidden />
              </div>
            </div>
          </Card>
          <Card className="rounded-2xl border border-amber-100 bg-amber-50/80 p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-900/70 mb-1">Chờ thanh toán</p>
                <p className="text-2xl font-bold tabular-nums text-[#b45309] sm:text-3xl">{formatKpiMoney(totalPending)}</p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-amber-500 shadow-sm">
                <Clock className="h-6 w-6" aria-hidden />
              </div>
            </div>
          </Card>
          <Card className="rounded-2xl border border-red-100 bg-red-50/80 p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-red-900/70 mb-1">Quá hạn</p>
                <p className="text-2xl font-bold tabular-nums text-[#b91c1c] sm:text-3xl">{formatKpiMoney(totalOverdue)}</p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-red-500 shadow-sm">
                <AlertCircle className="h-6 w-6" aria-hidden />
              </div>
            </div>
          </Card>
          <Card className="rounded-2xl border border-[#BFDBFE] bg-[#EFF6FF] p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#1e40af]/80 mb-1">Đã hoàn tiền</p>
                <p className="text-2xl font-bold tabular-nums text-[#1d4ed8] sm:text-3xl">{formatKpiMoney(totalRefunded)}</p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#3366CC] shadow-sm">
                <RefreshCcw className="h-5 w-5" aria-hidden />
              </div>
            </div>
          </Card>
        </div>

        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-2xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Tìm theo mã hóa đơn, tên hoặc mã khách hàng..."
              className="h-11 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-[#003366] outline-none transition-colors placeholder:text-gray-400 focus:border-[#3366CC] focus:bg-white focus:ring-2 focus:ring-[#3366CC]/15"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {INVOICE_STATUS_FILTERS.map((filter) => {
              const isActive = statusFilter === filter.value
              return (
                <button
                  key={filter.value}
                  type="button"
                  className={`rounded-xl px-3.5 py-2 text-xs font-semibold border transition-colors ${
                    isActive
                      ? 'bg-[#3366CC] text-white border-[#3366CC] shadow-sm'
                      : 'bg-white text-[#003366] border-gray-200 hover:border-[#3366CC]/50 hover:bg-gray-50'
                  }`}
                  onClick={() => setStatusFilter(filter.value)}
                  disabled={invoiceLoading}
                >
                  {filter.label}
                </button>
              )
            })}
          </div>
        </div>

        {invoiceLoading && (
          <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
            Đang tải danh sách hóa đơn...
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {!invoiceLoading && visibleInvoices.length === 0 && (
            <div className="col-span-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-10 text-center text-sm text-gray-600">
              Chưa có dữ liệu hóa đơn.
            </div>
          )}
          {pagedInvoices.map((invoice) => {
            const visual = invoiceStatusVisual(invoice.invoiceStatus)
            return (
              <Card
                key={invoice.id}
                className={`flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 border-t-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${visual.borderTopClass}`}
              >
                <div className="mb-4 flex items-start gap-3">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E8F0FC] text-sm font-bold text-[#3366CC]"
                    aria-hidden
                  >
                    {customerInitial(invoice.customerName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[#003366] line-clamp-1">{invoice.customerName}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{invoice.customerEmail || invoice.customerPhoneNumber || '—'}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${visual.badgeClass}`}>
                    {visual.label}
                  </span>
                </div>
                <div className="mt-auto space-y-2.5 text-sm">
                  <div className="flex justify-between gap-2 border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Phương thức</span>
                    <span className="text-right font-medium text-[#003366]">{invoice.invoiceMethod || '—'}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-500">Bắt đầu</span>
                    <span className="font-medium text-[#003366] tabular-nums">{formatDateShort(invoice.startedDate)}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-500">Kết thúc</span>
                    <span className="font-medium text-[#003366] tabular-nums">{formatDateShort(invoice.endedDate)}</span>
                  </div>
                  <div className="flex justify-between gap-2 pt-1">
                    <span className="text-gray-500">Tổng hóa đơn</span>
                    <span className={`font-bold tabular-nums ${visual.amountClass}`}>{formatMoney(invoice.total)}</span>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="mt-8 space-y-4">
          <p className="text-center text-sm font-medium text-gray-600">
            Trang {invoicePage} / {invoiceTotalPages}
          </p>
          <PaginationBar
            currentPage={invoicePage}
            setPage={setInvoicePage}
            totalPage={invoiceTotalPages}
          />
        </div>
      </Card>
    </div>
  )
}
