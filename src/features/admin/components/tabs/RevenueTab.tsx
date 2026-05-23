import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import Button from '@/components/ui/button/Button'
import Card from '@/components/ui/card/Card'
import AdminDashboardMetricCard from '../AdminDashboardMetricCard'
import { REVENUE_ORDERS } from '@/components/admin/admin-dashboard-data'
import { CheckCircle, ClipboardList, Clock, DollarSign, Mail, MapPin, Package, Phone, ShoppingBag, TrendingDown, TrendingUp, User, Users, RotateCcw, X, XCircle } from 'lucide-react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { toast } from 'react-toastify'
import { isAxiosError } from 'axios'
import { getDeliveryStatusLabel, getOrderStatusUi } from '../../../manager/const/order-status'
import type { ManagerOrderStatusFilter } from '../../../manager/types/order-type'
import { OrderApi } from '../../api/order-api'
import type { AdminOrderDetail, AdminOrderItem, OrderDashboardMonthRow } from '../../types/order-type'
import { InvoiceApi } from '../../api/invoice-api'
import type { TotalRevenue } from '../../types/invoice-type'

function ModalShell({
  children,
  onClose,
  maxWidthClass = 'max-w-lg'
}: {
  children: ReactNode
  onClose: () => void
  maxWidthClass?: string
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onMouseDown={onClose}>
      <div
        className={`rounded-xl bg-white shadow-xl ${maxWidthClass} w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8`}
        onMouseDown={(e) => e.stopPropagation()}
      >
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

function formatOrderDetailDateTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const time = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  const date = d.toLocaleDateString('vi-VN')
  return `${time} - ${date}`
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

type RevenueOrderStatusFilter = 'all' | ManagerOrderStatusFilter

/** Hiển thị trạng thái đơn (API thường trả tiếng Anh) — pill + viền card */
/** Lọc đơn theo status API (chuỗi như Draft, Completed, …) */
function revenueOrderMatchesStatus(filter: RevenueOrderStatusFilter, apiStatus: string): boolean {
  if (filter === 'all') return true
  return apiStatus.trim().toLowerCase() === filter.toLowerCase()
}

const REVENUE_ORDER_STATUS_FILTERS: Array<{ value: RevenueOrderStatusFilter; label: string }> = [
  { value: 'all', label: 'Tất cả' },
  { value: 'Draft', label: 'Bản nháp' },
  { value: 'Pending', label: 'Chờ xử lý' },
  { value: 'Shipped', label: 'Đã giao hàng' },
  { value: 'Completed', label: 'Hoàn thành' },
  { value: 'Cancelled', label: 'Đã hủy' },
  { value: 'PendingReturn', label: 'Chờ trả hàng' },
  { value: 'Returned', label: 'Đã trả hàng' },
  { value: 'ReturnedDefective', label: 'Đã trả hàng do lỗi' },
  { value: 'ReturnRejected', label: 'Từ chối trả hàng' },
  { value: 'RefundRejected', label: 'Từ chối hoàn hàng' },
  { value: 'RefundApproved', label: 'Chấp nhận hoàn hàng' },
  { value: 'ReturnApproved', label: 'Chấp nhận trả hàng' }
]

function adminOrderStatusUi(statusRaw: string): { labelVi: string; pillClass: string; cardBorderClass: string } {
  return getOrderStatusUi(statusRaw)
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
  const [revenueOrderStatusFilter, setRevenueOrderStatusFilter] = useState<RevenueOrderStatusFilter>('all')
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
            <p className="text-sm text-gray-500 sm:text-base">
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
        <AdminDashboardMetricCard
          className="xl:col-span-2"
          accentColor="#2ECC71"
          iconBg="bg-green-50"
          iconColor="text-[#2ECC71]"
          valueColor="text-[#2ECC71]"
          Icon={DollarSign}
          topRightIcon={TrendingUp}
          topRightClassName="text-[#2ECC71]"
          title="Tổng doanh thu"
          value={totalRevenueLoading ? '...' : totalRevenueAmount === 0 ? '0' : `${Math.round(totalRevenueAmount / 1000).toLocaleString('vi-VN')}K`}
          unit="VNĐ"
          footer={totalRevenueLoading ? 'Đang tải...' : `Tổng từ dữ liệu ${summaryAppliedPeriod}`}
        />

        <AdminDashboardMetricCard
          className="xl:col-span-2"
          accentColor="#FF9800"
          iconBg="bg-orange-50"
          iconColor="text-[#FF9800]"
          valueColor="text-[#FF9800]"
          Icon={Clock}
          title="Chờ thanh toán"
          value={totalUnpaidLoading ? '...' : totalUnpaidAmount === 0 ? '0' : `${Math.round(totalUnpaidAmount / 1000).toLocaleString('vi-VN')}K`}
          unit="VNĐ"
          footer={totalUnpaidLoading ? 'Đang tải...' : `Tổng chưa thanh toán từ dữ liệu ${summaryAppliedPeriod}`}
        />

        <AdminDashboardMetricCard
          className="xl:col-span-2"
          accentColor="#F44336"
          iconBg="bg-red-50"
          iconColor="text-[#F44336]"
          valueColor="text-[#F44336]"
          Icon={XCircle}
          topRightIcon={TrendingDown}
          topRightClassName="text-[#F44336]"
          title="Tổng đơn hàng bị hủy"
          value={cancelledOrdersLoading ? '...' : cancelledOrdersAmount.toLocaleString('vi-VN')}
          footer={cancelledOrdersLoading ? 'Đang tải...' : `Tổng đơn hủy từ dữ liệu ${summaryAppliedPeriod}`}
        />

        <AdminDashboardMetricCard
          className="xl:col-span-2 xl:col-start-2"
          accentColor="#3366CC"
          iconBg="bg-blue-50"
          iconColor="text-[#3366CC]"
          valueColor="text-[#3366CC]"
          Icon={CheckCircle}
          topRightIcon={TrendingUp}
          topRightClassName="text-[#2ECC71]"
          title="Tổng đơn hàng hoàn thành"
          value={completedOrdersLoading ? '...' : completedOrdersAmount.toLocaleString('vi-VN')}
          footer={completedOrdersLoading ? 'Đang tải...' : `Tổng đơn hoàn thành từ dữ liệu ${summaryAppliedPeriod}`}
        />

        <AdminDashboardMetricCard
          className="xl:col-span-2 xl:col-start-4"
          accentColor="#8B5CF6"
          iconBg="bg-violet-50"
          iconColor="text-[#8B5CF6]"
          valueColor="text-[#8B5CF6]"
          Icon={RotateCcw}
          topRightIcon={TrendingDown}
          topRightClassName="text-[#8B5CF6]"
          title="Tổng đơn hàng bị trả về"
          value={returnedOrdersLoading ? '...' : returnedOrdersAmount.toLocaleString('vi-VN')}
          footer={returnedOrdersLoading ? 'Đang tải...' : `Tổng đơn trả về từ dữ liệu ${summaryAppliedPeriod}`}
        />
      </div>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-[#003366] text-xl font-semibold sm:text-2xl">Doanh thu theo thời gian</h3>
            <p className="text-base text-gray-500">Nhập yyyy để lấy 12 tháng, hoặc mm/yyyy để lọc theo tháng</p>
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
        {revenueChartLoading && <p className="mb-3 text-base text-gray-500">Đang tải dữ liệu doanh thu...</p>}
        {!revenueChartLoading && revenueChartData.length === 0 && (
          <p className="mb-3 text-base text-gray-500">Không có dữ liệu doanh thu cho bộ lọc hiện tại.</p>
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
            <h3 className="text-[#003366] text-xl font-semibold sm:text-2xl">Chờ thanh toán theo thời gian</h3>
            <p className="text-base text-gray-500">Nhập yyyy để lấy 12 tháng, hoặc mm/yyyy để lọc theo tháng</p>
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
        {unpaidChartLoading && <p className="mb-3 text-base text-gray-500">Đang tải dữ liệu chờ thanh toán...</p>}
        {!unpaidChartLoading && unpaidChartData.length === 0 && (
          <p className="mb-3 text-base text-gray-500">Không có dữ liệu chờ thanh toán cho bộ lọc hiện tại.</p>
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
            <h3 className="text-[#003366] text-xl font-semibold sm:text-2xl">Chi tiết đơn hàng</h3>
            <p className="text-base text-gray-500">
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
                  className={`p-5 hover:shadow-md transition-shadow flex flex-col justify-between h-full border-t-4 ${statusUi.cardBorderClass} bg-white group`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 gap-2">
                      <h3 className="font-bold text-[#003366] text-xl sm:text-2xl">{order.code}</h3>
                    </div>
                    <div className="space-y-3 mb-4">
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-gray-400 uppercase font-medium sm:text-sm">Tên đơn hàng</p>
                        <p className="text-base font-semibold text-[#003366] line-clamp-1 italic sm:text-lg">{order.name}</p>
                      </div>
                      <div className="rounded-lg border border-gray-100 overflow-hidden">
                        <p className="text-xs font-bold text-gray-500 uppercase px-2.5 pt-2.5 pb-1.5 bg-gray-50 sm:text-sm">Trạng thái đơn</p>
                        <div className="px-2.5 pb-2.5 pt-1.5 bg-white flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${statusUi.pillClass}`}>
                            {statusUi.labelVi}
                          </span>
                          {order.status && statusUi.labelVi !== order.status && (
                            <span className="text-sm text-gray-400 font-mono truncate max-w-[160px]" title={order.status}>
                              ({order.status})
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-end justify-between gap-3 pt-1">
                        <div className="flex min-w-0 flex-col gap-1.5 text-sm text-gray-500 sm:text-base">
                          <span className="flex items-center gap-1.5 font-mono text-gray-500">📅 {dateText} | ⏰ {timeText}</span>
                          <span className="flex items-center gap-1.5">
                            <Users className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" /> Khách hàng: {order.customerName || order.customerId}
                          </span>
                        </div>
                        <p className="flex shrink-0 items-baseline gap-0.5 font-bold leading-none text-[#2ECC71]">
                          <span className="text-xl sm:text-2xl">{order.totalAmount.toLocaleString('vi-VN')}</span>
                          <span className="text-xl sm:text-2xl">đ</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-2 w-full min-h-11 border-[#3366CC] text-base text-[#3366CC]" onClick={() => openOrderDetail(order)}>
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
                  className={`p-5 hover:shadow-md transition-shadow flex flex-col justify-between h-full border-t-4 ${statusUi.cardBorderClass} bg-white group`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 gap-2">
                      <h3 className="font-bold text-[#003366] text-xl sm:text-2xl">{order.id}</h3>
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold text-white ${statusUi.pillClass}`}>
                        {statusUi.labelVi}
                      </span>
                    </div>
                    <div className="space-y-3 mb-4">
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-gray-400 uppercase font-medium sm:text-sm">Khách hàng</p>
                        <p className="text-base font-semibold text-[#003366] line-clamp-1 italic sm:text-lg">{order.customer}</p>
                      </div>
                      <div className="bg-[#F5F7FA] p-3 rounded-lg">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-2 sm:text-sm">Sản phẩm</p>
                        <div className="flex justify-between text-sm mb-1 last:mb-0 sm:text-base">
                          <span className="text-gray-700 line-clamp-1 flex-1">
                            {order.product} <span className="text-gray-400">x{order.quantity}</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-end justify-between gap-3 pt-1">
                        <div className="flex min-w-0 flex-col gap-1.5 text-sm text-gray-500 sm:text-base">
                          <span className="flex items-center gap-1.5 font-mono text-gray-500">📅 {order.date} | ⏰ {order.time}</span>
                          <span className="flex items-center gap-1.5">
                            <Users className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" /> Staff: {order.staff}
                          </span>
                        </div>
                        <p className="flex shrink-0 items-baseline gap-0.5 font-bold leading-none text-[#2ECC71]">
                          <span className="text-xl sm:text-2xl">{order.value.toLocaleString()}</span>
                          <span className="text-xl sm:text-2xl">đ</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-2 w-full min-h-11 border-[#3366CC] text-base text-[#3366CC]"
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
          <p className="text-sm text-gray-500 text-center flex-1 min-w-0 sm:text-base">
            Trang {ordersPage}/{totalOrderPages}
          </p>
          <Button variant="outline" size="sm" disabled={ordersPage === totalOrderPages} onClick={() => setOrdersPage((p) => Math.min(totalOrderPages, p + 1))}>
            Sau
          </Button>
        </div>
      </Card>

      {orderDetailModalOpen && (
        <ModalShell onClose={closeOrderDetailModal} maxWidthClass="max-w-xl">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold uppercase tracking-wide text-[#003366] sm:text-xl">Chi tiết đơn hàng</h3>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-base text-gray-600">Đơn hàng</span>
                {orderDetail?.code ? (
                  <span className="inline-flex rounded-full bg-[#3366CC] px-3 py-1 text-sm font-semibold text-white sm:text-base">
                    {orderDetail.code}
                  </span>
                ) : (
                  <span className="text-base text-gray-400">{orderDetailLoading ? 'Đang tải…' : '—'}</span>
                )}
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 w-9 shrink-0 border-[#3366CC] p-0 text-[#3366CC] hover:bg-[#EBF1FF]"
              onClick={closeOrderDetailModal}
              aria-label="Đóng"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {orderDetailLoading && <p className="py-10 text-center text-base text-gray-600">Đang tải…</p>}

          {!orderDetailLoading && orderDetail && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
                {/* Thông tin khách hàng */}
                <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4">
                  <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EBF1FF]">
                      <User className="h-4 w-4 text-[#3366CC]" />
                    </div>
                    <h4 className="text-sm font-bold uppercase tracking-wide text-[#3366CC] sm:text-base">Thông tin khách hàng</h4>
                  </div>
                  <div className="space-y-3 text-base">
                    <div className="flex gap-2.5">
                      <User className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#3366CC]" aria-hidden />
                      <div>
                        <p className="text-sm text-gray-500 sm:text-base">Tên khách hàng:</p>
                        <p className="font-bold text-[#003366]">{orderDetail.customerName || 'Chưa có tên'}</p>
                      </div>
                    </div>
                    <div className="flex gap-2.5">
                      <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#3366CC]" aria-hidden />
                      <div>
                        <p className="text-sm text-gray-500 sm:text-base">Số điện thoại:</p>
                        <p className="font-bold text-[#22C55E]">{orderDetail.customerPhone || 'Chưa có số điện thoại'}</p>
                      </div>
                    </div>
                    <div className="flex gap-2.5">
                      <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#3366CC]" aria-hidden />
                      <div>
                        <p className="text-sm text-gray-500 sm:text-base">Email:</p>
                        <p className="break-all font-medium text-[#003366]">{orderDetail.customerEmail || 'Chưa có email'}</p>
                      </div>
                    </div>
                    <div className="flex gap-2.5">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#3366CC]" aria-hidden />
                      <div>
                        <p className="text-sm text-gray-500 sm:text-base">Địa chỉ:</p>
                        <p className="font-medium text-[#003366]">{orderDetail.customerAddress || 'Chưa có địa chỉ'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thông tin đơn hàng */}
                <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4">
                  <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8F8F0]">
                      <ClipboardList className="h-4 w-4 text-[#22C55E]" />
                    </div>
                    <h4 className="text-sm font-bold uppercase tracking-wide text-[#22C55E] sm:text-base">Thông tin đơn hàng</h4>
                  </div>
                  <div className="space-y-3 text-base">
                    <div className="flex gap-2.5">
                      <ClipboardList className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#22C55E]" aria-hidden />
                      <div>
                        <p className="text-sm text-gray-500 sm:text-base">Mã đơn hàng:</p>
                        <p className="font-bold text-[#22C55E]">{orderDetail.code}</p>
                      </div>
                    </div>
                    <div className="flex gap-2.5">
                      <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#22C55E]" aria-hidden />
                      <div>
                        <p className="text-sm text-gray-500 sm:text-base">Ngày tạo:</p>
                        <p className="font-bold text-[#22C55E]">{formatOrderDetailDateTime(orderDetail.orderDate)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2.5">
                      <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#22C55E]" aria-hidden />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-500 sm:text-base">Trạng thái đơn:</p>
                        <div className="mt-1">
                          {orderDetailStatusUi ? (
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${orderDetailStatusUi.pillClass}`}
                            >
                              {orderDetailStatusUi.labelVi}
                            </span>
                          ) : (
                            <span className="text-gray-600">—</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2.5">
                      <Package className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#22C55E]" aria-hidden />
                      <div>
                        <p className="text-sm text-gray-500 sm:text-base">Trạng thái giao:</p>
                        <p className="font-bold text-[#22C55E]">{getDeliveryStatusLabel(orderDetail.deliveryStatus)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tổng tiền + số dòng sản phẩm — bản compact */}
              <div className="grid grid-cols-1 gap-2 rounded-lg border border-emerald-100 bg-gradient-to-br from-emerald-50/90 to-white p-2.5 sm:grid-cols-2 sm:gap-3 sm:p-3">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#22C55E] text-white shadow-sm">
                    <DollarSign className="h-5 w-5" strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-500 sm:text-sm">Tổng tiền</p>
                    <p className="flex items-baseline gap-0.5 font-bold leading-none text-[#22C55E]">
                      <span className="text-xl sm:text-2xl">{orderDetail.totalAmount.toLocaleString('vi-VN')}</span>
                      <span className="text-xl sm:text-2xl">đ</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 sm:justify-end sm:gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3366CC] text-white shadow-sm">
                    <ShoppingBag className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 text-left sm:text-right">
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-500 sm:text-sm">Số sản phẩm</p>
                    <p className="text-xl font-bold leading-tight text-[#003366] sm:text-2xl">
                      {orderDetail.orderItems.length} sản phẩm
                    </p>
                  </div>
                </div>
              </div>

              {/* Sản phẩm trong đơn — compact */}
              <div>
                <div className="mb-2 flex items-center gap-1.5">
                  <ShoppingBag className="h-3.5 w-3.5 shrink-0 text-[#7C3AED] sm:h-4 sm:w-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wide text-[#7C3AED] sm:text-sm">Sản phẩm trong đơn</h4>
                </div>
                {orderDetail.orderItems.length > 0 ? (
                  <div className="space-y-2">
                    {orderDetail.orderItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2.5 rounded-lg border border-gray-200 bg-white p-2.5 shadow-sm sm:gap-3 sm:p-3"
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-gray-100 bg-gray-50 sm:h-14 sm:w-14">
                          <Package className="h-6 w-6 text-gray-300 sm:h-7 sm:w-7" aria-hidden />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-base font-bold leading-snug text-[#003366] sm:text-lg">{item.productName}</p>
                          <p className="mt-0.5 text-sm text-gray-500 sm:text-base">Số lượng: {item.quantity}</p>
                        </div>
                        <div className="shrink-0 self-center text-right">
                          <p className="flex items-baseline justify-end gap-0.5 font-bold tabular-nums text-[#22C55E]">
                            {item.itemsPrice == null ? (
                              <span className="text-base sm:text-lg">Chưa có giá</span>
                            ) : (
                              <>
                                <span className="text-base sm:text-lg">{item.itemsPrice.toLocaleString('vi-VN')}</span>
                                <span className="text-base sm:text-lg">đ</span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-md border border-dashed border-gray-200 bg-gray-50/80 py-4 text-center text-sm text-gray-600 sm:py-5 sm:text-base">
                    Đơn hàng chưa có sản phẩm.
                  </p>
                )}
              </div>
            </div>
          )}

          {!orderDetailLoading && !orderDetail && (
            <p className="py-10 text-center text-base text-gray-600">Không có dữ liệu đơn hàng.</p>
          )}
        </ModalShell>
      )}
    </div>
  )
}

