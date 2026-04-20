import { useEffect, useMemo, useState } from 'react'
import { Box, CheckCircle, Clock, Eye, Loader2, Mail, Package, MapPin, Phone, Truck, User, Users, X, XCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import Card from '@/components/ui/card/Card'
import Button from '@/components/ui/button/Button'
import Tag from '@/components/ui/tag/Tag'
import PaginationBar from '@/components/ui/pagination/PaginationBar'
import { ManagerShipperApi } from '../../api/shipper-api'
import { ManagerOrderApi } from '../../api/order-api'
import type { ManagerOrderItem, ManagerOrderLineItem } from '../../types/order-type'
import type { ManagerShipperApiItem } from '../../types/shipper-type'
import { ITEMS_PER_PAGE } from '../../data/manager-dashboard-data'

function shipperStatusTag(shipper: ManagerShipperApiItem) {
  const online = String(shipper.shipperStatus).toLowerCase() === 'online'
  return online
    ? <Tag variant="success" size="sm" className="text-[10px] h-4 px-2">Hoạt động</Tag>
    : <Tag variant="gray" size="sm" className="text-[10px] h-4 px-2">Offline</Tag>
}

function normalizeOrder(raw: unknown): ManagerOrderItem {
  const item = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  const orderItemsRaw = Array.isArray(item.orderItems) ? item.orderItems : []
  const orderItems: ManagerOrderLineItem[] = orderItemsRaw
    .map((entry) => {
      const row = entry && typeof entry === 'object' ? (entry as Record<string, unknown>) : {}
      const quantity = Number(row.quantity ?? 0)
      const lineTotal = Number(row.itemsPrice ?? 0)
      const productName = String(row.productName ?? '').trim()
      if (!productName) return null
      return {
        productName,
        quantity: Number.isFinite(quantity) ? quantity : 0,
        lineTotal: Number.isFinite(lineTotal) ? lineTotal : 0,
        unitPrice: quantity > 0 ? lineTotal / quantity : lineTotal
      }
    })
    .filter((entry): entry is ManagerOrderLineItem => entry != null)

  return {
    id: String(item.id ?? ''),
    customerId: String(item.customerId ?? ''),
    customerName: String(item.customerName ?? 'Khách lẻ'),
    customerPhone: String(item.customerPhoneNumber ?? item.customerPhone ?? ''),
    customerAddress: String(item.customerAddress ?? ''),
    orderDate: String(item.orderDate ?? ''),
    name: String(item.name ?? 'Đơn hàng'),
    status: String(item.status ?? 'Pending'),
    totalAmount: Number(item.totalAmount ?? 0),
    deliveryStatus: String(item.deliveryStatus ?? 'Pending'),
    code: String(item.code ?? ''),
    orderItems: orderItems.length ? orderItems : undefined
  }
}

function getOrderLineItems(order: ManagerOrderItem): ManagerOrderLineItem[] {
  if (order.orderItems?.length) return order.orderItems
  return [{
    productName: order.name || 'Đơn hàng',
    quantity: 1,
    unitPrice: order.totalAmount,
    lineTotal: order.totalAmount
  }]
}

function orderStatusPill(status: string): { label: string; className: string } {
  const s = String(status)
  const map: Record<string, { label: string; className: string }> = {
    Pending: { label: 'Chờ xử lý', className: 'bg-[#facc15] text-white' },
    Draft: { label: 'Đợi duyệt', className: 'bg-gray-400 text-white' },
    Cancelled: { label: 'Đã hủy', className: 'bg-[#FB2C36] text-white' },
    Shipped: { label: 'Đang giao', className: 'bg-[#3366CC] text-white' },
    Completed: { label: 'Hoàn thành', className: 'bg-[#26C271] text-white' },
    PendingReturn: { label: 'Chờ trả hàng', className: 'bg-[#FF9800] text-white' },
    Returned: { label: 'Đã trả', className: 'bg-gray-500 text-white' },
    ReturnedDefective: { label: 'Xã hàng lỗi', className: 'bg-amber-700 text-white' }
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

/** PATCH /orders/{id}/cancel — khi delivery còn pending (0 / Pending). */
function isDeliveryPending(order: ManagerOrderItem): boolean {
  const d = order.deliveryStatus
  if (d === 0 || d === '0') return true
  if (typeof d === 'string' && /pending/i.test(d)) return true
  return false
}

function ViewOrderModal({
  open,
  loading,
  order,
  onClose,
  onCancelSuccess
}: {
  open: boolean
  loading: boolean
  order: ManagerOrderItem | null
  onClose: () => void
  onCancelSuccess: () => void
}) {
  const [canceling, setCanceling] = useState(false)

  if (!open) return null

  const canCancelOrder =
    order != null &&
    String(order.status) !== 'Cancelled' &&
    isDeliveryPending(order)

  const handleCancelOrder = async () => {
    if (!order || !canCancelOrder) return
    setCanceling(true)
    try {
      const msg = await ManagerOrderApi.cancelOrder(order.id)
      toast.success(msg)
      onClose()
      onCancelSuccess()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Không thể hủy đơn hàng.')
    } finally {
      setCanceling(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4" onMouseDown={onClose}>
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto" onMouseDown={(event) => event.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-gray-100 bg-white px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-[#003366]">Chi tiết đơn hàng</h3>
            <p className="text-sm text-gray-500 mt-0.5">{order ? `Mã đơn: ${order.code || order.id}` : 'Đang tải...'}</p>
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
          <div className="flex flex-col">
            <div className="space-y-4 p-5">
              <div className="rounded-xl bg-[#EAF3FF] px-4 py-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Trạng thái đơn hàng</p>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${orderStatusPill(String(order.status)).className}`}>
                    {orderStatusPill(String(order.status)).label}
                  </span>
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
                  {getOrderLineItems(order).map((line, idx) => (
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
                  <p className="text-sm font-semibold text-[#003366]">
                    {getOrderLineItems(order).reduce((sum, line) => sum + line.quantity, 0)} sản phẩm
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs text-gray-600">Tổng thanh toán</p>
                  <p className="text-xl font-bold text-[#26C271]">{formatMoney(order.totalAmount)}</p>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 flex flex-wrap gap-2 border-t border-gray-100 bg-white px-5 py-4">
              <Button
                type="button"
                disabled={!canCancelOrder || canceling}
                className="w-full min-h-[44px] bg-[#F1B40E] hover:bg-[#e0a60d] text-white border-0 disabled:opacity-60"
                onClick={() => void handleCancelOrder()}
              >
                {canceling ? (
                  <Loader2 className="h-4 w-4 mr-1.5 inline animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4 mr-1.5 inline" />
                )}
                Hủy đơn
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

function shippingOrderStatusTag(order: ManagerOrderItem) {
  if (String(order.status).toLowerCase() === 'pending') return <Tag variant="warn" size="sm" className="text-[10px] h-4 px-2">Chờ giao</Tag>
  return <Tag variant="gray" size="sm" className="text-[10px] h-4 px-2">{order.status}</Tag>
}

function isAssignedDeliveryStatus(deliveryStatus: ManagerOrderItem['deliveryStatus']): boolean {
  const normalized = String(deliveryStatus ?? '').trim().toLowerCase()
  return normalized === 'pending' || normalized === 'completed' || normalized === '0' || normalized === '1'
}

const SHIPPER_PAGE_SIZE = 9

export default function ShippersTab() {
  const [shipperPage, setShipperPage] = useState(1)
  const [ordersPage, setOrdersPage] = useState(1)
  const [shippers, setShippers] = useState<ManagerShipperApiItem[]>([])
  const [shipperTotalPages, setShipperTotalPages] = useState(1)
  const [shipperLoading, setShipperLoading] = useState(false)
  const [shipperError, setShipperError] = useState<string | null>(null)
  const [shipperReload, setShipperReload] = useState(0)
  const [pendingOrders, setPendingOrders] = useState<ManagerOrderItem[]>([])
  const [ordersTotalPages, setOrdersTotalPages] = useState(1)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState<string | null>(null)
  const [selectedShipperByOrder, setSelectedShipperByOrder] = useState<Record<string, string>>({})
  const [assigningOrderId, setAssigningOrderId] = useState<string | null>(null)
  const [viewOrderOpen, setViewOrderOpen] = useState(false)
  const [viewOrderLoading, setViewOrderLoading] = useState(false)
  const [viewOrderDetail, setViewOrderDetail] = useState<ManagerOrderItem | null>(null)
  const [ordersReload, setOrdersReload] = useState(0)

  const totalOrderPages = Math.max(1, ordersTotalPages)

  useEffect(() => {
    const fetchShippers = async () => {
      setShipperLoading(true)
      setShipperError(null)
      try {
        const response = await ManagerShipperApi.getShippers({
          pageIndex: shipperPage,
          pageSize: SHIPPER_PAGE_SIZE
        })
        const data = response?.data
        const items = Array.isArray(data?.items) ? data.items : []
        const pages = data?.meta?.total_pages ?? 1
        setShippers(items)
        setShipperTotalPages(Math.max(1, pages))
      } catch {
        setShipperError('Không thể tải danh sách shipper. Vui lòng thử lại.')
        setShippers([])
        setShipperTotalPages(1)
      } finally {
        setShipperLoading(false)
      }
    }

    void fetchShippers()
  }, [shipperPage, shipperReload])

  useEffect(() => {
    const fetchPendingOrders = async () => {
      setOrdersLoading(true)
      setOrdersError(null)
      try {
        const response = await ManagerOrderApi.getOrders({
          pageNumber: ordersPage,
          pageSize: ITEMS_PER_PAGE,
          orderStatuses: ['Pending']
        })
        const items = Array.isArray(response?.data?.items) ? response.data.items : []
        const pages = response?.data?.meta?.total_pages ?? 1
        const normalizedItems = items.map((item) => normalizeOrder(item))
        const pendingOnly = normalizedItems.filter((item) => String(item.status).toLowerCase() === 'pending')
        setPendingOrders(pendingOnly)
        setOrdersTotalPages(Math.max(1, pages))
      } catch {
        setOrdersError('Không thể tải đơn hàng chờ xử lý.')
        setPendingOrders([])
        setOrdersTotalPages(1)
      } finally {
        setOrdersLoading(false)
      }
    }

    void fetchPendingOrders()
  }, [ordersPage, ordersReload])

  const handleAssignOrder = async (orderId: string) => {
    const shipperId = selectedShipperByOrder[orderId]
    if (!shipperId) {
      toast.warning('Vui lòng chọn shipper trước khi giao đơn.')
      return
    }
    setAssigningOrderId(orderId)
    try {
      await ManagerShipperApi.assignOrderToShipper(shipperId, orderId)
      setPendingOrders((prev) => prev.filter((order) => order.id !== orderId))
      setSelectedShipperByOrder((prev) => {
        const next = { ...prev }
        delete next[orderId]
        return next
      })
      setShipperReload((n) => n + 1)
      toast.success('Đã chọn shipper thành công.')
    } catch {
      toast.error('Không thể giao đơn cho shipper. Vui lòng thử lại.')
    } finally {
      setAssigningOrderId(null)
    }
  }

  const handleViewOrder = async (orderId: string) => {
    setViewOrderOpen(true)
    setViewOrderLoading(true)
    setViewOrderDetail(null)
    try {
      const response = await ManagerOrderApi.getOrderById(orderId)
      setViewOrderDetail(normalizeOrder(response))
    } catch {
      toast.error('Không thể tải chi tiết đơn hàng.')
      setViewOrderOpen(false)
    } finally {
      setViewOrderLoading(false)
    }
  }

  const activeCount = useMemo(
    () => shippers.filter((s) => String(s.shipperStatus).toLowerCase() === 'online').length,
    [shippers]
  )
  const shippingCount = useMemo(
    () => shippers.reduce((sum, s) => sum + (s.totalOrderShipNow ?? 0), 0),
    [shippers]
  )
  const deliveredCount = useMemo(
    () => shippers.reduce((sum, s) => sum + (s.totalOrderShipped ?? 0), 0),
    [shippers]
  )

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Shipper hoạt động</p>
              <p className="text-3xl font-bold text-[#003366]">{shipperLoading ? '…' : activeCount}</p>
              <p className="text-[10px] text-gray-500 mt-1">Theo trang hiện tại</p>
            </div>
            <Truck className="h-12 w-12 text-[#3366CC] opacity-50" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Đơn đang giao</p>
              <p className="text-3xl font-bold text-yellow-700">{shipperLoading ? '…' : shippingCount}</p>
              <p className="text-[10px] text-gray-500 mt-1">Tổng theo shipper trên trang</p>
            </div>
            <Clock className="h-12 w-12 text-yellow-600 opacity-50" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Đã giao</p>
              <p className="text-3xl font-bold text-[#2ECC71]">{shipperLoading ? '…' : deliveredCount}</p>
              <p className="text-[10px] text-gray-500 mt-1">Tổng theo shipper trên trang</p>
            </div>
            <CheckCircle className="h-12 w-12 text-[#2ECC71] opacity-50" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className="text-[#003366] text-xl font-semibold">Danh sách Shipper</h2>
            <p className="text-sm text-gray-500 mt-1">Quản lý đội ngũ giao hàng</p>
          </div>
        </div>

        {shipperError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {shipperError}
          </div>
        )}

        {shipperLoading && (
          <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
            Đang tải danh sách shipper...
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {!shipperLoading && shippers.length === 0 && (
            <div className="col-span-full rounded-md border border-gray-200 bg-gray-50 px-3 py-8 text-center text-sm text-gray-600">
              Chưa có dữ liệu shipper.
            </div>
          )}

          {shippers.map((shipper) => (
            <Card key={shipper.id} className="p-4 hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-12 w-12 shrink-0 rounded-full bg-[#3366CC] text-white flex items-center justify-center font-semibold shadow-inner">
                    <Truck className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-[#003366] text-lg leading-tight line-clamp-1">{shipper.shipperName}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {shipperStatusTag(shipper)}
                    </div>
                    {shipper.shipperPhone && (
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-[#3366CC]">
                        <Phone className="h-3.5 w-3.5 shrink-0" />
                        <a href={`tel:${shipper.shipperPhone}`} className="hover:underline truncate">
                          {shipper.shipperPhone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Đang giao</p>
                  <p className="font-bold text-[#003366] text-lg">{shipper.totalOrderShipNow ?? 0}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg">
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Đã giao</p>
                  <p className="font-bold text-[#003366] text-lg">{shipper.totalOrderShipped ?? 0}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6">
          <PaginationBar
            currentPage={shipperPage}
            setPage={setShipperPage}
            totalPage={shipperTotalPages}
          />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[#003366] text-xl font-semibold">Đơn hàng giao</h2>
            <p className="text-sm text-gray-500 mt-1">Danh sách đơn hàng có trạng thái Pending</p>
          </div>
        </div>

        {ordersError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {ordersError}
          </div>
        )}

        {ordersLoading && (
          <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
            Đang tải đơn hàng pending...
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {!ordersLoading && pendingOrders.length === 0 && (
            <div className="col-span-full rounded-md border border-gray-200 bg-gray-50 px-3 py-8 text-center text-sm text-gray-600">
              Không có đơn hàng pending.
            </div>
          )}

          {pendingOrders.map((order) => {
            const assignedDelivery = isAssignedDeliveryStatus(order.deliveryStatus)
            return (
              <div key={order.id} className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full border-t-4 border-t-[#3366CC]">
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-xl font-bold text-[#003366] leading-tight">{order.code || order.id}</h3>
                    {shippingOrderStatusTag(order)}
                  </div>

                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">Khách hàng</p>
                  <p className="text-sm font-semibold text-[#003366] mb-4 line-clamp-2">{order.customerName || 'Khách lẻ'}</p>

                  <div className="rounded-lg bg-[#F8FAFC] p-3 mb-4 flex-1">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-2">Đơn hàng</p>
                    <ul className="space-y-2">
                      {getOrderLineItems(order).slice(0, 4).map((line, idx) => (
                        <li key={`${line.productName}-${idx}`} className="flex justify-between gap-2 text-xs">
                          <span className="text-gray-700 min-w-0">
                            <span className="line-clamp-2">{line.productName}</span>
                            <span className="text-gray-400"> x{line.quantity}</span>
                          </span>
                          <span className="shrink-0 font-semibold text-[#16a34a]">{formatMoney(line.lineTotal)}</span>
                        </li>
                      ))}
                      {getOrderLineItems(order).length > 4 && (
                        <li className="text-[10px] text-gray-500">+{getOrderLineItems(order).length - 4} sản phẩm khác</li>
                      )}
                    </ul>
                  </div>

                  <div className="flex items-end justify-between gap-2 mb-4">
                    <div className="flex flex-col gap-1.5 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 shrink-0" />
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

                  <div className="pt-3 mt-auto border-t border-gray-100 space-y-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full h-10 rounded-lg border-[#3366CC] text-[#3366CC] hover:bg-[#3366CC]/5 bg-transparent font-medium"
                      onClick={() => void handleViewOrder(order.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Xem đơn hàng
                    </Button>
                    {assignedDelivery ? (
                      <div className="w-full rounded-md border border-[#BFD8FF] bg-[#EAF3FF] px-3 py-2 text-sm font-semibold text-[#1E5BB8] text-center">
                        Shipper đã giao
                      </div>
                    ) : (
                      <>
                        <select
                          className="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-sm text-[#003366] focus:outline-none focus:ring-2 focus:ring-[#3366CC]/30"
                          value={selectedShipperByOrder[order.id] ?? ''}
                          onChange={(event) => setSelectedShipperByOrder((prev) => ({ ...prev, [order.id]: event.target.value }))}
                          disabled={assigningOrderId === order.id}
                        >
                          <option value="">Chọn shipper</option>
                          {shippers.map((shipper) => (
                            <option key={shipper.id} value={shipper.id}>
                              {shipper.shipperName} - {shipper.shipperPhone}
                            </option>
                          ))}
                        </select>
                        <Button
                          size="sm"
                          className="w-full h-10 rounded-lg bg-[#3366CC] hover:bg-[#2952A3] text-white font-medium"
                          onClick={() => void handleAssignOrder(order.id)}
                          disabled={assigningOrderId === order.id}
                        >
                          {assigningOrderId === order.id ? 'Đang giao đơn...' : 'Chọn shipper'}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6">
          <PaginationBar
            currentPage={ordersPage}
            setPage={setOrdersPage}
            totalPage={totalOrderPages}
          />
        </div>
      </Card>

      <ViewOrderModal
        open={viewOrderOpen}
        loading={viewOrderLoading}
        order={viewOrderDetail}
        onClose={() => {
          setViewOrderOpen(false)
          setViewOrderDetail(null)
          setViewOrderLoading(false)
        }}
        onCancelSuccess={() => setOrdersReload((n) => n + 1)}
      />
    </div>
  )
}
