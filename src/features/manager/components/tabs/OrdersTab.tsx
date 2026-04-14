import { useEffect, useState } from 'react'
import { Calendar, RefreshCw, ShoppingCart, User } from 'lucide-react'
import Card from '@/components/ui/card/Card'
import Button from '@/components/ui/button/Button'
import Tag from '@/components/ui/tag/Tag'
import { ManagerOrderApi } from '../../api/order-api'
import type { ManagerOrderItem } from '../../types/order-type'

function statusTag(order: ManagerOrderItem) {
  if (order.deliveryStatus === 'Delivered') return <Tag variant="success" size="sm" className="text-[10px] h-4 px-2">Đã giao</Tag>
  if (order.deliveryStatus === 'Processing') return <Tag variant="default" size="sm" className="text-[10px] h-4 px-2">Đang giao</Tag>
  if (order.deliveryStatus === 'Cancelled') return <Tag variant="danger" size="sm" className="text-[10px] h-4 px-2">Đã hủy</Tag>
  return <Tag variant="warn" size="sm" className="text-[10px] h-4 px-2">Chờ xử lý</Tag>
}

export default function OrdersTab() {
  const [page, setPage] = useState(1)
  const [reloadCount, setReloadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orders, setOrders] = useState<ManagerOrderItem[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 6

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await ManagerOrderApi.getOrders(page, pageSize)
        const items = response?.data?.items ?? []
        const pages = response?.data?.meta?.total_pages ?? 1
        setOrders(items)
        setTotalPages(Math.max(1, pages))
      } catch {
        setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại.')
        setOrders([])
      } finally {
        setIsLoading(false)
      }
    }

    void fetchOrders()
  }, [page, reloadCount])

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[#003366] text-xl font-semibold">Quản lý đơn hàng</h2>
            <p className="text-sm text-gray-500 mt-1">Theo dõi và xử lý đơn hàng</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setReloadCount(prev => prev + 1)} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Tải lại
          </Button>
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

          {orders.map(order => (
            <Card key={order.id} className="p-4 hover:shadow-md transition-shadow flex flex-col justify-between h-full border-t-4 border-t-[#3366CC] bg-white group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-[#003366] text-lg">{order.code}</h3>
                  {statusTag(order)}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] text-gray-500 uppercase font-medium">Đơn hàng</p>
                    <p className="text-sm font-semibold text-[#003366] line-clamp-1">{order.name}</p>
                  </div>

                  <div className="bg-[#F5F7FA] p-2 rounded-lg">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Chi tiết</p>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-700">Mã đơn</span>
                      <span className="font-medium text-[#003366]">{order.code}</span>
                    </div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-700">Khách hàng</span>
                      <span className="font-medium text-[#003366]">{order.customerName || 'Khách lẻ'}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-700">Trạng thái đơn</span>
                      <span className="font-medium text-[#003366]">{order.status}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex flex-col gap-1 text-[10px] text-gray-500">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(order.orderDate).toLocaleString('vi-VN')}</span>
                      <span className="flex items-center gap-1"><User className="h-3 w-3" /> {order.customerId}</span>
                    </div>
                    <p className="font-bold text-[#2ECC71] text-lg">{order.totalAmount.toLocaleString()}đ</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-[#3366CC] border-[#3366CC]/30 hover:bg-[#3366CC]/5"
                  onClick={() => {}}
                >
                  <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                  Xử lý đơn hàng
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || isLoading}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          <span className="text-sm text-gray-600">Page {page}/{totalPages}</span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages || isLoading}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </Card>
    </div>
  )
}

