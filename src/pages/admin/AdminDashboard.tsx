
import { useState } from 'react'
import Button from '@/components/ui/button/Button'
import Card from '@/components/ui/card/Card'

export default function AdminDashboard() {
  const [fromDate, setFromDate] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')

  return (
    <div className="px-6 py-8 space-y-8">
      {/* header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-semibold">Dashboard Analytics</h1>
        <div className="flex items-center gap-2">
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <span className="mx-1">-</span>
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
          <Button size="sm">Áp dụng</Button>
        </div>
      </div>

      {/* top metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {['Tổng tin nhắn', 'Số khách hàng', 'Thời gian phản hồi TB', 'Tỷ lệ giải quyết'].map((label) => (
          <Card key={label} variant="primary" className="flex flex-col justify-between">
            <div className="text-xs text-gray-500">{label}</div>
            <div className="text-2xl font-bold">--</div>
            <div className="text-sm text-gray-400">+0%</div>
          </Card>
        ))}
      </div>

      {/* main charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 h-64 flex items-center justify-center">
          <span className="text-gray-400">Xu hướng người dùng & tin nhắn (biểu đồ)</span>
        </Card>
        <Card className="h-64">
          <h2 className="font-medium mb-2">Phân bổ kênh liên hệ</h2>
          <ul className="space-y-2">
            {['Messenger', 'Zalo', 'Instagram', 'Telegram'].map((name) => (
              <li key={name} className="flex items-center justify-between">
                <span>{name}</span>
                <span className="text-sm text-gray-500">0</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* keyword trends */}
      <Card>
        <h2 className="font-medium mb-4">Xu hướng Keywords</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Đơn hàng', 'Giao hàng', 'Hoàn tiền', 'Khiếu nại', 'Sản phẩm', 'Hỗ trợ', 'Tài khoản'].map((kw) => (
            <Card key={kw} variant="secondary" size="sm" className="flex flex-col">
              <div className="text-sm font-semibold">{kw}</div>
              <div className="text-xs text-gray-400">0 lượt</div>
            </Card>
          ))}
        </div>
      </Card>

      {/* staff performance */}
      <Card className="h-64 flex items-center justify-center">
        <span className="text-gray-400">Hiệu suất nhân viên (biểu đồ)</span>
      </Card>
    </div>
  )
}
