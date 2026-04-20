import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, CheckCircle, Clock, Search, TrendingUp } from 'lucide-react'
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

function invoiceStatusUi(statusRaw: string): { label: string; className: string } {
  const key = String(statusRaw).trim().toLowerCase()
  if (key === 'completed') return { label: 'Đã thanh toán', className: 'bg-[#26C271] text-white' }
  if (key === 'pending') return { label: 'Chờ thanh toán', className: 'bg-[#F59E0B] text-white' }
  if (key === 'pendingrefund') return { label: 'Quá hạn', className: 'bg-[#EF4444] text-white' }
  if (key === 'refunded') return { label: 'Đã hoàn tiền', className: 'bg-[#3366CC] text-white' }
  return { label: statusRaw || '—', className: 'bg-gray-400 text-white' }
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
          <h2 className="text-[#003366] text-2xl font-semibold">Hóa đơn</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý hóa đơn tổng hợp đơn hàng cho khách hàng  </p>
        </div>
        {invoiceError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {invoiceError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1 uppercase">Tổng tiền</p>
                <p className="text-3xl font-bold text-[#003366]">{formatKpiMoney(totalRevenue)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-slate-500" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1 uppercase">Đã thanh toán</p>
                <p className="text-3xl font-bold text-[#1f9d62]">{formatKpiMoney(totalPaid)}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-[#2ECC71]/60" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1 uppercase">Chờ thanh toán</p>
                <p className="text-3xl font-bold text-[#d97706]">{formatKpiMoney(totalPending)}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500/60" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1 uppercase">Quá hạn</p>
                <p className="text-3xl font-bold text-[#dc2626]">{formatKpiMoney(totalOverdue)}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500/60" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-[#EAF3FF] to-[#DCEBFF] border-[#BFD8FF]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1 uppercase">Đã hoàn tiền</p>
                <p className="text-3xl font-bold text-[#003366]">{formatKpiMoney(totalRefunded)}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-[#3366CC]/60" />
            </div>
          </Card>
        </div>

        <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-xl">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Tìm theo mã hóa đơn, tên hoặc mã khách hàng..."
              className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-[#003366] outline-none focus:border-[#3366CC]"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {INVOICE_STATUS_FILTERS.map((filter) => {
              const isActive = statusFilter === filter.value
              return (
                <button
                  key={filter.value}
                  type="button"
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors ${
                    isActive
                      ? 'bg-[#3366CC] text-white border-[#3366CC]'
                      : 'bg-white text-[#003366] border-gray-200 hover:border-[#3366CC]/40'
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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {!invoiceLoading && visibleInvoices.length === 0 && (
            <div className="col-span-full rounded-md border border-gray-200 bg-gray-50 px-3 py-8 text-center text-sm text-gray-600">
              Chưa có dữ liệu hóa đơn.
            </div>
          )}
          {pagedInvoices.map((invoice) => {
            const statusUi = invoiceStatusUi(invoice.invoiceStatus)
            return (
              <Card key={invoice.id} className="p-4 hover:shadow-md transition-shadow flex flex-col h-full border-t-4 border-t-[#3366CC]">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-[#003366] line-clamp-1">{invoice.customerName}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{invoice.customerEmail || invoice.customerPhoneNumber || '—'}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusUi.className}`}>{statusUi.label}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-500">Phương thức</span>
                    <span className="font-medium text-[#003366]">{invoice.invoiceMethod || '—'}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-500">Bắt đầu</span>
                    <span className="font-medium text-[#003366]">{formatDateShort(invoice.startedDate)}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-500">Kết thúc</span>
                    <span className="font-medium text-[#003366]">{formatDateShort(invoice.endedDate)}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-500">Tổng hóa đơn</span>
                    <span className="font-semibold text-[#16a34a]">{formatMoney(invoice.total)}</span>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="mt-6">
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
