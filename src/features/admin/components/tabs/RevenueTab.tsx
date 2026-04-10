import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import Button from '@/components/ui/button/Button'
import Card from '@/components/ui/card/Card'
import Select from '@/components/ui/select/Select'
import { MONTH_OPTIONS, REVENUE_BY_MONTH, REVENUE_ORDERS } from '@/components/admin/admin-dashboard-data'
import { CheckCircle, Clock, DollarSign, TrendingDown, TrendingUp, Users, ArrowDown, ArrowUp, XCircle } from 'lucide-react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { toast } from 'react-toastify'
import { useAdminDashboard } from '../../hooks/useAdminDashboard'
import { OrderApi } from '../../api/order-api'
import type { AdminOrderDetail, AdminOrderItem } from '../../types/order-type'

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

export default function RevenueTab() {
  const { sortBy, sortOrder, toggleSort } = useAdminDashboard()
  const [selectedRevenueChartMonth, setSelectedRevenueChartMonth] = useState('2026-01')
  const [selectedTotalRevenueMonth, setSelectedTotalRevenueMonth] = useState('2026-01')
  const [selectedPendingRevenueMonth, setSelectedPendingRevenueMonth] = useState('2026-01')
  const [selectedCancelledRevenueMonth, setSelectedCancelledRevenueMonth] = useState('2026-01')
  const [apiOrders, setApiOrders] = useState<AdminOrderItem[] | null>(null)
  const [orderDetailModalOpen, setOrderDetailModalOpen] = useState(false)
  const [orderDetailLoading, setOrderDetailLoading] = useState(false)
  const [orderDetail, setOrderDetail] = useState<AdminOrderDetail | null>(null)

  const currentRevenueData = REVENUE_BY_MONTH[selectedTotalRevenueMonth as keyof typeof REVENUE_BY_MONTH]
  const currentPendingRevenueData = REVENUE_BY_MONTH[selectedPendingRevenueMonth as keyof typeof REVENUE_BY_MONTH]
  const currentCancelledRevenueData = REVENUE_BY_MONTH[selectedCancelledRevenueMonth as keyof typeof REVENUE_BY_MONTH]
  const currentRevenueChartData = REVENUE_BY_MONTH[selectedRevenueChartMonth as keyof typeof REVENUE_BY_MONTH]

  // Revenue tab: KPI summary + revenue trend chart + sortable order cards list.
  const completedOrders = REVENUE_ORDERS.filter(o => o.status === 'completed').length

  const getSortedOrders = () => {
    const sorted = [...REVENUE_ORDERS].sort((a, b) => {
      let comparison = 0

      if (sortBy === 'date') {
        const dateA = new Date(a.date.split('/').reverse().join('-') + ' ' + a.time)
        const dateB = new Date(b.date.split('/').reverse().join('-') + ' ' + b.time)
        comparison = dateA.getTime() - dateB.getTime()
      } else if (sortBy === 'value') {
        comparison = a.value - b.value
      } else if (sortBy === 'customer') {
        comparison = a.customer.localeCompare(b.customer)
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    return sorted
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await OrderApi.getOrders(1, 20)
        setApiOrders(response.data.items.map(mapApiOrderItem))
      } catch (error) {
        console.log('Fetch orders failed:', error)
      }
    }
    fetchOrders()
  }, [])

  const sortedApiOrders = useMemo(() => {
    if (!apiOrders) return []
    const sorted = [...apiOrders].sort((a, b) => {
      let comparison = 0
      if (sortBy === 'date') {
        comparison = new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()
      } else if (sortBy === 'value') {
        comparison = a.totalAmount - b.totalAmount
      } else if (sortBy === 'customer') {
        comparison = a.name.localeCompare(b.name)
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })
    return sorted
  }, [apiOrders, sortBy, sortOrder])

  const sortIndicator = (column: typeof sortBy) => {
    if (sortBy !== column) return null
    return sortOrder === 'desc' ? <ArrowDown className="h-3 w-3 ml-1" /> : <ArrowUp className="h-3 w-3 ml-1" />
  }

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 hover:shadow-lg transition-shadow border-l-4 border-l-[#2ECC71]">
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 rounded-lg bg-green-50">
              <DollarSign className="h-6 w-6 text-[#2ECC71]" />
            </div>
            <Select value={selectedTotalRevenueMonth} onChange={(e) => setSelectedTotalRevenueMonth(e.target.value)} className="h-8 w-28 bg-white border border-gray-200 px-2 py-1 text-xs">
              {MONTH_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.shortLabel}
                </option>
              ))}
            </Select>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">Tổng doanh thu</h3>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-[#2ECC71]">{(currentRevenueData.totalRevenue / 1000000).toFixed(1)}M</p>
            <TrendingUp className="h-5 w-5 text-[#2ECC71]" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Từ {currentRevenueData.completedOrders} đơn hàng</p>
        </Card>

        <Card className="p-5 hover:shadow-lg transition-shadow border-l-4 border-l-[#FF9800]">
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 rounded-lg bg-orange-50">
              <Clock className="h-6 w-6 text-[#FF9800]" />
            </div>
            <Select value={selectedPendingRevenueMonth} onChange={(e) => setSelectedPendingRevenueMonth(e.target.value)} className="h-8 w-28 bg-white border border-gray-200 px-2 py-1 text-xs">
              {MONTH_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.shortLabel}
                </option>
              ))}
            </Select>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">Chờ thanh toán</h3>
          <p className="text-3xl font-bold text-[#FF9800]">{(currentPendingRevenueData.pendingRevenue / 1000000).toFixed(1)}M</p>
          <p className="text-xs text-gray-500 mt-2">{currentPendingRevenueData.pendingOrders} đơn đang chờ</p>
        </Card>

        <Card className="p-5 hover:shadow-lg transition-shadow border-l-4 border-l-[#F44336]">
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 rounded-lg bg-red-50">
              <XCircle className="h-6 w-6 text-[#F44336]" />
            </div>
            <Select value={selectedCancelledRevenueMonth} onChange={(e) => setSelectedCancelledRevenueMonth(e.target.value)} className="h-8 w-28 bg-white border border-gray-200 px-2 py-1 text-xs">
              {MONTH_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.shortLabel}
                </option>
              ))}
            </Select>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">Đơn hàng bị hủy</h3>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-[#F44336]">{(currentCancelledRevenueData.cancelledRevenue / 1000000).toFixed(1)}M</p>
            <TrendingDown className="h-5 w-5 text-[#F44336]" />
          </div>
          <p className="text-xs text-gray-500 mt-2">{currentCancelledRevenueData.cancelledOrders} đơn bị hủy</p>
        </Card>

        <Card className="p-5 hover:shadow-lg transition-shadow border-l-4 border-l-[#3366CC]">
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 rounded-lg bg-blue-50">
              <CheckCircle className="h-6 w-6 text-[#3366CC]" />
            </div>
            <TrendingUp className="h-5 w-5 text-[#2ECC71]" />
          </div>
          <h3 className="text-sm text-gray-600 mb-1">Đơn hoàn thành</h3>
          <p className="text-3xl font-bold text-[#3366CC]">{completedOrders}</p>
          <p className="text-xs text-gray-500 mt-2">Từ bảng đơn hàng</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-[#003366] text-lg font-semibold">Doanh thu theo thời gian</h3>
            <p className="text-sm text-gray-500">Biểu đồ doanh thu theo tháng</p>
          </div>
          <Select value={selectedRevenueChartMonth} onChange={(e) => setSelectedRevenueChartMonth(e.target.value)} className="w-40 border border-gray-200 bg-white py-2">
            {MONTH_OPTIONS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </Select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={currentRevenueChartData.chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip
              contentStyle={{ backgroundColor: 'white', border: '1px solid #e0e0e0', borderRadius: '8px' }}
              formatter={(value: any) => `${(value / 1000000).toFixed(2)}M VND`}
            />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#2ECC71" strokeWidth={3} dot={{ fill: '#2ECC71', r: 5 }} name="Doanh thu" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[#003366] text-lg font-semibold">Chi tiết đơn hàng</h3>
            <p className="text-sm text-gray-500">Danh sách {apiOrders ? apiOrders.length : REVENUE_ORDERS.length} đơn hàng trong khoảng thời gian</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => toggleSort('date')} className={sortBy === 'date' ? 'bg-blue-50 border-[#3366CC]' : ''}>
              Ngày
              {sortIndicator('date')}
            </Button>
            <Button variant="outline" size="sm" onClick={() => toggleSort('value')} className={sortBy === 'value' ? 'bg-blue-50 border-[#3366CC]' : ''}>
              Giá trị
              {sortIndicator('value')}
            </Button>
            <Button variant="outline" size="sm" onClick={() => toggleSort('customer')} className={sortBy === 'customer' ? 'bg-blue-50 border-[#3366CC]' : ''}>
              Khách hàng
              {sortIndicator('customer')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {apiOrders
            ? sortedApiOrders.map((order) => {
              const orderDate = new Date(order.orderDate)
              const dateText = orderDate.toLocaleDateString('vi-VN')
              const timeText = orderDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
              const badgeClass =
                  order.deliveryStatus === 'Delivered'
                    ? 'bg-[#1F9D55]'
                    : order.deliveryStatus === 'Cancelled'
                      ? 'bg-[#C62828]'
                      : 'bg-[#EF6C00]'
              const badgeText =
                  order.deliveryStatus === 'Delivered'
                    ? 'Đã giao'
                    : order.deliveryStatus === 'Cancelled'
                      ? 'Đã hủy'
                      : 'Đang xử lý'

              return (
                <Card key={order.id} className="p-4 hover:shadow-md transition-shadow flex flex-col justify-between h-full border-t-4 border-t-[#2ECC71] bg-white group">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-[#003366] text-lg">{order.code}</h3>
                      <span className={`px-2 py-1 rounded text-[10px] text-white ${badgeClass}`}>
                        {badgeText}
                      </span>
                    </div>
                    <div className="space-y-3 mb-4">
                      <div className="flex flex-col gap-1">
                        <p className="text-[10px] text-gray-400 uppercase font-medium">Tên đơn hàng</p>
                        <p className="text-sm font-semibold text-[#003366] line-clamp-1 italic">{order.name}</p>
                      </div>
                      <div className="bg-[#F5F7FA] p-2 rounded-lg">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Trạng thái đơn</p>
                        <div className="flex justify-between text-xs mb-1 last:mb-0">
                          <span className="text-gray-700 line-clamp-1 flex-1">{order.status}</span>
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
            : getSortedOrders().map(order => (
              <Card key={order.id} className="p-4 hover:shadow-md transition-shadow flex flex-col justify-between h-full border-t-4 border-t-[#2ECC71] bg-white group">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-[#003366] text-lg">{order.id}</h3>
                    <span className={`px-2 py-1 rounded text-[10px] text-white ${order.status === 'completed' ? 'bg-[#1F9D55]' : 'bg-[#EF6C00]'}`}>
                      {order.status === 'completed' ? 'Hoàn thành' : 'Chờ xử lý'}
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
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" /> Staff: {order.staff}</span>
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
            ))}
        </div>
      </Card>

      {orderDetailModalOpen && (
        <ModalShell onClose={closeOrderDetailModal}>
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-[#003366]">Chi tiết đơn hàng</h3>
              <p className="text-sm text-gray-500">{orderDetail?.code ? `Đơn ${orderDetail.code}` : 'Đang tải thông tin đơn...'}</p>
            </div>
            <Button variant="outline" size="sm" onClick={closeOrderDetailModal}>
              Đóng
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
                <div className="flex justify-between gap-2 border-b border-gray-100 pb-2">
                  <dt className="text-gray-500">Trạng thái đơn</dt>
                  <dd className="text-right">{orderDetail.status}</dd>
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

