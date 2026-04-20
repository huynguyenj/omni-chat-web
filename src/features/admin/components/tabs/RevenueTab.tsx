import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import Button from '@/components/ui/button/Button'
import Card from '@/components/ui/card/Card'
import { REVENUE_ORDERS } from '@/components/admin/admin-dashboard-data'
import { CheckCircle, Clock, DollarSign, TrendingDown, TrendingUp, Users, RotateCcw, X, XCircle } from 'lucide-react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { toast } from 'react-toastify'
import { isAxiosError } from 'axios'
import type { ManagerOrderStatusFilter } from '../../../manager/types/order-type'
import { OrderApi } from '../../api/order-api'
import type { AdminOrderDetail, AdminOrderItem, OrderDashboardMonthRow } from '../../types/order-type'
import { InvoiceApi } from '../../api/invoice-api'
import type { TotalRevenue } from '../../types/invoice-type'

function ModalShell({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onMouseDown={onClose}>
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onMouseDown={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

function mapApiOrderItem(raw: unknown): AdminOrderItem {
  const o = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  const customer = o.customer && typeof o.customer === 'object' ? (o.customer as Record<string, unknown>) : {}
  return {
    id: String(o.id ?? ''),
    customerId: String(o.customerId ?? o.customer_id ?? ''),
    customerName: readString(o, ['customerName', 'customer_name', 'nameCustomer', 'customerFullName']) ?? readString(customer, ['name', 'fullName']),
    orderDate: String(o.orderDate ?? o.order_date ?? ''),
    name: String(o.name ?? ''),
    status: String(o.status ?? ''),
    totalAmount: Number(o.totalAmount ?? o.total_amount ?? 0),
    deliveryStatus: String(o.deliveryStatus ?? o.delivery_status ?? ''),
    code: String(o.code ?? '')
  }
}

function readString(source: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = source[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return undefined
}

function mapApiOrderDetail(raw: unknown): AdminOrderDetail {
  const o = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  const customer = o.customer && typeof o.customer === 'object' ? (o.customer as Record<string, unknown>) : {}
  const orderItemsRaw = Array.isArray(o.orderItems) ? o.orderItems : []

  return {
    id: String(o.id ?? ''),
    customerId: String(o.customerId ?? o.customer_id ?? ''),
    customerName: readString(o, ['customerName', 'customer_name', 'nameCustomer', 'customerFullName']) ?? readString(customer, ['name', 'fullName']),
    customerPhone: readString(o, ['customerPhone', 'customer_phone', 'customerPhoneNumber', 'phone', 'phoneNumber']) ?? readString(customer, ['phone', 'phoneNumber', 'customerPhoneNumber']),
    customerEmail: readString(o, ['customerEmail', 'customer_email', 'email']) ?? readString(customer, ['email']),
    customerAddress: readString(o, ['customerAddress', 'customer_address', 'address', 'shippingAddress']) ?? readString(customer, ['address', 'shippingAddress']),
    orderDate: String(o.orderDate ?? o.order_date ?? ''),
    name: String(o.name ?? ''),
    status: String(o.status ?? ''),
    totalAmount: Number(o.totalAmount ?? o.total_amount ?? 0),
    deliveryStatus: String(o.deliveryStatus ?? o.delivery_status ?? ''),
    code: String(o.code ?? ''),
    orderItems: orderItemsRaw.map((itemRaw) => {
      const item = itemRaw && typeof itemRaw === 'object' ? (itemRaw as Record<string, unknown>) : {}
      return {
        id: String(item.id ?? ''),
        quantity: Number(item.quantity ?? 0),
        productName: String(item.productName ?? item.product_name ?? ''),
        itemsPrice: typeof item.itemsPrice === 'number' ? item.itemsPrice : null
      }
    })
  }
}

function extractOrderItemsFromResponse(response: unknown): unknown[] {
  if (Array.isArray(response)) return response
  const r = response && typeof response === 'object' ? (response as Record<string, unknown>) : {}
  if (Array.isArray(r.items)) return r.items
  if (Array.isArray(r.data)) return r.data
  const data = r.data && typeof r.data === 'object' ? (r.data as Record<string, unknown>) : {}
  if (Array.isArray(data.items)) return data.items
  if (Array.isArray(data.data)) return data.data
  return []
}

function isApiSuccessLike(response: unknown): boolean {
  const r = response && typeof response === 'object' ? (response as Record<string, unknown>) : {}
  if (typeof r.is_success === 'boolean') return r.is_success
  if (typeof r.isSuccess === 'boolean') return r.isSuccess
  return Number(r.status_code ?? r.statusCode ?? 0) === 200
}

function normalizeRevenueRows(raw: unknown): TotalRevenue[] {
  if (!Array.isArray(raw)) return []
  return raw.map((item) => {
    const row = item && typeof item === 'object' ? (item as Record<string, unknown>) : {}
    return {
      month: String(row.month ?? row.Month ?? ''),
      totalAmount: Number(row.totalAmount ?? row.total_amount ?? row.totalamount ?? 0)
    }
  })
}

function extractRevenueRowsFromResponse(response: unknown): TotalRevenue[] {
  const fromRawArray = normalizeRevenueRows(response)
  if (fromRawArray.length > 0) return fromRawArray

  const r = response && typeof response === 'object' ? (response as Record<string, unknown>) : {}
  const direct = normalizeRevenueRows(r.data)
  if (direct.length > 0) return direct

  const fromItems = normalizeRevenueRows(r.items)
  if (fromItems.length > 0) return fromItems

  const nestedData = r.data && typeof r.data === 'object' ? (r.data as Record<string, unknown>) : {}
  const nestedItems = normalizeRevenueRows(nestedData.items)
  if (nestedItems.length > 0) return nestedItems
  const nestedArray = normalizeRevenueRows(nestedData.data)
  if (nestedArray.length > 0) return nestedArray
  return []
}

type RevenueOrderStatusFilter = 'all' | 'InDelivery' | ManagerOrderStatusFilter

/** Hiển thị trạng thái đơn (API thường trả tiếng Anh) — pill + viền card */
/** Lọc đơn theo status API (chuỗi như Draft, Completed, …) */
function revenueOrderMatchesStatus(filter: RevenueOrderStatusFilter, apiStatus: string): boolean {
  if (filter === 'all') return true
  if (filter === 'InDelivery') {
    const s = apiStatus.trim().toLowerCase()
    return s === 'pending' || s === 'shipped'
  }
  return apiStatus.trim().toLowerCase() === filter.toLowerCase()
}

const REVENUE_ORDER_STATUS_FILTERS: Array<{ value: RevenueOrderStatusFilter; label: string }> = [
  { value: 'all', label: 'Tất cả' },
  { value: 'InDelivery', label: 'Đang giao' },
  { value: 'Draft', label: 'Đợi duyệt' },
  { value: 'Completed', label: 'Hoàn thành' },
  { value: 'Cancelled', label: 'Đã hủy' },
  { value: 'PendingReturn', label: 'Chờ trả hàng' },
  { value: 'Returned', label: 'Đã trả' },
  { value: 'ReturnedDefective', label: 'Xã hàng lỗi' }
]

function adminOrderStatusUi(statusRaw: string): { labelVi: string; pillClass: string; cardBorderClass: string } {
  const normalized = String(statusRaw).trim().toLowerCase().replace(/\s+/g, '')

  const rows: Array<{ match: string; labelVi: string; pillClass: string; cardBorderClass: string }> = [
    { match: 'draft', labelVi: 'Đợi duyệt', pillClass: 'bg-gray-500 text-white', cardBorderClass: 'border-t-gray-500' },
    { match: 'pending', labelVi: 'Chờ xử lý', pillClass: 'bg-amber-500 text-white', cardBorderClass: 'border-t-amber-500' },
    { match: 'shipped', labelVi: 'Đang giao', pillClass: 'bg-[#3366CC] text-white', cardBorderClass: 'border-t-[#3366CC]' },
    { match: 'completed', labelVi: 'Hoàn thành', pillClass: 'bg-[#26C271] text-white', cardBorderClass: 'border-t-[#26C271]' },
    { match: 'cancelled', labelVi: 'Đã hủy', pillClass: 'bg-[#FB2C36] text-white', cardBorderClass: 'border-t-[#FB2C36]' },
    { match: 'pendingreturn', labelVi: 'Chờ trả hàng', pillClass: 'bg-[#FF9800] text-white', cardBorderClass: 'border-t-[#FF9800]' },
    { match: 'returned', labelVi: 'Đã trả', pillClass: 'bg-slate-600 text-white', cardBorderClass: 'border-t-slate-600' },
    { match: 'returneddefective', labelVi: 'Xã hàng lỗi', pillClass: 'bg-amber-800 text-white', cardBorderClass: 'border-t-amber-800' }
  ]

  const hit = rows.find((r) => r.match === normalized)
  if (hit) {
    return { labelVi: hit.labelVi, pillClass: hit.pillClass, cardBorderClass: hit.cardBorderClass }
  }

  const raw = String(statusRaw).trim()
  return {
    labelVi: raw || '—',
    pillClass: 'bg-slate-400 text-white',
    cardBorderClass: 'border-t-slate-400'
  }
}

function extractOrderDashboardRowsFromResponse(response: unknown): OrderDashboardMonthRow[] {
  if (Array.isArray(response)) return response as OrderDashboardMonthRow[]

  const r = response && typeof response === 'object' ? (response as Record<string, unknown>) : {}
  if (Array.isArray(r.data)) return r.data as OrderDashboardMonthRow[]
  if (Array.isArray(r.items)) return r.items as OrderDashboardMonthRow[]

  const data = r.data && typeof r.data === 'object' ? (r.data as Record<string, unknown>) : {}
  if (Array.isArray(data.items)) return data.items as OrderDashboardMonthRow[]
  if (Array.isArray(data.data)) return data.data as OrderDashboardMonthRow[]
  return []
}

function sumOrderStatus(rows: OrderDashboardMonthRow[], statusLabel: string): number {
  const target = statusLabel.toLowerCase()
  return rows.reduce((sum, row) => {
    const statuses = Array.isArray(row.status) ? row.status : []
    const matched = statuses.find((item) => String(item.status ?? '').toLowerCase() === target)
    return sum + Number(matched?.count ?? 0)
  }, 0)
}

export default function RevenueTab() {
  const ORDERS_PER_PAGE = 9
  const [revenueOrderStatusFilter, setRevenueOrderStatusFilter] = useState<RevenueOrderStatusFilter>('InDelivery')
  const [revenueChartInput, setRevenueChartInput] = useState('2026')
  const [totalRevenueAmount, setTotalRevenueAmount] = useState(0)
  const [totalRevenueLoading, setTotalRevenueLoading] = useState(false)
  const [totalUnpaidAmount, setTotalUnpaidAmount] = useState(0)
  const [totalUnpaidLoading, setTotalUnpaidLoading] = useState(false)
  const [cancelledOrdersAmount, setCancelledOrdersAmount] = useState(0)
  const [cancelledOrdersLoading, setCancelledOrdersLoading] = useState(false)
  const [completedOrdersAmount, setCompletedOrdersAmount] = useState(0)
  const [completedOrdersLoading, setCompletedOrdersLoading] = useState(false)
  const [returnedOrdersAmount, setReturnedOrdersAmount] = useState(0)
  const [returnedOrdersLoading, setReturnedOrdersLoading] = useState(false)
  const [unpaidChartInput, setUnpaidChartInput] = useState('2026')
  const [unpaidChartData, setUnpaidChartData] = useState<TotalRevenue[]>([])
  const [unpaidChartLoading, setUnpaidChartLoading] = useState(false)
  const [apiOrders, setApiOrders] = useState<AdminOrderItem[] | null>(null)
  const [revenueChartData, setRevenueChartData] = useState<TotalRevenue[]>([])
  const [revenueChartLoading, setRevenueChartLoading] = useState(false)
  const [orderDetailModalOpen, setOrderDetailModalOpen] = useState(false)
  const [orderDetailLoading, setOrderDetailLoading] = useState(false)
  const [orderDetail, setOrderDetail] = useState<AdminOrderDetail | null>(null)
  const [ordersPage, setOrdersPage] = useState(1)
  const [summaryPeriodInput, setSummaryPeriodInput] = useState('2026')
  const [summaryAppliedPeriod, setSummaryAppliedPeriod] = useState('2026')

  // Revenue tab: KPI summary + revenue trend chart + sortable order cards list.
  const normalizeRevenueInput = (value: string): string | null => {
    const trimmed = value.trim()
    if (/^\d{4}$/.test(trimmed)) return trimmed

    const monthYearMatch = /^(\d{1,2})\/(\d{4})$/.exec(trimmed)
    if (!monthYearMatch) return null

    const month = Number(monthYearMatch[1])
    if (month < 1 || month > 12) return null

    return `${String(month).padStart(2, '0')}/${monthYearMatch[2]}`
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await OrderApi.getOrders(1, 1000)
        const items = extractOrderItemsFromResponse(response)
        setApiOrders(items.map(mapApiOrderItem))
      } catch {
        toast.error('Không tải được danh sách đơn hàng. Vui lòng thử lại.')
      }
    }
    fetchOrders()
  }, [])

  const fetchRevenueChartData = useCallback(async (rawInput: string) => {
    const normalizedInput = normalizeRevenueInput(rawInput)
    if (!normalizedInput) {
      toast.error('Định dạng không hợp lệ. Nhập yyyy hoặc mm/yyyy.')
      return
    }
    setRevenueChartInput(normalizedInput)

    setRevenueChartLoading(true)
    try {
      const response = await InvoiceApi.getTotalRevenue(normalizedInput)
      const rows = extractRevenueRowsFromResponse(response)
      if (!isApiSuccessLike(response) && rows.length === 0) {
        setRevenueChartData([])
        toast.info(response.message || 'Không có dữ liệu doanh thu cho bộ lọc này.')
        return
      }
      setRevenueChartData(rows)
    } catch (error) {
      if (isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 400)) {
        setRevenueChartData([])
        toast.info('Không có dữ liệu doanh thu cho bộ lọc này.')
        return
      }
      toast.error('Không tải được dữ liệu doanh thu. Vui lòng thử lại.')
    } finally {
      setRevenueChartLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchRevenueChartData('2026')
  }, [fetchRevenueChartData])

  const fetchTotalRevenueData = useCallback(async (rawInput: string) => {
    const normalizedInput = normalizeRevenueInput(rawInput)
    if (!normalizedInput) {
      toast.error('Định dạng không hợp lệ. Nhập yyyy hoặc mm/yyyy.')
      return
    }
    setTotalRevenueLoading(true)

    try {
      const response = await InvoiceApi.getTotalRevenue(normalizedInput)
      const rows = extractRevenueRowsFromResponse(response)
      if (!isApiSuccessLike(response) && rows.length === 0) {
        setTotalRevenueAmount(0)
        toast.info(response.message || 'Không có dữ liệu tổng doanh thu cho bộ lọc này.')
        return
      }
      const total = rows.reduce((sum, item) => sum + item.totalAmount, 0)
      setTotalRevenueAmount(total)
    } catch (error) {
      if (isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 400)) {
        setTotalRevenueAmount(0)
        toast.info('Không có dữ liệu tổng doanh thu cho bộ lọc này.')
        return
      }
      toast.error('Không tải được tổng doanh thu. Vui lòng thử lại.')
    } finally {
      setTotalRevenueLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchTotalRevenueData('2026')
  }, [fetchTotalRevenueData])

  const fetchTotalUnpaidData = useCallback(async (rawInput: string) => {
    const normalizedInput = normalizeRevenueInput(rawInput)
    if (!normalizedInput) {
      toast.error('Định dạng không hợp lệ. Nhập yyyy hoặc mm/yyyy.')
      return
    }
    setTotalUnpaidLoading(true)

    try {
      const response = await InvoiceApi.getTotalUnpaid(normalizedInput)
      const rows = extractRevenueRowsFromResponse(response)
      if (!isApiSuccessLike(response) && rows.length === 0) {
        setTotalUnpaidAmount(0)
        toast.info(response.message || 'Không có dữ liệu chưa thanh toán cho bộ lọc này.')
        return
      }
      const total = rows.reduce((sum, item) => sum + item.totalAmount, 0)
      setTotalUnpaidAmount(total)
    } catch (error) {
      if (isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 400)) {
        setTotalUnpaidAmount(0)
        toast.info('Không có dữ liệu chưa thanh toán cho bộ lọc này.')
        return
      }
      toast.error('Không tải được dữ liệu chưa thanh toán. Vui lòng thử lại.')
    } finally {
      setTotalUnpaidLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchTotalUnpaidData('2026')
  }, [fetchTotalUnpaidData])

  const fetchCancelledOrdersData = useCallback(async (rawInput: string) => {
    const normalizedInput = normalizeRevenueInput(rawInput)
    if (!normalizedInput) {
      toast.error('Định dạng không hợp lệ. Nhập yyyy hoặc mm/yyyy.')
      return
    }
    setCancelledOrdersLoading(true)

    try {
      const response = await OrderApi.getOrderDashboard(normalizedInput)
      const rows = extractOrderDashboardRowsFromResponse(response)
      if (!isApiSuccessLike(response) && rows.length === 0) {
        setCancelledOrdersAmount(0)
        toast.info(response.message || 'Không có dữ liệu đơn hàng bị hủy cho bộ lọc này.')
        return
      }
      setCancelledOrdersAmount(sumOrderStatus(rows, 'Cancelled'))
    } catch (error) {
      if (isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 400)) {
        setCancelledOrdersAmount(0)
        toast.info('Không có dữ liệu đơn hàng bị hủy cho bộ lọc này.')
        return
      }
      toast.error('Không tải được tổng đơn hàng bị hủy. Vui lòng thử lại.')
    } finally {
      setCancelledOrdersLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchCancelledOrdersData('2026')
  }, [fetchCancelledOrdersData])

  const fetchCompletedOrdersData = useCallback(async (rawInput: string) => {
    const normalizedInput = normalizeRevenueInput(rawInput)
    if (!normalizedInput) {
      toast.error('Định dạng không hợp lệ. Nhập yyyy hoặc mm/yyyy.')
      return
    }
    setCompletedOrdersLoading(true)

    try {
      const response = await OrderApi.getOrderDashboard(normalizedInput)
      const rows = extractOrderDashboardRowsFromResponse(response)
      if (!isApiSuccessLike(response) && rows.length === 0) {
        setCompletedOrdersAmount(0)
        toast.info(response.message || 'Không có dữ liệu đơn hàng hoàn thành cho bộ lọc này.')
        return
      }
      setCompletedOrdersAmount(sumOrderStatus(rows, 'Completed'))
    } catch (error) {
      if (isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 400)) {
        setCompletedOrdersAmount(0)
        toast.info('Không có dữ liệu đơn hàng hoàn thành cho bộ lọc này.')
        return
      }
      toast.error('Không tải được tổng đơn hàng hoàn thành. Vui lòng thử lại.')
    } finally {
      setCompletedOrdersLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchCompletedOrdersData('2026')
  }, [fetchCompletedOrdersData])

  const fetchReturnedOrdersData = useCallback(async (rawInput: string) => {
    const normalizedInput = normalizeRevenueInput(rawInput)
    if (!normalizedInput) {
      toast.error('Định dạng không hợp lệ. Nhập yyyy hoặc mm/yyyy.')
      return
    }
    setReturnedOrdersLoading(true)

    try {
      const response = await OrderApi.getOrderDashboard(normalizedInput)
      const rows = extractOrderDashboardRowsFromResponse(response)
      if (!isApiSuccessLike(response) && rows.length === 0) {
        setReturnedOrdersAmount(0)
        toast.info(response.message || 'Không có dữ liệu đơn hàng bị trả về cho bộ lọc này.')
        return
      }
      setReturnedOrdersAmount(sumOrderStatus(rows, 'Returned'))
    } catch (error) {
      if (isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 400)) {
        setReturnedOrdersAmount(0)
        toast.info('Không có dữ liệu đơn hàng bị trả về cho bộ lọc này.')
        return
      }
      toast.error('Không tải được tổng đơn hàng bị trả về. Vui lòng thử lại.')
    } finally {
      setReturnedOrdersLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchReturnedOrdersData('2026')
  }, [fetchReturnedOrdersData])

  const applySummaryPeriod = useCallback((rawInput: string) => {
    const normalizedInput = normalizeRevenueInput(rawInput)
    if (!normalizedInput) {
      toast.error('Định dạng không hợp lệ. Nhập yyyy hoặc mm/yyyy.')
      return
    }
    setSummaryPeriodInput(normalizedInput)
    setSummaryAppliedPeriod(normalizedInput)
    void fetchTotalRevenueData(normalizedInput)
    void fetchTotalUnpaidData(normalizedInput)
    void fetchCancelledOrdersData(normalizedInput)
    void fetchCompletedOrdersData(normalizedInput)
    void fetchReturnedOrdersData(normalizedInput)
  }, [fetchCancelledOrdersData, fetchCompletedOrdersData, fetchReturnedOrdersData, fetchTotalRevenueData, fetchTotalUnpaidData])

  const fetchUnpaidChartData = useCallback(async (rawInput: string) => {
    const normalizedInput = normalizeRevenueInput(rawInput)
    if (!normalizedInput) {
      toast.error('Định dạng không hợp lệ. Nhập yyyy hoặc mm/yyyy.')
      return
    }
    setUnpaidChartInput(normalizedInput)
    setUnpaidChartLoading(true)
    try {
      const response = await InvoiceApi.getTotalUnpaid(normalizedInput)
      const rows = extractRevenueRowsFromResponse(response)
      if (!isApiSuccessLike(response) && rows.length === 0) {
        setUnpaidChartData([])
        toast.info(response.message || 'Không có dữ liệu chờ thanh toán cho bộ lọc này.')
        return
      }
      setUnpaidChartData(rows)
    } catch (error) {
      if (isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 400)) {
        setUnpaidChartData([])
        toast.info('Không có dữ liệu chờ thanh toán cho bộ lọc này.')
        return
      }
      toast.error('Không tải được dữ liệu chờ thanh toán. Vui lòng thử lại.')
    } finally {
      setUnpaidChartLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchUnpaidChartData('2026')
  }, [fetchUnpaidChartData])

  const sortedApiOrders = useMemo(() => {
    if (!apiOrders) return []
    let list = apiOrders.filter((o) => revenueOrderMatchesStatus(revenueOrderStatusFilter, o.status))
    list = [...list].sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
    return list
  }, [apiOrders, revenueOrderStatusFilter])

  const sortedFallbackOrders = useMemo(() => {
    let list = [...REVENUE_ORDERS]
    if (revenueOrderStatusFilter !== 'all') {
      list = list.filter((o) => {
        const mapped = o.status === 'completed' ? 'Completed' : 'Draft'
        return revenueOrderMatchesStatus(revenueOrderStatusFilter, mapped)
      })
    }
    return list.sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-') + ' ' + a.time).getTime()
      const dateB = new Date(b.date.split('/').reverse().join('-') + ' ' + b.time).getTime()
      return dateB - dateA
    })
  }, [revenueOrderStatusFilter])
  const activeOrderCount = apiOrders ? sortedApiOrders.length : sortedFallbackOrders.length
  const totalOrderPages = Math.max(1, Math.ceil(activeOrderCount / ORDERS_PER_PAGE))
  const paginatedApiOrders = useMemo(() => {
    if (!apiOrders) return []
    const start = (ordersPage - 1) * ORDERS_PER_PAGE
    return sortedApiOrders.slice(start, start + ORDERS_PER_PAGE)
  }, [apiOrders, sortedApiOrders, ordersPage])
  const paginatedFallbackOrders = useMemo(() => {
    const start = (ordersPage - 1) * ORDERS_PER_PAGE
    return sortedFallbackOrders.slice(start, start + ORDERS_PER_PAGE)
  }, [sortedFallbackOrders, ordersPage])

  const orderDetailStatusUi = useMemo(
    () => (orderDetail ? adminOrderStatusUi(orderDetail.status) : null),
    [orderDetail]
  )

  useEffect(() => {
    setOrdersPage(1)
  }, [revenueOrderStatusFilter, apiOrders])

  useEffect(() => {
    if (ordersPage > totalOrderPages) setOrdersPage(totalOrderPages)
  }, [ordersPage, totalOrderPages])

  const openOrderDetail = (order: AdminOrderItem) => {
    if (!order.id) {
      toast.error('Không tìm thấy ID đơn hàng để xem chi tiết.')
      return
    }
    setOrderDetailModalOpen(true)
    setOrderDetail(null)
    setOrderDetailLoading(true)
    OrderApi.getOrderById(order.id)
      .then((res) => {
        if (!res.is_success) {
          toast.error(res.message || 'Không tải được chi tiết đơn hàng.')
          return
        }
        setOrderDetail(mapApiOrderDetail(res.data))
      })
      .catch(() => {
        toast.error('Không tải được chi tiết đơn hàng. Vui lòng thử lại.')
      })
      .finally(() => setOrderDetailLoading(false))
  }

  const closeOrderDetailModal = () => {
    setOrderDetailModalOpen(false)
    setOrderDetail(null)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
        <div className="md:col-span-2 xl:col-span-6 flex justify-end">
          <div className="flex flex-wrap items-center justify-end gap-2">
            <p className="text-xs text-gray-500">
              Nhập yyyy để lấy 12 tháng, hoặc mm/yyyy để lọc theo tháng (UTC). Đang xem:{' '}
              <span className="font-medium text-[#003366]">{summaryAppliedPeriod}</span>
            </p>
            <input
              value={summaryPeriodInput}
              onChange={(e) => setSummaryPeriodInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  applySummaryPeriod(summaryPeriodInput)
                }
              }}
              placeholder="yyyy hoặc mm/yyyy"
              className="h-9 w-40 rounded-md border border-gray-200 px-3 text-sm outline-none focus:border-[#3366CC]"
            />
            <Button size="sm" onClick={() => applySummaryPeriod(summaryPeriodInput)}>
              Lấy
            </Button>
          </div>
        </div>
        <Card className="p-5 xl:col-span-2 hover:shadow-lg transition-shadow border-l-4 border-l-[#2ECC71]">
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 rounded-lg bg-green-50">
              <DollarSign className="h-6 w-6 text-[#2ECC71]" />
            </div>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">Tổng doanh thu</h3>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-[#2ECC71]">{Math.round(totalRevenueAmount / 1000).toLocaleString('vi-VN')}K VND</p>
            <TrendingUp className="h-5 w-5 text-[#2ECC71]" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {totalRevenueLoading ? 'Đang tải...' : `Tổng từ dữ liệu ${summaryAppliedPeriod}`}
          </p>
        </Card>

        <Card className="p-5 xl:col-span-2 hover:shadow-lg transition-shadow border-l-4 border-l-[#FF9800]">
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 rounded-lg bg-orange-50">
              <Clock className="h-6 w-6 text-[#FF9800]" />
            </div>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">Chờ thanh toán</h3>
          <p className="text-3xl font-bold text-[#FF9800]">{Math.round(totalUnpaidAmount / 1000).toLocaleString('vi-VN')}K VND</p>
          <p className="text-xs text-gray-500 mt-2">
            {totalUnpaidLoading ? 'Đang tải...' : `Tổng chưa thanh toán từ dữ liệu ${summaryAppliedPeriod}`}
          </p>
        </Card>

        <Card className="p-5 xl:col-span-2 hover:shadow-lg transition-shadow border-l-4 border-l-[#F44336]">
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 rounded-lg bg-red-50">
              <XCircle className="h-6 w-6 text-[#F44336]" />
            </div>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">Tổng đơn hàng bị hủy</h3>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-[#F44336]">{cancelledOrdersAmount.toLocaleString('vi-VN')}</p>
            <TrendingDown className="h-5 w-5 text-[#F44336]" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {cancelledOrdersLoading ? 'Đang tải...' : `Tổng đơn hủy từ dữ liệu ${summaryAppliedPeriod}`}
          </p>
        </Card>

        <Card className="p-5 xl:col-span-2 xl:col-start-2 hover:shadow-lg transition-shadow border-l-4 border-l-[#3366CC]">
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 rounded-lg bg-blue-50">
              <CheckCircle className="h-6 w-6 text-[#3366CC]" />
            </div>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">Tổng đơn hàng hoàn thành</h3>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-[#3366CC]">{completedOrdersAmount.toLocaleString('vi-VN')}</p>
            <TrendingUp className="h-5 w-5 text-[#2ECC71]" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {completedOrdersLoading ? 'Đang tải...' : `Tổng đơn hoàn thành từ dữ liệu ${summaryAppliedPeriod}`}
          </p>
        </Card>

        <Card className="p-5 xl:col-span-2 xl:col-start-4 hover:shadow-lg transition-shadow border-l-4 border-l-[#8B5CF6]">
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 rounded-lg bg-violet-50">
              <RotateCcw className="h-6 w-6 text-[#8B5CF6]" />
            </div>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">Tổng đơn hàng bị trả về</h3>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-[#8B5CF6]">{returnedOrdersAmount.toLocaleString('vi-VN')}</p>
            <TrendingDown className="h-5 w-5 text-[#8B5CF6]" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {returnedOrdersLoading ? 'Đang tải...' : `Tổng đơn trả về từ dữ liệu ${summaryAppliedPeriod}`}
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-[#003366] text-lg font-semibold">Doanh thu theo thời gian</h3>
            <p className="text-sm text-gray-500">Nhập yyyy để lấy 12 tháng, hoặc mm/yyyy để lọc theo tháng</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={revenueChartInput}
              onChange={(e) => setRevenueChartInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  void fetchRevenueChartData(revenueChartInput)
                }
              }}
              placeholder="yyyy hoặc mm/yyyy"
              className="h-10 w-40 rounded-md border border-gray-200 px-3 text-sm outline-none focus:border-[#3366CC]"
            />
            <Button size="sm" onClick={() => { void fetchRevenueChartData(revenueChartInput) }}>
              Lấy dữ liệu
            </Button>
          </div>
        </div>
        {revenueChartLoading && <p className="mb-3 text-sm text-gray-500">Đang tải dữ liệu doanh thu...</p>}
        {!revenueChartLoading && revenueChartData.length === 0 && (
          <p className="mb-3 text-sm text-gray-500">Không có dữ liệu doanh thu cho bộ lọc hiện tại.</p>
        )}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip
              contentStyle={{ backgroundColor: 'white', border: '1px solid #e0e0e0', borderRadius: '8px' }}
              formatter={(value) => `${Number(value ?? 0).toLocaleString('vi-VN')}đ`}
            />
            <Legend />
            <Line type="monotone" dataKey="totalAmount" stroke="#2ECC71" strokeWidth={3} dot={{ fill: '#2ECC71', r: 5 }} name="Doanh thu" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-[#003366] text-lg font-semibold">Chờ thanh toán theo thời gian</h3>
            <p className="text-sm text-gray-500">Nhập yyyy để lấy 12 tháng, hoặc mm/yyyy để lọc theo tháng</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={unpaidChartInput}
              onChange={(e) => setUnpaidChartInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  void fetchUnpaidChartData(unpaidChartInput)
                }
              }}
              placeholder="yyyy hoặc mm/yyyy"
              className="h-10 w-40 rounded-md border border-gray-200 px-3 text-sm outline-none focus:border-[#3366CC]"
            />
            <Button size="sm" onClick={() => { void fetchUnpaidChartData(unpaidChartInput) }}>
              Lấy dữ liệu
            </Button>
          </div>
        </div>
        {unpaidChartLoading && <p className="mb-3 text-sm text-gray-500">Đang tải dữ liệu chờ thanh toán...</p>}
        {!unpaidChartLoading && unpaidChartData.length === 0 && (
          <p className="mb-3 text-sm text-gray-500">Không có dữ liệu chờ thanh toán cho bộ lọc hiện tại.</p>
        )}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={unpaidChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip
              contentStyle={{ backgroundColor: 'white', border: '1px solid #e0e0e0', borderRadius: '8px' }}
              formatter={(value) => `${Number(value ?? 0).toLocaleString('vi-VN')}đ`}
            />
            <Legend />
            <Line type="monotone" dataKey="totalAmount" stroke="#FF9800" strokeWidth={3} dot={{ fill: '#FF9800', r: 5 }} name="Chờ thanh toán" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <div className="mb-4">
          <div className="mb-3">
            <h3 className="text-[#003366] text-lg font-semibold">Chi tiết đơn hàng</h3>
            <p className="text-sm text-gray-500">
              Danh sách {activeOrderCount} đơn hàng trong khoảng thời gian
              {revenueOrderStatusFilter !== 'all' && (
                <span className="text-gray-400"> · Lọc: {REVENUE_ORDER_STATUS_FILTERS.find((f) => f.value === revenueOrderStatusFilter)?.label}</span>
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {REVENUE_ORDER_STATUS_FILTERS.map((item) => {
              const active = revenueOrderStatusFilter === item.value
              return (
                <Button
                  key={item.value}
                  size="sm"
                  variant={active ? 'default' : 'outline'}
                  className={active ? 'bg-[#3366CC] hover:bg-[#2952A3]' : ''}
                  onClick={() => setRevenueOrderStatusFilter(item.value)}
                >
                  {item.label}
                </Button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {apiOrders
            ? paginatedApiOrders.map((order) => {
              const orderDate = new Date(order.orderDate)
              const dateText = orderDate.toLocaleDateString('vi-VN')
              const timeText = orderDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
              const statusUi = adminOrderStatusUi(order.status)

              return (
                <Card
                  key={order.id}
                  className={`p-4 hover:shadow-md transition-shadow flex flex-col justify-between h-full border-t-4 ${statusUi.cardBorderClass} bg-white group`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 gap-2">
                      <h3 className="font-bold text-[#003366] text-lg">{order.code}</h3>
                    </div>
                    <div className="space-y-3 mb-4">
                      <div className="flex flex-col gap-1">
                        <p className="text-[10px] text-gray-400 uppercase font-medium">Tên đơn hàng</p>
                        <p className="text-sm font-semibold text-[#003366] line-clamp-1 italic">{order.name}</p>
                      </div>
                      <div className="rounded-lg border border-gray-100 overflow-hidden">
                        <p className="text-[10px] font-bold text-gray-500 uppercase px-2 pt-2 pb-1 bg-gray-50">Trạng thái đơn</p>
                        <div className="px-2 pb-2 pt-1 bg-white flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusUi.pillClass}`}>
                            {statusUi.labelVi}
                          </span>
                          {order.status && statusUi.labelVi !== order.status && (
                            <span className="text-[11px] text-gray-400 font-mono truncate max-w-[140px]" title={order.status}>
                              ({order.status})
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex flex-col gap-1 text-[10px] text-gray-500">
                          <span className="flex items-center gap-1 font-mono text-gray-400">📅 {dateText} | ⏰ {timeText}</span>
                          <span className="flex items-center gap-1"><Users className="h-3 w-3" /> Khách hàng: {order.customerName || order.customerId}</span>
                        </div>
                        <p className="font-bold text-[#2ECC71] text-lg">{order.totalAmount.toLocaleString('vi-VN')}đ</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2 border-[#3366CC] text-[#3366CC]" onClick={() => openOrderDetail(order)}>
                    Chi tiết đơn hàng
                  </Button>
                </Card>
              )
            })
            : paginatedFallbackOrders.map((order) => {
                const mappedStatus = order.status === 'completed' ? 'Completed' : 'Draft'
                const statusUi = adminOrderStatusUi(mappedStatus)
                return (
                  <Card
                    key={order.id}
                    className={`p-4 hover:shadow-md transition-shadow flex flex-col justify-between h-full border-t-4 ${statusUi.cardBorderClass} bg-white group`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-[#003366] text-lg">{order.id}</h3>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white ${statusUi.pillClass}`}>
                          {statusUi.labelVi}
                        </span>
                      </div>
                      <div className="space-y-3 mb-4">
                        <div className="flex flex-col gap-1">
                          <p className="text-[10px] text-gray-400 uppercase font-medium">Khách hàng</p>
                          <p className="text-sm font-semibold text-[#003366] line-clamp-1 italic">{order.customer}</p>
                        </div>
                        <div className="bg-[#F5F7FA] p-2 rounded-lg">
                          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Sản phẩm</p>
                          <div className="flex justify-between text-xs mb-1 last:mb-0">
                            <span className="text-gray-700 line-clamp-1 flex-1">
                              {order.product} <span className="text-gray-400">x{order.quantity}</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex flex-col gap-1 text-[10px] text-gray-500">
                            <span className="flex items-center gap-1 font-mono text-gray-400">📅 {order.date} | ⏰ {order.time}</span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" /> Staff: {order.staff}
                            </span>
                          </div>
                          <p className="font-bold text-[#2ECC71] text-lg">{order.value.toLocaleString()}đ</p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 border-[#3366CC] text-[#3366CC]"
                      onClick={() => toast.info('Dữ liệu mẫu không có API chi tiết đơn hàng.')}
                    >
                      Chi tiết đơn hàng
                    </Button>
                  </Card>
                )
              })}
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <Button variant="outline" size="sm" disabled={ordersPage === 1} onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}>
            Trước
          </Button>
          <p className="text-xs text-gray-500 text-center flex-1 min-w-0">
            Trang {ordersPage}/{totalOrderPages}
          </p>
          <Button variant="outline" size="sm" disabled={ordersPage === totalOrderPages} onClick={() => setOrdersPage((p) => Math.min(totalOrderPages, p + 1))}>
            Sau
          </Button>
        </div>
      </Card>

      {orderDetailModalOpen && (
        <ModalShell onClose={closeOrderDetailModal}>
          <div className="flex items-start justify-between gap-3 mb-4 border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-lg font-semibold text-[#003366]">Chi tiết đơn hàng</h3>
              <p className="text-sm text-gray-500">{orderDetail?.code ? `Đơn ${orderDetail.code}` : 'Đang tải thông tin đơn...'}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 w-9 shrink-0 p-0"
              onClick={closeOrderDetailModal}
              aria-label="Đóng"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {orderDetailLoading && <p className="text-sm text-gray-600 py-6 text-center">Đang tải…</p>}
          {!orderDetailLoading && orderDetail && (
            <div className="space-y-4">
              <dl className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between gap-2 border-b border-gray-100 pb-2">
                  <dt className="text-gray-500">Tên đơn</dt>
                  <dd className="font-medium text-[#003366] text-right">{orderDetail.name}</dd>
                </div>
                <div className="flex justify-between gap-2 border-b border-gray-100 pb-2">
                  <dt className="text-gray-500">Mã đơn</dt>
                  <dd className="font-mono text-right">{orderDetail.code}</dd>
                </div>
                <div className="flex justify-between gap-2 border-b border-gray-100 pb-2">
                  <dt className="text-gray-500">Tên khách hàng</dt>
                  <dd className="text-right">{orderDetail.customerName || 'Chưa có tên'}</dd>
                </div>
                <div className="flex justify-between gap-2 border-b border-gray-100 pb-2">
                  <dt className="text-gray-500">ID khách hàng</dt>
                  <dd className="text-right font-mono">{orderDetail.customerId}</dd>
                </div>
                <div className="flex justify-between gap-2 border-b border-gray-100 pb-2">
                  <dt className="text-gray-500">Số điện thoại</dt>
                  <dd className="text-right">{orderDetail.customerPhone || 'Chưa có số điện thoại'}</dd>
                </div>
                <div className="flex justify-between gap-2 border-b border-gray-100 pb-2">
                  <dt className="text-gray-500">Email</dt>
                  <dd className="text-right">{orderDetail.customerEmail || 'Chưa có email'}</dd>
                </div>
                <div className="flex justify-between gap-2 border-b border-gray-100 pb-2">
                  <dt className="text-gray-500">Địa chỉ</dt>
                  <dd className="text-right">{orderDetail.customerAddress || 'Chưa có địa chỉ'}</dd>
                </div>
                <div className="flex justify-between gap-2 border-b border-gray-100 pb-2">
                  <dt className="text-gray-500">Ngày tạo</dt>
                  <dd className="text-right">{new Date(orderDetail.orderDate).toLocaleString('vi-VN')}</dd>
                </div>
                <div className="flex justify-between gap-2 border-b border-gray-100 pb-2 items-center">
                  <dt className="text-gray-500">Trạng thái đơn</dt>
                  <dd className="text-right">
                    {orderDetailStatusUi && (
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${orderDetailStatusUi.pillClass}`}
                      >
                        {orderDetailStatusUi.labelVi}
                      </span>
                    )}
                  </dd>
                </div>
                <div className="flex justify-between gap-2 border-b border-gray-100 pb-2">
                  <dt className="text-gray-500">Trạng thái giao</dt>
                  <dd className="text-right">{orderDetail.deliveryStatus}</dd>
                </div>
                <div className="flex justify-between gap-2 border-b border-gray-100 pb-2">
                  <dt className="text-gray-500">Tổng tiền</dt>
                  <dd className="text-right font-semibold text-[#2ECC71]">{orderDetail.totalAmount.toLocaleString('vi-VN')}đ</dd>
                </div>
                <div className="pt-1">
                  <dt className="text-gray-500 mb-2">Sản phẩm trong đơn</dt>
                  {orderDetail.orderItems.length > 0 ? (
                    <div className="space-y-2">
                      {orderDetail.orderItems.map((item) => (
                        <div key={item.id} className="rounded-md border border-gray-100 p-2">
                          <p className="text-sm text-[#003366] font-medium">{item.productName}</p>
                          <div className="text-xs text-gray-600 mt-1 flex items-center justify-between gap-2">
                            <span>SL: {item.quantity}</span>
                            <span>{item.itemsPrice == null ? 'Chưa có giá' : `${item.itemsPrice.toLocaleString('vi-VN')}đ`}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <dd className="text-gray-700">Đơn hàng chưa có sản phẩm.</dd>
                  )}
                </div>
              </dl>
            </div>
          )}
          {!orderDetailLoading && !orderDetail && (
            <p className="text-sm text-gray-600 py-6 text-center">Không có dữ liệu đơn hàng.</p>
          )}
        </ModalShell>
      )}
    </div>
  )
}

