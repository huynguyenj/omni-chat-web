import Card from '@/components/ui/card/Card'
import { KEY_STATS, ISSUES_TRENDING_DATA, ORDER_STATUS_DATA, ORDERS_OVER_TIME, TOP_ISSUES, WAREHOUSE_BY_CATEGORY } from '@/components/admin/admin-dashboard-data'
import { CheckCircle, Package, Tag as TagIcon, Clock, TrendingDown, TrendingUp, Warehouse } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function OverviewTab() {
  // Overview tab: KPI cards + issue trends + order status distribution + warehouse + orders timeline.
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {KEY_STATS.map((stat, index) => {
          const Icon =
            stat.icon === 'Package'
              ? Package
              : stat.icon === 'CheckCircle'
                ? CheckCircle
                : stat.icon === 'Clock'
                  ? Clock
                  : TagIcon
          return (
            <Card
              key={index}
              className="p-5 hover:shadow-lg transition-shadow border-l-4"
              style={{ borderLeftColor: stat.color }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-3 rounded-lg" style={{ backgroundColor: stat.bgColor }}>
                  <Icon className="h-6 w-6" style={{ color: stat.color }} />
                </div>
                {stat.trend === 'up' && <TrendingUp className="h-5 w-5 text-[#2ECC71]" />}
                {stat.trend === 'down' && <TrendingDown className="h-5 w-5 text-red-500" />}
              </div>
              <h3 className="text-sm text-gray-600 mb-1">{stat.title}</h3>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </p>
                <span className="text-sm text-gray-500">{stat.subtitle}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">{stat.change}</p>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-[#003366] text-lg font-semibold">Vấn đề khách hàng đề cập</h3>
            <p className="text-sm text-gray-500">Theo dõi các vấn đề phổ biến theo thời gian</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ISSUES_TRENDING_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="Sản phẩm" stroke="#3366CC" strokeWidth={2} dot={{ fill: '#3366CC' }} />
              <Line type="monotone" dataKey="Đơn hàng" stroke="#2ECC71" strokeWidth={2} dot={{ fill: '#2ECC71' }} />
              <Line type="monotone" dataKey="Giá" stroke="#FF9800" strokeWidth={2} dot={{ fill: '#FF9800' }} />
              <Line type="monotone" dataKey="Đổi trả" stroke="#F44336" strokeWidth={2} dot={{ fill: '#F44336' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-[#003366] text-lg font-semibold">Phân bổ trạng thái đơn hàng</h3>
            <p className="text-sm text-gray-500">Tổng quan các trạng thái đơn</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ORDER_STATUS_DATA}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {ORDER_STATUS_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-[#003366] text-lg font-semibold">Vấn đề phổ biến nhất</h3>
            <p className="text-sm text-gray-500">Top 5 vấn đề được đề cập nhiều</p>
          </div>
          <div className="space-y-3">
            {TOP_ISSUES.map((issue, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-[#F5F7FA] rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#3366CC] text-white font-semibold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-[#003366]">{issue.keyword}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#2F3542]">{issue.count}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs text-white ${
                          issue.trend === 'up' ? 'bg-[#2ECC71]' : issue.trend === 'down' ? 'bg-red-500' : 'bg-gray-400'
                        }`}
                      >
                        {issue.change}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#3366CC] h-2 rounded-full transition-all" style={{ width: `${issue.percentage}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-[#003366] text-lg font-semibold">Tồn kho theo danh mục</h3>
            <p className="text-sm text-gray-500">Phân bổ sản phẩm trong kho</p>
          </div>
          <div className="space-y-3">
            {WAREHOUSE_BY_CATEGORY.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-[#F5F7FA] rounded-lg">
                <div className="flex items-center gap-3">
                  <Warehouse className="h-8 w-8 text-[#3366CC]" />
                  <div>
                    <h4 className="font-semibold text-[#003366]">{category.category}</h4>
                    <p className="text-sm text-gray-500">{category.quantity} sản phẩm</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#2ECC71]">{category.value}</p>
                  {category.trend === 'up' && (
                    <p className="text-xs text-[#2ECC71] flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Tăng
                    </p>
                  )}
                  {category.trend === 'down' && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <TrendingDown className="h-3 w-3" />
                      Giảm
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-[#003366] text-lg font-semibold">Đơn hàng theo thời gian</h3>
          <p className="text-sm text-gray-500">Biểu đồ đơn hàng trong tuần qua</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ORDERS_OVER_TIME}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="Thành công" fill="#2ECC71" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Chờ thanh toán" fill="#FF9800" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Đã hủy" fill="#F44336" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}

