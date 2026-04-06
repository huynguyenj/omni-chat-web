import { useState } from 'react'
import Card from '@/components/ui/card/Card'
import Select from '@/components/ui/select/Select'
import { MILK_CHART_COLORS, MILK_QUANTITY_BY_MONTH, MONTH_OPTIONS, ORDER_STATS_BY_MONTH, SERVICE_STATS_BY_MONTH } from '@/components/admin/admin-dashboard-data'
import { CheckCircle, Clock, Milk, TrendingDown, TrendingUp, XCircle } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function OverviewTab() {
  const [selectedServiceMonth, setSelectedServiceMonth] = useState('2026-01')
  const [selectedOrderMonth, setSelectedOrderMonth] = useState('2026-01')

  const currentOrderStats = ORDER_STATS_BY_MONTH[selectedOrderMonth as keyof typeof ORDER_STATS_BY_MONTH]

  const totalProducts = Object.values(MILK_QUANTITY_BY_MONTH).reduce((sum, months) => {
    const latest = months[months.length - 1]
    return sum + latest['Có đường'] + latest['Không đường'] + latest.Yogurt
  }, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 hover:shadow-lg transition-shadow border-l-4 border-l-[#3366CC]">
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 rounded-lg bg-[#EBF1FF]">
              <Milk className="h-6 w-6 text-[#3366CC]" />
            </div>
            <TrendingUp className="h-5 w-5 text-[#2ECC71]" />
          </div>
          <h3 className="text-sm text-gray-600 mb-1">Tổng sản phẩm sữa</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-[#3366CC]">{totalProducts}</p>
            <span className="text-sm text-gray-500">sản phẩm</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">+15 tuần này</p>
        </Card>

        <Card className="p-5 hover:shadow-lg transition-shadow border-l-4 border-l-[#2ECC71]">
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 rounded-lg bg-[#E8F8F0]">
              <CheckCircle className="h-6 w-6 text-[#2ECC71]" />
            </div>
            <TrendingUp className="h-5 w-5 text-[#2ECC71]" />
          </div>
          <h3 className="text-sm text-gray-600 mb-1">Đơn hàng thành công</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-[#2ECC71]">{currentOrderStats.successful}</p>
            <span className="text-sm text-gray-500">đơn hàng</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Tháng {selectedOrderMonth}</p>
        </Card>

        <Card className="p-5 hover:shadow-lg transition-shadow border-l-4 border-l-[#FF9800]">
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 rounded-lg bg-[#FFF3E0]">
              <Clock className="h-6 w-6 text-[#FF9800]" />
            </div>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">Chưa thanh toán</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-[#FF9800]">{currentOrderStats.pending}</p>
            <span className="text-sm text-gray-500">đơn hàng</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Tháng {selectedOrderMonth}</p>
        </Card>

        <Card className="p-5 hover:shadow-lg transition-shadow border-l-4 border-l-[#F44336]">
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 rounded-lg bg-[#FFEBEE]">
              <XCircle className="h-6 w-6 text-[#F44336]" />
            </div>
            <TrendingDown className="h-5 w-5 text-[#F44336]" />
          </div>
          <h3 className="text-sm text-gray-600 mb-1">Đơn bị hủy</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-[#F44336]">{currentOrderStats.cancelled}</p>
            <span className="text-sm text-gray-500">đơn hàng</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Tháng {selectedOrderMonth}</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-[#003366] text-lg font-semibold">Số lượng sữa theo loại và tháng</h3>
          <p className="text-sm text-gray-500">Biểu đồ số lượng từng loại sữa theo từng dung tích</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(MILK_QUANTITY_BY_MONTH).map(([capacity, data]) => (
            <Card key={capacity} className="p-4 border border-[#3366CC]/20 bg-gradient-to-br from-white to-blue-50">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-[#003366] rounded-lg">
                  <Milk className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-[#003366]">Sữa {capacity}</h4>
                  <p className="text-xs text-gray-500">Số lượng theo tháng (T01 - T06/2026)</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data} barCategoryGap="25%" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" fontSize={11} />
                  <YAxis stroke="#666" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="Có đường" name="Có đường" fill={MILK_CHART_COLORS['Có đường']} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Không đường" name="Không đường" fill={MILK_CHART_COLORS['Không đường']} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Yogurt" name="Yogurt" fill={MILK_CHART_COLORS.Yogurt} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-[#003366] text-lg font-semibold">Dịch vụ phổ biến</h3>
              <p className="text-sm text-gray-500">Thống kê các loại dịch vụ theo tháng</p>
            </div>
            <Select value={selectedServiceMonth} onChange={(e) => setSelectedServiceMonth(e.target.value)} className="w-40 border border-gray-200 bg-white py-2">
              {MONTH_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </Select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={SERVICE_STATS_BY_MONTH[selectedServiceMonth as keyof typeof SERVICE_STATS_BY_MONTH]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#666" fontSize={11} angle={-15} textAnchor="end" height={80} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e0e0e0', borderRadius: '8px' }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {SERVICE_STATS_BY_MONTH[selectedServiceMonth as keyof typeof SERVICE_STATS_BY_MONTH].map((entry, index) => (
                  <Cell key={`service-cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-[#003366] text-lg font-semibold">Đơn hàng theo tháng</h3>
              <p className="text-sm text-gray-500">Thống kê tích lũy đơn hàng trong tháng</p>
            </div>
            <Select value={selectedOrderMonth} onChange={(e) => setSelectedOrderMonth(e.target.value)} className="w-40 border border-gray-200 bg-white py-2">
              {MONTH_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </Select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currentOrderStats.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e0e0e0', borderRadius: '8px' }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {currentOrderStats.chartData.map((entry, index) => (
                  <Cell key={`order-cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}

