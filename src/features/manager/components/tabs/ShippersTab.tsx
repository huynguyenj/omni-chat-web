import { useMemo, useState } from 'react'
import { CheckCircle, Clock, Eye, Truck, Plus, MapPin, Phone, Package, Eye as EyeIcon } from 'lucide-react'
import Card from '@/components/ui/card/Card'
import Button from '@/components/ui/button/Button'
import Tag from '@/components/ui/tag/Tag'
import { ALL_SHIPPING_ORDERS, ITEMS_PER_PAGE, SHIPPERS_LIST, type ManagerShippingOrder, type ManagerShipper } from '../../data/manager-dashboard-data'

function shipperStatusTag(shipper: ManagerShipper) {
  return shipper.status === 'active'
    ? <Tag variant="success" size="sm" className="text-[10px] h-4 px-2">Hoạt động</Tag>
    : <Tag variant="gray" size="sm" className="text-[10px] h-4 px-2">Offline</Tag>
}

function shippingOrderStatusTag(order: ManagerShippingOrder) {
  if (order.status === 'delivered') return <Tag variant="success" size="sm" className="text-[10px] h-4 px-2">Đã giao</Tag>
  if (order.status === 'shipping') return <Tag variant="primary" size="sm" className="text-[10px] h-4 px-2">Đang giao</Tag>
  return <Tag variant="warn" size="sm" className="text-[10px] h-4 px-2">Chờ giao</Tag>
}

export default function ShippersTab() {
  const [shipperPage, setShipperPage] = useState(1)
  const [ordersPage, setOrdersPage] = useState(1)

  const totalShipperPages = Math.max(1, Math.ceil(SHIPPERS_LIST.length / ITEMS_PER_PAGE))
  const totalOrderPages = Math.max(1, Math.ceil(ALL_SHIPPING_ORDERS.length / ITEMS_PER_PAGE))

  const pagedShippers = useMemo(() => {
    const start = (shipperPage - 1) * ITEMS_PER_PAGE
    return SHIPPERS_LIST.slice(start, start + ITEMS_PER_PAGE)
  }, [shipperPage])

  const pagedOrders = useMemo(() => {
    const start = (ordersPage - 1) * ITEMS_PER_PAGE
    return ALL_SHIPPING_ORDERS.slice(start, start + ITEMS_PER_PAGE)
  }, [ordersPage])

  const activeCount = SHIPPERS_LIST.filter(s => s.status === 'active').length
  const shippingCount = ALL_SHIPPING_ORDERS.filter(o => o.status === 'shipping').length
  const deliveredCount = ALL_SHIPPING_ORDERS.filter(o => o.status === 'delivered').length

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Shipper hoạt động</p>
              <p className="text-3xl font-bold text-[#003366]">{activeCount}</p>
            </div>
            <Truck className="h-12 w-12 text-[#3366CC] opacity-50" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Đơn đang giao</p>
              <p className="text-3xl font-bold text-yellow-700">{shippingCount}</p>
            </div>
            <Clock className="h-12 w-12 text-yellow-600 opacity-50" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Đã giao</p>
              <p className="text-3xl font-bold text-[#2ECC71]">{deliveredCount}</p>
            </div>
            <CheckCircle className="h-12 w-12 text-[#2ECC71] opacity-50" />
          </div>
        </Card>
      </div>

      {/* Shipper list */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[#003366] text-xl font-semibold">Danh sách Shipper</h2>
            <p className="text-sm text-gray-500 mt-1">Quản lý đội ngũ giao hàng</p>
          </div>
          <Button className="bg-[#3366CC] hover:bg-[#2952A3]" size="sm" onClick={() => {}}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm shipper
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pagedShippers.map(shipper => (
            <Card key={shipper.id} className="p-4 hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-[#3366CC] text-white flex items-center justify-center font-semibold shadow-inner">
                    <Truck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#003366] text-lg leading-tight line-clamp-1">{shipper.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {shipperStatusTag(shipper)}
                      <Tag variant="gray" size="sm" className="text-[10px] h-4 px-2">{shipper.id}</Tag>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Đang giao</p>
                  <p className="font-bold text-[#003366] text-lg">{shipper.currentOrders}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg">
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Hôm nay</p>
                  <p className="font-bold text-[#003366] text-lg">{shipper.todayDelivered}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg">
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Tổng</p>
                  <p className="font-bold text-[#003366] text-lg">{shipper.totalDelivered}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6">
          <Button variant="outline" size="sm" disabled={shipperPage <= 1} onClick={() => setShipperPage(p => Math.max(1, p - 1))}>
            Prev
          </Button>
          <span className="text-sm text-gray-600">Page {shipperPage}/{totalShipperPages}</span>
          <Button variant="outline" size="sm" disabled={shipperPage >= totalShipperPages} onClick={() => setShipperPage(p => Math.min(totalShipperPages, p + 1))}>
            Next
          </Button>
        </div>
      </Card>

      {/* Shipping orders */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[#003366] text-xl font-semibold">Đơn hàng giao</h2>
            <p className="text-sm text-gray-500 mt-1">Theo dõi trạng thái giao hàng</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pagedOrders.map(order => (
            <Card key={order.id} className="p-4 hover:shadow-md transition-shadow flex flex-col h-full border-t-4 border-t-blue-500">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-[#003366] text-lg">{order.id}</h3>
                {shippingOrderStatusTag(order)}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Khách hàng</p>
                  <p className="text-sm font-semibold text-[#003366] line-clamp-1">{order.customer}</p>
                </div>

                <div className="flex items-start gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  <MapPin className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2 min-h-[2.5rem]">{order.address}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 text-xs text-blue-600">
                    <Phone className="h-3 w-3" />
                    <span>{order.phone}</span>
                  </div>
                  <p className="font-bold text-[#2ECC71] text-lg">{order.total.toLocaleString()}đ</p>
                </div>
              </div>

              <div className="space-y-1 text-[10px] text-gray-400 pt-1 border-t">
                <div className="flex items-center justify-between">
                  <span>📅 Đặt hàng</span>
                  <span>{order.orderDate}</span>
                </div>
                {order.shipper && (
                  <div className="flex items-center justify-between">
                    <span>🚚 Shipper</span>
                    <span>{order.shipper}</span>
                  </div>
                )}
                {order.assignedDate && (
                  <div className="flex items-center justify-between">
                    <span>⏰ Nhận đơn</span>
                    <span>{order.assignedDate}</span>
                  </div>
                )}
                {order.deliveredDate && (
                  <div className="flex items-center justify-between">
                    <span>✅ Giao lúc</span>
                    <span>{order.deliveredDate}</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6">
          <Button variant="outline" size="sm" disabled={ordersPage <= 1} onClick={() => setOrdersPage(p => Math.max(1, p - 1))}>
            Prev
          </Button>
          <span className="text-sm text-gray-600">Page {ordersPage}/{totalOrderPages}</span>
          <Button variant="outline" size="sm" disabled={ordersPage >= totalOrderPages} onClick={() => setOrdersPage(p => Math.min(totalOrderPages, p + 1))}>
            Next
          </Button>
        </div>
      </Card>
    </div>
  )
}

