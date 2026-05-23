import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CheckCircle,
  Clock,
  Loader2,
  Play,
  RefreshCcw,
  Search,
  TrendingUp
} from 'lucide-react'
import { toast } from 'react-toastify'
import Card from '@/components/ui/card/Card'
import Button from '@/components/ui/button/Button'
import PaginationBar from '@/components/ui/pagination/PaginationBar'
import { ManagerInvoiceApi } from '../../api/invoice-api'
import type { ManagerInvoiceItem } from '../../types/invoice-type'
import { TableSkeleton } from '@/components/ui/skeleton/TableSkeleton'

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

function toIsoDateTime(localValue: string): string | undefined {
  if (!localValue.trim()) return undefined
  const d = new Date(localValue)
  if (Number.isNaN(d.getTime())) return undefined
  return d.toISOString()
}

function invoiceStatusVisual(statusRaw: string): { label: string; amountClass: string } {
  const key = String(statusRaw).trim().toLowerCase()
  if (key === 'completed') {
    return { label: 'Đã thanh toán', amountClass: 'text-[#16a34a]' }
  }
  if (key === 'pending') {
    return { label: 'Chờ thanh toán', amountClass: 'text-[#d97706]' }
  }
  if (key === 'pendingrefund') {
    return { label: 'Quá hạn', amountClass: 'text-[#dc2626]' }
  }
  if (key === 'refunded') {
    return { label: 'Đã hoàn tiền', amountClass: 'text-[#3366CC]' }
  }
  return { label: statusRaw || '—', amountClass: 'text-gray-700' }
}

type InvoiceSortKey =
  | 'customerName'
  | 'email'
  | 'phone'
  | 'invoiceMethod'
  | 'startedDate'
  | 'endedDate'
  | 'total'
  | 'status'
type SortDir = 'asc' | 'desc'

function InvoiceSortHeader({
  label,
  columnKey,
  sortKey,
  sortDir,
  onSort
}: {
  label: string
  columnKey: InvoiceSortKey
  sortKey: InvoiceSortKey
  sortDir: SortDir
  onSort: (key: InvoiceSortKey) => void
}) {
  const active = sortKey === columnKey
  const Icon = !active ? ArrowUpDown : sortDir === 'asc' ? ArrowUp : ArrowDown
  return (
    <button
      type="button"
      onClick={() => onSort(columnKey)}
      className="inline-flex min-h-[44px] w-full items-center justify-center gap-1 px-2 py-2 font-semibold text-white transition-colors hover:bg-white/15"
    >
      <span>{label}</span>
      <Icon className={`h-3.5 w-3.5 shrink-0 ${active ? 'text-white' : 'text-white/70'}`} aria-hidden />
    </button>
  )
}

function statusSortRank(statusRaw: string): number {
  const key = String(statusRaw).trim().toLowerCase()
  if (key === 'pending') return 0
  if (key === 'pendingrefund') return 1
  if (key === 'completed') return 2
  if (key === 'refunded') return 3
  return 99
}

export default function InvoicesTab() {
  const [invoicePage, setInvoicePage] = useState(1)
  const [invoiceLoading, setInvoiceLoading] = useState(false)
  const [invoiceError, setInvoiceError] = useState<string | null>(null)
  const [allInvoices, setAllInvoices] = useState<ManagerInvoiceItem[]>([])
  const [statusFilter, setStatusFilter] = useState<InvoiceStatusFilter>('all')
  const [searchText, setSearchText] = useState('')
  const [sortKey, setSortKey] = useState<InvoiceSortKey>('customerName')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [exportingInvoiceId, setExportingInvoiceId] = useState<string | null>(null)
  const [simulating, setSimulating] = useState(false)
  const [simulateFrom, setSimulateFrom] = useState('')
  const [simulateTo, setSimulateTo] = useState('')

  const fetchInvoices = useCallback(async () => {
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
  }, [])

  const handleSimulateInvoices = async () => {
    setSimulating(true)
    try {
      const msg = await ManagerInvoiceApi.runInvoices({
        from: toIsoDateTime(simulateFrom),
        to: toIsoDateTime(simulateTo)
      })
      toast.success(msg)
      await fetchInvoices()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Không thể chạy giả lập hóa đơn.')
    } finally {
      setSimulating(false)
    }
  }

  const downloadInvoiceExport = async (invoice: ManagerInvoiceItem) => {
    setExportingInvoiceId(invoice.id)
    try {
      const blob = await ManagerInvoiceApi.exportInvoice(invoice.id)
      const type = blob.type || ''
      if (type.includes('json') || type.includes('text/html')) {
        const text = await blob.text()
        try {
          const j = JSON.parse(text) as { message?: string }
          toast.error(j.message ?? 'Không thể xuất hóa đơn.')
        } catch {
          toast.error('Không thể xuất hóa đơn.')
        }
        return
      }
      const safeBase = invoice.customerName.trim().replace(/[/\\?%*:|"<>]/g, '_') || 'hoa-don'
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${safeBase}_${invoice.id.slice(0, 8)}_invoice.xlsx`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Đã tải file hóa đơn.')
    } catch {
      toast.error('Không thể xuất hóa đơn. Vui lòng thử lại.')
    } finally {
      setExportingInvoiceId(null)
    }
  }

  useEffect(() => {
    void fetchInvoices()
  }, [fetchInvoices])

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
        invoice.customerName.toLowerCase().includes(keyword) ||
        invoice.customerEmail.toLowerCase().includes(keyword) ||
        invoice.customerPhoneNumber.toLowerCase().includes(keyword)
      )
    })
  }, [allInvoices, searchText, statusFilter])

  const sortedVisibleInvoices = useMemo(() => {
    const list = [...visibleInvoices]
    const dir = sortDir === 'asc' ? 1 : -1
    list.sort((a, b) => {
      let cmp = 0
      if (sortKey === 'customerName') {
        cmp = a.customerName.localeCompare(b.customerName, 'vi', { sensitivity: 'base' })
      } else if (sortKey === 'email') {
        cmp = a.customerEmail.localeCompare(b.customerEmail, 'vi', { sensitivity: 'base' })
      } else if (sortKey === 'phone') {
        cmp = a.customerPhoneNumber.localeCompare(b.customerPhoneNumber, 'vi', { sensitivity: 'base' })
      } else if (sortKey === 'invoiceMethod') {
        cmp = (a.invoiceMethod ?? '').localeCompare(b.invoiceMethod ?? '', 'vi', { sensitivity: 'base' })
      } else if (sortKey === 'startedDate') {
        cmp = new Date(a.startedDate).getTime() - new Date(b.startedDate).getTime()
      } else if (sortKey === 'endedDate') {
        cmp = new Date(a.endedDate).getTime() - new Date(b.endedDate).getTime()
      } else if (sortKey === 'total') {
        cmp = a.total - b.total
      } else {
        cmp = statusSortRank(a.invoiceStatus) - statusSortRank(b.invoiceStatus)
      }
      return cmp * dir
    })
    return list
  }, [visibleInvoices, sortKey, sortDir])

  const invoiceTotalPages = useMemo(
    () => Math.max(1, Math.ceil(sortedVisibleInvoices.length / INVOICE_PAGE_SIZE)),
    [sortedVisibleInvoices]
  )

  useEffect(() => {
    if (invoicePage > invoiceTotalPages) setInvoicePage(invoiceTotalPages)
  }, [invoicePage, invoiceTotalPages])

  const pagedInvoices = useMemo(() => {
    const start = (invoicePage - 1) * INVOICE_PAGE_SIZE
    return sortedVisibleInvoices.slice(start, start + INVOICE_PAGE_SIZE)
  }, [sortedVisibleInvoices, invoicePage])

  const toggleSort = (key: InvoiceSortKey) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        {invoiceError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {invoiceError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-6">
          <Card className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[12px] font-semibold uppercase tracking-wide text-gray-500 mb-1">Tổng tiền</p>
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
                <p className="text-[12px] font-semibold uppercase tracking-wide text-green-800/80 mb-1">Đã thanh toán</p>
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
                <p className="text-[12px] font-semibold uppercase tracking-wide text-amber-900/70 mb-1">Chờ thanh toán</p>
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
                <p className="text-[12px] font-semibold uppercase tracking-wide text-red-900/70 mb-1">Quá hạn</p>
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
                <p className="text-[12px] font-semibold uppercase tracking-wide text-[#1e40af]/80 mb-1">Đã hoàn tiền</p>
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
              placeholder="Tìm theo mã hóa đơn, tên, email, SĐT hoặc mã khách hàng..."
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
                  disabled={invoiceLoading || simulating}
                >
                  {filter.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <h2 className="text-sm-title-desktop font-semibold text-primary">Danh sách chi tiết hóa đơn</h2>
            <p className="mt-1 text-sm-body-desktop text-soft-gray">Quản lý hóa đơn tổng hợp đơn hàng cho khách hàng</p>
          </div>

          <div className="flex w-full flex-col gap-2 rounded-xl border border-dashed border-[#3366CC]/40 bg-[#EAF3FF]/40 p-3 sm:flex-row sm:flex-wrap sm:items-end lg:w-auto lg:shrink-0">
            <div className="flex min-w-[160px] flex-1 flex-col gap-1 sm:max-w-[220px]">
              <label htmlFor="simulate-from" className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              Từ (tùy chọn)
              </label>
              <input
                id="simulate-from"
                type="datetime-local"
                value={simulateFrom}
                onChange={(e) => setSimulateFrom(e.target.value)}
                disabled={simulating || invoiceLoading}
                className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-[#003366] outline-none focus:border-[#3366CC] focus:ring-2 focus:ring-[#3366CC]/15 disabled:opacity-60"
              />
            </div>
            <div className="flex min-w-[160px] flex-1 flex-col gap-1 sm:max-w-[220px]">
              <label htmlFor="simulate-to" className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              Đến (tùy chọn)
              </label>
              <input
                id="simulate-to"
                type="datetime-local"
                value={simulateTo}
                onChange={(e) => setSimulateTo(e.target.value)}
                disabled={simulating || invoiceLoading}
                className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-[#003366] outline-none focus:border-[#3366CC] focus:ring-2 focus:ring-[#3366CC]/15 disabled:opacity-60"
              />
            </div>
            <Button
              type="button"
              className="h-10 shrink-0 bg-[#3366CC] px-5 text-white hover:bg-[#2952A3]"
              disabled={simulating || invoiceLoading}
              onClick={() => void handleSimulateInvoices()}
            >
              {simulating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
            Tạo thanh toán
            </Button>
          </div>
        </div>
        { invoiceLoading ?
          <TableSkeleton numberOfColumn={10}/>
          :
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full min-w-[1040px] border-collapse font-sans text-sm">
              <thead>
                <tr className="bg-secondary">
                  <th className="w-14 border border-gray-200 px-2 py-2 text-center font-semibold text-white">STT</th>
                  <th className="min-w-[140px] border border-gray-200 p-0 align-middle">
                    <InvoiceSortHeader
                      label="Tên khách hàng"
                      columnKey="customerName"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={toggleSort}
                    />
                  </th>
                  <th className="min-w-[180px] border border-gray-200 p-0 align-middle">
                    <InvoiceSortHeader label="Email" columnKey="email" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                  </th>
                  <th className="min-w-[120px] border border-gray-200 p-0 align-middle">
                    <InvoiceSortHeader label="SĐT" columnKey="phone" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                  </th>
                  <th className="min-w-[120px] border border-gray-200 p-0 align-middle">
                    <InvoiceSortHeader
                      label="Phương thức"
                      columnKey="invoiceMethod"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={toggleSort}
                    />
                  </th>
                  <th className="min-w-[110px] border border-gray-200 p-0 align-middle">
                    <InvoiceSortHeader
                      label="Bắt đầu"
                      columnKey="startedDate"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={toggleSort}
                    />
                  </th>
                  <th className="min-w-[110px] border border-gray-200 p-0 align-middle">
                    <InvoiceSortHeader
                      label="Kết thúc"
                      columnKey="endedDate"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={toggleSort}
                    />
                  </th>
                  <th className="min-w-[130px] border border-gray-200 p-0 align-middle">
                    <InvoiceSortHeader
                      label="Tổng hóa đơn"
                      columnKey="total"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={toggleSort}
                    />
                  </th>
                  <th className="min-w-[130px] border border-gray-200 p-0 align-middle">
                    <InvoiceSortHeader
                      label="Trạng thái"
                      columnKey="status"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={toggleSort}
                    />
                  </th>
                  <th className="min-w-[110px] border border-gray-200 px-2 py-2 text-center font-semibold text-white">
                  Xuất đơn
                  </th>
                </tr>
              </thead>
              <tbody>
                {!invoiceLoading && visibleInvoices.length === 0 && (
                  <tr>
                    <td colSpan={10} className="border border-gray-200 bg-gray-50 px-3 py-10 text-center text-gray-600">
                    Chưa có dữ liệu hóa đơn.
                    </td>
                  </tr>
                )}
                {!invoiceLoading &&
                pagedInvoices.map((invoice, index) => {
                  const visual = invoiceStatusVisual(invoice.invoiceStatus)
                  const stt = (invoicePage - 1) * INVOICE_PAGE_SIZE + index + 1
                  return (
                    <tr key={invoice.id} className="hover:bg-gray-50/80">
                      <td className="border border-gray-200 px-2 py-[28px] text-center text-gray-900">{stt}</td>
                      <td className="border border-gray-200 px-3 py-[28px] font-medium text-gray-900">{invoice.customerName}</td>
                      <td className="max-w-[220px] truncate border border-gray-200 px-3 py-[28px] text-gray-800" title={invoice.customerEmail}>
                        {invoice.customerEmail || '—'}
                      </td>
                      <td className="border border-gray-200 px-3 py-[28px] tabular-nums text-gray-800">{invoice.customerPhoneNumber || '—'}</td>
                      <td className="border border-gray-200 px-3 py-[28px] text-gray-800">{invoice.invoiceMethod || '—'}</td>
                      <td className="border border-gray-200 px-3 py-[28px] text-center tabular-nums text-[#003366]">
                        {formatDateShort(invoice.startedDate)}
                      </td>
                      <td className="border border-gray-200 px-3 py-[28px] text-center tabular-nums text-[#003366]">
                        {formatDateShort(invoice.endedDate)}
                      </td>
                      <td className={`border border-gray-200 px-3 py-[28px] text-right font-semibold tabular-nums ${visual.amountClass}`}>
                        {formatMoney(invoice.total)}
                      </td>
                      <td className={`border border-gray-200 px-3 py-[28px] text-center font-semibold ${visual.amountClass}`}>
                        {visual.label}
                      </td>
                      <td className="border border-gray-200 px-3 py-[28px] text-center">
                        <button
                          type="button"
                          disabled={exportingInvoiceId === invoice.id}
                          className="font-medium text-[#3366CC] underline underline-offset-2 hover:text-[#003366] disabled:cursor-not-allowed disabled:opacity-50"
                          onClick={() => void downloadInvoiceExport(invoice)}
                        >
                          {exportingInvoiceId === invoice.id ? 'Đang tải…' : 'Xuất hóa đơn'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

        }

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
