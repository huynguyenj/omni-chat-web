import { useCallback, useEffect, useState } from 'react'
import {
  Box,
  Calendar,
  CheckCircle2,
  Eye,
  Loader2,
  Mail,
  MapPin,
  Package,
  Phone,
  User,
  Users,
  X
} from 'lucide-react'
import { toast } from 'react-toastify'
import Card from '@/components/ui/card/Card'
import Button from '@/components/ui/button/Button'
import PaginationBar from '@/components/ui/pagination/PaginationBar'
import { ManagerOrderApi } from '../../api/order-api'
import PostSaleRequestsSection from './PostSaleRequestsSection'
import type { ManagerOrderItem, ManagerOrderLineItem, ManagerOrderStatus, ManagerOrderStatusFilter } from '../../types/order-type'

function readStr(obj: Record<string, unknown>, keys: string[]): string | undefined {
  for (const k of keys) {
    const v = obj[k]
    if (v != null && String(v).trim() !== '') return String(v)
  }
  return undefined
}

function normalizeOrderItem(raw: unknown): ManagerOrderItem {
  const o = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  const customer = o.customer && typeof o.customer === 'object' ? (o.customer as Record<string, unknown>) : {}
  const itemsRaw = Array.isArray(o.orderItems) ? o.orderItems : []

  const orderItems: ManagerOrderLineItem[] = itemsRaw
    .map((ir) => {
      const it = ir && typeof ir === 'object' ? (ir as Record<string, unknown>) : {}
      const qty = Math.max(1, Number(it.quantity ?? 1))
      const itemsPrice = it.itemsPrice != null ? Number(it.itemsPrice) : null
      const unitRaw = it.unitPrice != null ? Number(it.unitPrice) : null
      const lineTotal = itemsPrice ?? (unitRaw != null ? unitRaw * qty : 0)
      const unitPrice = unitRaw ?? (qty > 0 ? lineTotal / qty : 0)
      const productName = String(it.productName ?? it.product_name ?? '').trim()
      if (!productName) return null
      return { productName, quantity: qty, unitPrice, lineTotal }
    })
    .filter((x): x is ManagerOrderLineItem => x != null)

  return {
    id: String(o.id ?? ''),
    customerId: String(o.customerId ?? o.customer_id ?? ''),
    customerName: readStr(o, ['customerName', 'customer_name']) ?? readStr(customer, ['name', 'fullName']),
    customerPhone: readStr(o, ['customerPhoneNumber', 'customer_phone_number', 'customerPhone', 'customer_phone', 'phone', 'phoneNumber']) ?? readStr(customer, ['phone', 'phoneNumber']),
    customerEmail: readStr(o, ['customerEmail', 'customer_email', 'email']) ?? readStr(customer, ['email']),
    customerAddress: readStr(o, ['customerAddress', 'customer_address', 'address', 'shippingAddress']) ?? readStr(customer, ['address', 'shippingAddress']),
    orderDate: String(o.orderDate ?? o.order_date ?? ''),
    name: String(o.name ?? ''),
    status: String(o.status ?? '') as ManagerOrderStatus,
    totalAmount: Number(o.totalAmount ?? o.total_amount ?? 0),
    deliveryStatus: (() => {
      const v = o.deliveryStatus ?? o.delivery_status ?? 0
      if (typeof v === 'number' || typeof v === 'string') return v
      return 0
    })(),
    code: String(o.code ?? ''),
    orderItems: orderItems.length > 0 ? orderItems : undefined
  }
}

function getLineItems(order: ManagerOrderItem): ManagerOrderLineItem[] {
  if (order.orderItems?.length) return order.orderItems
  return [
    {
      productName: order.name || 'Sản phẩm',
      quantity: 1,
      unitPrice: order.totalAmount,
      lineTotal: order.totalAmount
    }
  ]
}

function orderStatusPill(status: string): { label: string; className: string } {
  const s = String(status)
  const map: Record<string, { label: string; className: string }> = {
    Pending: { label: 'Chờ xử lý', className: 'bg-[#facc15] text-white' },
    Draft: { label: 'Bản nháp', className: 'bg-gray-400 text-white' },
    Cancelled: { label: 'Đã hủy', className: 'bg-[#FB2C36] text-white' },
    Shipped: { label: 'Đã giao hàng', className: 'bg-[#3366CC] text-white' },
    Completed: { label: 'Đã hoàn thành', className: 'bg-[#26C271] text-white' },
    PendingReturn: { label: 'Chờ trả hàng', className: 'bg-[#FF9800] text-white' },
    Returned: { label: 'Đã trả hàng', className: 'bg-gray-500 text-white' },
    ReturnedDefective: { label: 'Đã trả hàng do lỗi', className: 'bg-amber-700 text-white' }
  }
  return map[s] ?? { label: s || '—', className: 'bg-gray-400 text-white' }
}

function formatMoney(n: number) {
  return `${n.toLocaleString('vi-VN')}đ`
}

function formatDateShort(iso: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('vi-VN')
}

type OrderDetailPostSaleContext = {
  id: string
  status: string
  type?: string
}

function OrderDetailModal({
  order,
  open,
  loading,
  onClose,
  onOrderActionSuccess,
  postSaleRequest
}: {
  order: ManagerOrderItem | null
  open: boolean
  loading: boolean
  onClose: () => void
  onOrderActionSuccess: () => void
  postSaleRequest?: OrderDetailPostSaleContext | null
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onMouseDown={onClose}>
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-gray-100 bg-white px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-[#003366]">Chi tiết đơn hàng</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {order ? `Mã đơn: ${order.code}` : 'Đang tải...'}
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" className="h-9 w-9 shrink-0 p-0" onClick={onClose} aria-label="Đóng">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {loading || !order ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 px-5">
            <Loader2 className="h-10 w-10 animate-spin text-[#3366CC]" />
            <p className="text-sm text-gray-600">Đang tải chi tiết đơn hàng...</p>
          </div>
        ) : (
          <OrderDetailModalBody
            order={order}
            postSaleRequest={postSaleRequest ?? null}
            onOrderActionSuccess={onOrderActionSuccess}
          />
        )}
      </div>
    </div>
  )
}

function OrderDetailModalBody({
  order,
  postSaleRequest,
  onOrderActionSuccess
}: {
  order: ManagerOrderItem
  postSaleRequest: OrderDetailPostSaleContext | null
  onOrderActionSuccess: () => void
}) {
  const [pendingAction, setPendingAction] = useState<'reject' | 'confirm' | null>(null)
  const lines = getLineItems(order)
  const totalQty = lines.reduce((s, l) => s + l.quantity, 0)
  const pill = orderStatusPill(String(order.status))
  const fromPostSaleList = Boolean(postSaleRequest?.id)
  const canSubmitDraft = !fromPostSaleList && order.status === 'Draft'

  const confirmDisabled = pendingAction !== null || !canSubmitDraft
  const showActionBar = canSubmitDraft

  const handleConfirmOrder = async () => {
    setPendingAction('confirm')
    try {
      const msg = await ManagerOrderApi.submitDraftOrder(order.id)
      toast.success(msg)
      onOrderActionSuccess()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Không thể gửi đơn nháp.')
    } finally {
      setPendingAction(null)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="space-y-4 p-5">
        <div className="rounded-xl bg-[#EAF3FF] px-4 py-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <p className="text-xs text-gray-600 mb-1">Trạng thái đơn hàng</p>
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${pill.className}`}>{pill.label}</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600 mb-1">Ngày đặt</p>
            <p className="text-base font-semibold text-[#003366]">{formatDateShort(order.orderDate)}</p>
          </div>
        </div>

        <div className="rounded-xl bg-[#F5F7FA] p-4">
          <div className="flex items-center gap-2 text-[#003366] font-semibold text-sm mb-3">
            <Users className="h-4 w-4 shrink-0" />
            Thông tin khách hàng
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2 text-gray-700">
              <User className="h-4 w-4 mt-0.5 shrink-0 text-gray-500" />
              <span>{order.customerName || 'Khách lẻ'}</span>
            </li>
            {order.customerPhone && (
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 shrink-0 text-gray-500" />
                <a href={`tel:${order.customerPhone}`} className="text-[#3366CC] font-medium hover:underline">
                  {order.customerPhone}
                </a>
              </li>
            )}
            {order.customerEmail && (
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 shrink-0 text-gray-500" />
                <a href={`mailto:${order.customerEmail}`} className="text-[#3366CC] font-medium hover:underline break-all">
                  {order.customerEmail}
                </a>
              </li>
            )}
            {order.customerAddress && (
              <li className="flex items-start gap-2 text-gray-700">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-gray-500" />
                <span>{order.customerAddress}</span>
              </li>
            )}
          </ul>
        </div>

        <div>
          <div className="flex items-center gap-2 text-[#003366] font-semibold text-sm mb-3">
            <Package className="h-4 w-4 shrink-0" />
            Sản phẩm đã đặt
          </div>
          <div className="space-y-3">
            {lines.map((line, idx) => (
              <div key={`${line.productName}-${idx}`} className="rounded-xl border border-gray-200 bg-white p-3 flex gap-3">
                <div className="h-14 w-14 shrink-0 rounded-lg bg-[#EAF3FF] flex items-center justify-center border border-[#BFD8FF]">
                  <Box className="h-6 w-6 text-[#3366CC]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[#003366] text-sm leading-snug">{line.productName}</p>
                  <p className="text-xs text-gray-500 mt-1">Số lượng: {line.quantity}</p>
                  <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs">
                    <span className="text-gray-600">Đơn giá: {formatMoney(line.unitPrice)}</span>
                    <span className="font-semibold text-[#26C271]">Thành tiền: {formatMoney(line.lineTotal)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-[#E8F8EF] px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-xs text-gray-600">Tổng số lượng</p>
            <p className="text-sm font-semibold text-[#003366]">{totalQty} sản phẩm</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-gray-600">Tổng thanh toán</p>
            <p className="text-xl font-bold text-[#26C271]">{formatMoney(order.totalAmount)}</p>
          </div>
        </div>
      </div>

      {showActionBar && (
        <div className="sticky bottom-0 flex flex-wrap gap-2 border-t border-gray-100 bg-white px-5 py-4">
          <Button
            type="button"
            disabled={confirmDisabled}
            className="flex-1 min-w-[120px] bg-[#26C271] hover:bg-[#22b366] text-white border-0 disabled:opacity-60"
            onClick={() => void handleConfirmOrder()}
          >
            {pendingAction === 'confirm' ? (
              <Loader2 className="h-4 w-4 mr-1.5 inline animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4 mr-1.5 inline" />
            )}
            Xác nhận
          </Button>
        </div>
      )}
    </div>
  )
}

function OrderCard({
  order,
  onDetail
}: {
  order: ManagerOrderItem
  onDetail: () => void
}) {
  const lines = getLineItems(order)
  const pill = orderStatusPill(String(order.status))

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full border-t-4 border-t-[#3366CC]">
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-xl font-bold text-[#003366] leading-tight">{order.code}</h3>
          <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap ${pill.className}`}>
            {pill.label}
          </span>
        </div>

        <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">Khách hàng</p>
        <p className="text-sm font-semibold text-[#003366] mb-4 line-clamp-2">{order.customerName || 'Khách lẻ'}</p>

        <div className="rounded-lg bg-[#F8FAFC] p-3 mb-4 flex-1">
          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-2">Đơn hàng</p>
          <ul className="space-y-2">
            {lines.slice(0, 4).map((line, idx) => (
              <li key={`${line.productName}-${idx}`} className="flex justify-between gap-2 text-xs">
                <span className="text-gray-700 min-w-0">
                  <span className="line-clamp-2">{line.productName}</span>
                  <span className="text-gray-400"> x{line.quantity}</span>
                </span>
                <span className="shrink-0 font-semibold text-[#16a34a]">{formatMoney(line.lineTotal)}</span>
              </li>
            ))}
            {lines.length > 4 && (
              <li className="text-[10px] text-gray-500">+{lines.length - 4} sản phẩm khác</li>
            )}
          </ul>
        </div>

        <div className="flex items-end justify-between gap-2 mb-4">
          <div className="flex flex-col gap-1.5 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              {formatDateShort(order.orderDate)}
            </span>
            {order.customerPhone && (
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                {order.customerPhone}
              </span>
            )}
          </div>
          <p className="text-xl font-bold text-[#16a34a] leading-none">{formatMoney(order.totalAmount)}</p>
        </div>

        <div className="pt-3 mt-auto border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full h-10 rounded-lg border-[#3366CC] text-[#3366CC] hover:bg-[#3366CC]/5 bg-transparent font-medium"
            onClick={onDetail}
          >
            <Eye className="h-4 w-4 mr-2 inline" />
            Chi tiết đơn hàng
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function OrdersTab() {
  const [page, setPage] = useState(1)
  const [selectedStatus, setSelectedStatus] = useState<'all' | ManagerOrderStatusFilter>('Pending')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orders, setOrders] = useState<ManagerOrderItem[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [detailOrder, setDetailOrder] = useState<ManagerOrderItem | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailPostSaleContext, setDetailPostSaleContext] = useState<OrderDetailPostSaleContext | null>(null)
  const [postSaleListRefreshKey, setPostSaleListRefreshKey] = useState(0)
  const pageSize = 6
  const ORDER_STATUS_FILTERS: Array<{ value: 'all' | ManagerOrderStatusFilter; label: string }> = [
    { value: 'all', label: 'Tất cả' },
    { value: 'Draft', label: 'Bản nháp' },
    { value: 'Pending', label: 'Chờ xử lý' },
    { value: 'Shipped', label: 'Đã giao hàng' },
    { value: 'Completed', label: 'Đã hoàn thành' },
    { value: 'Cancelled', label: 'Đã hủy' },
    { value: 'PendingReturn', label: 'Chờ trả hàng' },
    { value: 'Returned', label: 'Đã trả hàng' },
    { value: 'ReturnedDefective', label: 'Đã trả hàng do lỗi' }
  ]

  const openOrderDetailById = async (orderId: string, psr?: OrderDetailPostSaleContext | null) => {
    if (!orderId) {
      toast.error('Không có mã đơn để tải chi tiết.')
      return
    }
    setDetailPostSaleContext(psr ?? null)
    setDetailOpen(true)
    setDetailOrder(null)
    setDetailLoading(true)
    try {
      const data = await ManagerOrderApi.getOrderById(orderId)
      setDetailOrder(normalizeOrderItem(data))
    } catch {
      toast.error('Không thể tải chi tiết đơn hàng. Vui lòng thử lại.')
      setDetailOpen(false)
    } finally {
      setDetailLoading(false)
    }
  }

  const openOrderDetail = async (order: ManagerOrderItem) => {
    await openOrderDetailById(order.id, null)
  }

  const closeOrderDetail = () => {
    setDetailOpen(false)
    setDetailOrder(null)
    setDetailLoading(false)
    setDetailPostSaleContext(null)
  }

  const fetchOrders = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await ManagerOrderApi.getOrders({
        pageNumber: page,
        pageSize,
        orderStatuses: selectedStatus === 'all'
          ? undefined
          : [selectedStatus]
      })
      const items = response?.data?.items ?? []
      const pages = response?.data?.meta?.total_pages ?? 1
      setOrders(items.map((item) => normalizeOrderItem(item as unknown)))
      setTotalPages(Math.max(1, pages))
    } catch {
      setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại.')
      setOrders([])
    } finally {
      setIsLoading(false)
    }
  }, [page, pageSize, selectedStatus])

  useEffect(() => {
    void fetchOrders()
  }, [fetchOrders])

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[#003366] text-xl font-semibold">Đơn hàng giao</h2>
            <p className="text-sm text-gray-500 mt-1">
              Danh sách đơn hàng có trạng thái {
                ORDER_STATUS_FILTERS.find((s) => s.value === selectedStatus)?.label ?? selectedStatus
              }
            </p>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {ORDER_STATUS_FILTERS.map((status) => {
            const active = selectedStatus === status.value
            return (
              <Button
                key={status.value}
                size="sm"
                variant={active ? 'default' : 'outline'}
                className={active ? 'bg-[#3366CC] hover:bg-[#2952A3]' : ''}
                onClick={() => {
                  setSelectedStatus(status.value)
                  setPage(1)
                }}
                disabled={isLoading}
              >
                {status.label}
              </Button>
            )
          })}
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
            Đang tải danh sách đơn hàng...
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {!isLoading && orders.length === 0 && (
            <div className="col-span-full rounded-md border border-gray-200 bg-gray-50 px-3 py-8 text-center text-sm text-gray-600">
              Chưa có dữ liệu đơn hàng.
            </div>
          )}

          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onDetail={() => void openOrderDetail(order)} />
          ))}
        </div>

        <div className="mt-6">
          <PaginationBar
            currentPage={page}
            setPage={setPage}
            totalPage={totalPages}
          />
        </div>
      </Card>

      <PostSaleRequestsSection
        listRefreshKey={postSaleListRefreshKey}
        onStatusActionSuccess={() => {
          void fetchOrders()
          setPostSaleListRefreshKey((k) => k + 1)
        }}
        onViewOrder={(orderId, req) =>
          void openOrderDetailById(orderId, {
            id: req.id,
            status: String(req.status),
            type: String(req.type)
          })
        }
      />

      <OrderDetailModal
        order={detailOrder}
        open={detailOpen}
        loading={detailLoading}
        onClose={closeOrderDetail}
        postSaleRequest={detailPostSaleContext}
        onOrderActionSuccess={() => {
          closeOrderDetail()
          void fetchOrders()
          setPostSaleListRefreshKey((k) => k + 1)
        }}
      />
    </div>
  )
}
