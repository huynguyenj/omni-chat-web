import { useMemo, useState } from 'react'
import { Calendar, Phone, ShoppingCart } from 'lucide-react'
import Card from '@/components/ui/card/Card'
import Button from '@/components/ui/button/Button'
import Tag from '@/components/ui/tag/Tag'
import { ITEMS_PER_PAGE, ORDERS_LIST, type ManagerOrder } from '../../data/manager-dashboard-data'

function statusTag(order: ManagerOrder) {
  if (order.status === 'completed') return <Tag variant="success" size="sm" className="text-[10px] h-4 px-2">Hoàn thành</Tag>
  return <Tag variant="warn" size="sm" className="text-[10px] h-4 px-2">Chờ xử lý</Tag>
}

export default function OrdersTab() {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(ORDERS_LIST.length / ITEMS_PER_PAGE))
  const paged = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    return ORDERS_LIST.slice(start, start + ITEMS_PER_PAGE)
  }, [page])

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[#003366] text-xl font-semibold">Quản lý đơn hàng</h2>
            <p className="text-sm text-gray-500 mt-1">Theo dõi và xử lý đơn hàng</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => {}}>
            Xuất báo cáo
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paged.map(order => (
            <Card key={order.id} className="p-4 hover:shadow-md transition-shadow flex flex-col justify-between h-full border-t-4 border-t-[#3366CC] bg-white group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-[#003366] text-lg">{order.id}</h3>
                  {statusTag(order)}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] text-gray-500 uppercase font-medium">Khách hàng</p>
                    <p className="text-sm font-semibold text-[#003366] line-clamp-1">{order.customer}</p>
                  </div>

                  <div className="bg-[#F5F7FA] p-2 rounded-lg">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Sản phẩm</p>
                    {order.products.map((p, idx) => (
                      <div key={idx} className="flex justify-between text-xs mb-1 last:mb-0">
                        <span className="text-gray-700 line-clamp-1 flex-1">
                          {p.name} <span className="text-gray-400">x{p.quantity}</span>
                        </span>
                        <span className="font-medium text-[#2ECC71] ml-2">
                          {(p.price * p.quantity).toLocaleString()}đ
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex flex-col gap-1 text-[10px] text-gray-500">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {order.date}</span>
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {order.phone}</span>
                    </div>
                    <p className="font-bold text-[#2ECC71] text-lg">{order.total.toLocaleString()}đ</p>
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
                  Chi tiết đơn hàng
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
            Prev
          </Button>
          <span className="text-sm text-gray-600">Page {page}/{totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
            Next
          </Button>
        </div>
      </Card>
    </div>
  )
}

