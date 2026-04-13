import { useCallback, useEffect, useMemo, useState } from 'react'
import Button from '@/components/ui/button/Button'
import Card from '@/components/ui/card/Card'
import Select from '@/components/ui/select/Select'
import { MILK_CHART_COLORS, MILK_QUANTITY_BY_MONTH, MONTH_OPTIONS, ORDER_STATS_BY_MONTH, SERVICE_STATS_BY_MONTH } from '@/components/admin/admin-dashboard-data'
import { isAxiosError } from 'axios'
import { CheckCircle, Clock, FileX2, Milk, ShoppingCart, TrendingDown, TrendingUp, XCircle } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { toast } from 'react-toastify'
import { InventoryApi } from '../../api/inventory-api'
import { OrderApi } from '../../api/order-api'
import { SupportTaskApi } from '../../api/support-task-api'
import { TaskCancelReasonApi } from '../../api/task-cancel-reason-api'
import type { InventoryDashboardData } from '../../types/inventory-type'
import type { OrderDashboardMonthRow } from '../../types/order-type'
import type { TaskIntentMonthRow } from '../../types/support-task-type'

type CancelReasonRow = {
  id: string
  title: string
  description: string
  createdAt: string
}

function mapCancelReasonRow(raw: unknown): CancelReasonRow {
  const o = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  const title =
    typeof o.reasonName === 'string'
      ? o.reasonName
      : typeof o.name === 'string'
        ? o.name
        : typeof o.reason === 'string'
          ? o.reason
          : typeof o.title === 'string'
            ? o.title
            : '—'
  const description =
    typeof o.description === 'string' ? o.description : typeof o.note === 'string' ? o.note : ''
  const createdAt =
    typeof o.createdAt === 'string' ? o.createdAt : typeof o.created_at === 'string' ? o.created_at : ''
  return {
    id: String(o.id ?? o.cancelReasonId ?? ''),
    title,
    description,
    createdAt
  }
}

function mapInventoryDashboardData(raw: unknown): InventoryDashboardData | null {
  const o = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : null
  if (!o) return null
  const num = (v: unknown) => {
    const x = Number(v)
    return Number.isFinite(x) ? x : 0
  }
  return {
    totalProducts: num(o.totalProducts ?? o.total_products),
    lowStockProducts: num(o.lowStockProducts ?? o.low_stock_products),
    totalBrands: num(o.totalBrands ?? o.total_brands)
  }
}

function normalizeCancelReasonMeta(raw: unknown): {
  total_pages: number
  total_items: number
  current_page: number
  page_size: number
} {
  const m = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  return {
    total_pages: Number(m.total_pages ?? m.totalPages ?? 0),
    total_items: Number(m.total_items ?? m.totalItems ?? 0),
    current_page: Number(m.current_page ?? m.currentPage ?? 1),
    page_size: Number(m.page_size ?? m.pageSize ?? 10)
  }
}

const INTENT_COLOR_BY_NAME: Record<string, string> = {
  PRE_SALE: '#3366CC',
  ORDER_CREATION: '#2ECC71',
  ORDER_STATUS: '#FF9800',
  PAYMENT: '#F44336',
  POST_SALE_CHANGE: '#9C27B0'
}

function collectIntentNames(rows: TaskIntentMonthRow[]): string[] {
  const set = new Set<string>()
  for (const row of rows) {
    for (const item of row.intents ?? []) {
      if (item.intentName) set.add(item.intentName)
    }
  }
  const preferred = ['PRE_SALE', 'ORDER_CREATION', 'ORDER_STATUS', 'PAYMENT', 'POST_SALE_CHANGE']
  const ordered = preferred.filter((name) => set.has(name))
  const rest = [...set].filter((name) => !preferred.includes(name)).sort()
  return [...ordered, ...rest]
}

function normalizeTaskPeriodInput(value: string): string | null {
  const trimmed = value.trim()
  if (/^\d{4}$/.test(trimmed)) return trimmed

  const monthYearMatch = /^(\d{1,2})\/(\d{4})$/.exec(trimmed)
  if (!monthYearMatch) return null

  const month = Number(monthYearMatch[1])
  if (month < 1 || month > 12) return null

  return `${String(month).padStart(2, '0')}/${monthYearMatch[2]}`
}

function buildTaskDashboardChartRows(rows: TaskIntentMonthRow[], intentNames: string[]) {
  const sorted = [...rows].sort((a, b) => a.month - b.month)
  return sorted.map((row) => {
    const byIntent = new Map((row.intents ?? []).map((i) => [i.intentName, i.taskCount]))
    const chartRow: Record<string, string | number> = {
      monthLabel: `T${String(row.month).padStart(2, '0')}`
    }
    let total = 0
    for (const name of intentNames) {
      const count = Number(byIntent.get(name) ?? 0)
      chartRow[name] = count
      total += count
    }
    chartRow.total = total
    return chartRow
  })
}

const ORDER_DASHBOARD_STATUS_COLORS: Record<string, string> = {
  Completed: '#2ECC71',
  Confirmed: '#3366CC',
  Draft: '#9E9E9E',
  Returned: '#FF9800',
  Cancelled: '#F44336'
}

function parseOrderDashboardMonthSortKey(month: string): number {
  const m = /^(\d{1,2})\/(\d{4})$/.exec(month.trim())
  if (!m) return 0
  return Number(m[2]) * 100 + Number(m[1])
}

function collectOrderDashboardStatusNames(rows: OrderDashboardMonthRow[]): string[] {
  const set = new Set<string>()
  for (const row of rows) {
    for (const item of row.status ?? []) {
      if (item.status) set.add(item.status)
    }
  }
  const preferred = ['Completed', 'Confirmed', 'Draft', 'Returned', 'Cancelled']
  const ordered = preferred.filter((name) => set.has(name))
  const rest = [...set].filter((name) => !preferred.includes(name)).sort((a, b) => a.localeCompare(b))
  return [...ordered, ...rest]
}

function buildOrderDashboardChartRows(rows: OrderDashboardMonthRow[], statusNames: string[]) {
  const sorted = [...rows].sort((a, b) => parseOrderDashboardMonthSortKey(a.month) - parseOrderDashboardMonthSortKey(b.month))
  return sorted.map((row) => {
    const byStatus = new Map((row.status ?? []).map((s) => [s.status, s.count]))
    const chartRow: Record<string, string | number> = { monthLabel: row.month }
    let total = 0
    for (const name of statusNames) {
      const count = Number(byStatus.get(name) ?? 0)
      chartRow[name] = count
      total += count
    }
    chartRow.total = total
    return chartRow
  })
}

export default function OverviewTab() {
  const [selectedServiceMonth, setSelectedServiceMonth] = useState('2026-01')
  const [selectedOrderMonth, setSelectedOrderMonth] = useState('2026-01')
  const [inventoryDashboard, setInventoryDashboard] = useState<InventoryDashboardData | null>(null)
  const [inventoryDashboardLoading, setInventoryDashboardLoading] = useState(false)
  const [taskDashboardRows, setTaskDashboardRows] = useState<TaskIntentMonthRow[]>([])
  const [taskDashboardLoading, setTaskDashboardLoading] = useState(false)
  const [taskDashboardPeriodInput, setTaskDashboardPeriodInput] = useState('2026')
  const [taskDashboardAppliedPeriod, setTaskDashboardAppliedPeriod] = useState('2026')
  const [orderDashboardRows, setOrderDashboardRows] = useState<OrderDashboardMonthRow[]>([])
  const [orderDashboardLoading, setOrderDashboardLoading] = useState(false)
  const [orderDashboardInput, setOrderDashboardInput] = useState('2026')
  const [orderDashboardAppliedInput, setOrderDashboardAppliedInput] = useState('2026')
  const [cancelReasonPage, setCancelReasonPage] = useState(1)
  const cancelReasonPageSize = 10
  const [cancelReasonRows, setCancelReasonRows] = useState<CancelReasonRow[]>([])
  const [cancelReasonMeta, setCancelReasonMeta] = useState({
    total_pages: 0,
    total_items: 0,
    current_page: 1,
    page_size: cancelReasonPageSize
  })
  const [cancelReasonLoading, setCancelReasonLoading] = useState(false)

  const currentOrderStats = ORDER_STATS_BY_MONTH[selectedOrderMonth as keyof typeof ORDER_STATS_BY_MONTH]

  const taskIntentNames = useMemo(() => collectIntentNames(taskDashboardRows), [taskDashboardRows])
  const taskChartData = useMemo(
    () => buildTaskDashboardChartRows(taskDashboardRows, taskIntentNames),
    [taskDashboardRows, taskIntentNames]
  )
  const taskIntentTotals = useMemo(() => {
    const totals: Record<string, number> = {}
    for (const name of taskIntentNames) totals[name] = 0
    for (const row of taskChartData) {
      for (const name of taskIntentNames) {
        totals[name] += Number(row[name] ?? 0)
      }
    }
    return totals
  }, [taskChartData, taskIntentNames])

  const orderDashboardStatusNames = useMemo(() => collectOrderDashboardStatusNames(orderDashboardRows), [orderDashboardRows])
  const orderChartData = useMemo(
    () => buildOrderDashboardChartRows(orderDashboardRows, orderDashboardStatusNames),
    [orderDashboardRows, orderDashboardStatusNames]
  )
  const orderDashboardTotals = useMemo(() => {
    const totals: Record<string, number> = {}
    for (const name of orderDashboardStatusNames) totals[name] = 0
    for (const row of orderChartData) {
      for (const name of orderDashboardStatusNames) {
        totals[name] += Number(row[name] ?? 0)
      }
    }
    return totals
  }, [orderChartData, orderDashboardStatusNames])

  useEffect(() => {
    const fetchInventoryDashboard = async () => {
      setInventoryDashboardLoading(true)
      try {
        const response = await InventoryApi.getDashboard()
        if (response.is_success && response.data) {
          const mapped = mapInventoryDashboardData(response.data)
          setInventoryDashboard(mapped)
        } else {
          setInventoryDashboard(null)
        }
      } catch (error) {
        console.log('Fetch inventory dashboard failed:', error)
        setInventoryDashboard(null)
        toast.error('Không tải được tổng quan kho.')
      } finally {
        setInventoryDashboardLoading(false)
      }
    }
    void fetchInventoryDashboard()
  }, [])

  const fetchTaskDashboard = useCallback(async (rawInput: string) => {
    const normalized = normalizeTaskPeriodInput(rawInput)
    if (!normalized) {
      toast.error('Định dạng không hợp lệ. Nhập yyyy hoặc mm/yyyy.')
      return
    }
    setTaskDashboardPeriodInput(normalized)
    setTaskDashboardAppliedPeriod(normalized)
    setTaskDashboardLoading(true)
    try {
      const response = await SupportTaskApi.getTaskIntentDashboard(normalized)
      if (response.is_success && Array.isArray(response.data)) {
        setTaskDashboardRows(response.data)
      } else {
        setTaskDashboardRows([])
        toast.info(response.message || 'Không có dữ liệu task cho kỳ này.')
      }
    } catch (error) {
      if (isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 400)) {
        setTaskDashboardRows([])
        toast.info('Không có dữ liệu task cho kỳ này.')
        return
      }
      console.log('Fetch task intent dashboard failed:', error)
      setTaskDashboardRows([])
      toast.error('Không tải được task dashboard. Vui lòng thử lại.')
    } finally {
      setTaskDashboardLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchTaskDashboard('2026')
  }, [fetchTaskDashboard])

  const fetchOrderDashboard = useCallback(async (rawInput: string) => {
    const normalized = normalizeTaskPeriodInput(rawInput)
    if (!normalized) {
      toast.error('Định dạng không hợp lệ. Nhập yyyy hoặc mm/yyyy.')
      return
    }
    setOrderDashboardInput(normalized)
    setOrderDashboardAppliedInput(normalized)
    setOrderDashboardLoading(true)
    try {
      const response = await OrderApi.getOrderDashboard(normalized)
      if (response.is_success && Array.isArray(response.data)) {
        setOrderDashboardRows(response.data)
      } else {
        setOrderDashboardRows([])
        toast.info(response.message || 'Không có dữ liệu order dashboard cho kỳ này.')
      }
    } catch (error) {
      if (isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 400)) {
        setOrderDashboardRows([])
        toast.info('Không có dữ liệu order dashboard cho kỳ này.')
        return
      }
      console.log('Fetch order dashboard failed:', error)
      setOrderDashboardRows([])
      toast.error('Không tải được order dashboard. Vui lòng thử lại.')
    } finally {
      setOrderDashboardLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchOrderDashboard('2026')
  }, [fetchOrderDashboard])

  useEffect(() => {
    const fetchCancelReasons = async () => {
      setCancelReasonLoading(true)
      try {
        const response = await TaskCancelReasonApi.getPaging(cancelReasonPage, cancelReasonPageSize)
        if (response.is_success && response.data) {
          const items = Array.isArray(response.data.items) ? response.data.items : []
          setCancelReasonRows(items.map(mapCancelReasonRow))
          setCancelReasonMeta(normalizeCancelReasonMeta(response.data.meta))
        } else {
          setCancelReasonRows([])
          setCancelReasonMeta((prev) => ({ ...prev, total_pages: 0, total_items: 0 }))
        }
      } catch (error) {
        console.log('Fetch task cancel reasons failed:', error)
        setCancelReasonRows([])
        toast.error('Không tải được danh sách lý do hủy task.')
      } finally {
        setCancelReasonLoading(false)
      }
    }
    void fetchCancelReasons()
  }, [cancelReasonPage])

  const cancelReasonTotalPages = Math.max(1, cancelReasonMeta.total_pages || 1)
  const canPrevCancelReason = cancelReasonPage > 1
  const canNextCancelReason = cancelReasonPage < cancelReasonTotalPages

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
          <h3 className="text-sm text-gray-600 mb-1">Tổng tồn kho sản phẩm</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-[#3366CC]">
              {inventoryDashboardLoading
                ? '…'
                : inventoryDashboard != null
                  ? inventoryDashboard.totalProducts.toLocaleString('vi-VN')
                  : '—'}
            </p>
            <span className="text-sm text-gray-500">sản phẩm</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {inventoryDashboardLoading
              ? 'Đang tải...'
              : inventoryDashboard
                ? `Sắp hết hàng: ${inventoryDashboard.lowStockProducts.toLocaleString('vi-VN')} · Thương hiệu: ${inventoryDashboard.totalBrands.toLocaleString('vi-VN')}`
                : 'Chưa có dữ liệu kho'}
          </p>
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
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-[#003366] text-lg font-semibold">Task intent dashboard</h3>
            <p className="text-sm text-gray-500">
              Nhập yyyy để lấy 12 tháng, hoặc mm/yyyy để lọc theo tháng (UTC). Đang xem:{' '}
              <span className="font-medium text-[#003366]">{taskDashboardAppliedPeriod}</span>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <input
              value={taskDashboardPeriodInput}
              onChange={(e) => setTaskDashboardPeriodInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  void fetchTaskDashboard(taskDashboardPeriodInput)
                }
              }}
              placeholder="yyyy hoặc mm/yyyy"
              className="h-10 w-40 rounded-md border border-gray-200 px-3 text-sm outline-none focus:border-[#3366CC]"
            />
            <Button size="sm" onClick={() => { void fetchTaskDashboard(taskDashboardPeriodInput) }}>
              Lấy dữ liệu
            </Button>
          </div>
        </div>
        {taskDashboardLoading && <p className="text-sm text-gray-500 mb-4">Đang tải dữ liệu task...</p>}
        {!taskDashboardLoading && taskChartData.length === 0 && (
          <p className="text-sm text-gray-500 mb-4">Chưa có dữ liệu task dashboard.</p>
        )}
        {!taskDashboardLoading && taskChartData.length > 0 && (
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-2 xl:items-stretch">
            <div className="self-start overflow-x-auto rounded-lg border border-gray-100">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-[#F5F7FA] text-left text-[#003366]">
                    <th className="px-3 py-2 font-semibold whitespace-nowrap">Tháng</th>
                    {taskIntentNames.map((name) => (
                      <th key={name} className="px-3 py-2 font-semibold whitespace-nowrap">
                        {name}
                      </th>
                    ))}
                    <th className="px-3 py-2 font-semibold whitespace-nowrap">Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  {taskChartData.map((row) => (
                    <tr key={String(row.monthLabel)} className="border-t border-gray-100 hover:bg-gray-50/80">
                      <td className="px-3 py-2 font-medium text-[#003366] whitespace-nowrap">{row.monthLabel}</td>
                      {taskIntentNames.map((name) => (
                        <td key={name} className="px-3 py-2 text-gray-700 tabular-nums">
                          {Number(row[name] ?? 0).toLocaleString('vi-VN')}
                        </td>
                      ))}
                      <td className="px-3 py-2 font-semibold text-[#003366] tabular-nums">
                        {Number(row.total ?? 0).toLocaleString('vi-VN')}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-[#003366]/20 bg-[#EBF1FF]/40 font-semibold text-[#003366]">
                    <td className="px-3 py-2 whitespace-nowrap">Tổng kỳ</td>
                    {taskIntentNames.map((name) => (
                      <td key={name} className="px-3 py-2 tabular-nums">
                        {taskIntentTotals[name]?.toLocaleString('vi-VN') ?? '0'}
                      </td>
                    ))}
                    <td className="px-3 py-2 tabular-nums">
                      {Object.values(taskIntentTotals).reduce((a, b) => a + b, 0).toLocaleString('vi-VN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="relative h-[320px] w-full xl:h-full xl:min-h-0">
              <div className="absolute inset-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={taskChartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="monthLabel" stroke="#666" fontSize={11} />
                    <YAxis stroke="#666" fontSize={11} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    {taskIntentNames.map((name) => (
                      <Bar
                        key={name}
                        dataKey={name}
                        name={name}
                        stackId="intent"
                        fill={INTENT_COLOR_BY_NAME[name] ?? '#607D8B'}
                        radius={[0, 0, 0, 0]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#E8F0FF]">
              <ShoppingCart className="h-5 w-5 text-[#3366CC]" />
            </div>
            <div>
              <h3 className="text-[#003366] text-lg font-semibold">Order dashboard</h3>
              <p className="text-sm text-gray-500">
                Nhập yyyy để lấy 12 tháng, hoặc mm/yyyy để lọc theo tháng (UTC). Đang xem:{' '}
                <span className="font-medium text-[#003366]">{orderDashboardAppliedInput}</span>
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <input
              value={orderDashboardInput}
              onChange={(e) => setOrderDashboardInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  void fetchOrderDashboard(orderDashboardInput)
                }
              }}
              placeholder="yyyy hoặc mm/yyyy"
              className="h-10 w-40 rounded-md border border-gray-200 px-3 text-sm outline-none focus:border-[#3366CC]"
            />
            <Button size="sm" onClick={() => { void fetchOrderDashboard(orderDashboardInput) }}>
              Lấy dữ liệu
            </Button>
          </div>
        </div>
        {orderDashboardLoading && <p className="text-sm text-gray-500 mb-4">Đang tải order dashboard...</p>}
        {!orderDashboardLoading && orderChartData.length === 0 && (
          <p className="text-sm text-gray-500 mb-4">Chưa có dữ liệu order dashboard.</p>
        )}
        {!orderDashboardLoading && orderChartData.length > 0 && orderDashboardStatusNames.length === 0 && (
          <p className="text-sm text-gray-500 mb-4">Có tháng nhưng chưa có trạng thái đơn (status rỗng).</p>
        )}
        {!orderDashboardLoading && orderChartData.length > 0 && orderDashboardStatusNames.length > 0 && (
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-2 xl:items-stretch">
            <div className="self-start overflow-x-auto rounded-lg border border-gray-100">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-[#F5F7FA] text-left text-[#003366]">
                    <th className="px-3 py-2 font-semibold whitespace-nowrap">Tháng</th>
                    {orderDashboardStatusNames.map((name) => (
                      <th key={name} className="px-3 py-2 font-semibold whitespace-nowrap">
                        {name}
                      </th>
                    ))}
                    <th className="px-3 py-2 font-semibold whitespace-nowrap">Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  {orderChartData.map((row) => (
                    <tr key={String(row.monthLabel)} className="border-t border-gray-100 hover:bg-gray-50/80">
                      <td className="px-3 py-2 font-medium text-[#003366] whitespace-nowrap">{row.monthLabel}</td>
                      {orderDashboardStatusNames.map((name) => (
                        <td key={name} className="px-3 py-2 text-gray-700 tabular-nums">
                          {Number(row[name] ?? 0).toLocaleString('vi-VN')}
                        </td>
                      ))}
                      <td className="px-3 py-2 font-semibold text-[#003366] tabular-nums">
                        {Number(row.total ?? 0).toLocaleString('vi-VN')}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-[#003366]/20 bg-[#EBF1FF]/40 font-semibold text-[#003366]">
                    <td className="px-3 py-2 whitespace-nowrap">Tổng kỳ</td>
                    {orderDashboardStatusNames.map((name) => (
                      <td key={name} className="px-3 py-2 tabular-nums">
                        {orderDashboardTotals[name]?.toLocaleString('vi-VN') ?? '0'}
                      </td>
                    ))}
                    <td className="px-3 py-2 tabular-nums">
                      {Object.values(orderDashboardTotals).reduce((a, b) => a + b, 0).toLocaleString('vi-VN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="relative h-[320px] w-full xl:h-full xl:min-h-0">
              <div className="absolute inset-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={orderChartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="monthLabel" stroke="#666" fontSize={11} />
                    <YAxis stroke="#666" fontSize={11} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    {orderDashboardStatusNames.map((name) => (
                      <Bar
                        key={name}
                        dataKey={name}
                        name={name}
                        stackId="orderStatus"
                        fill={ORDER_DASHBOARD_STATUS_COLORS[name] ?? '#607D8B'}
                        radius={[0, 0, 0, 0]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#FFEBEE]">
              <FileX2 className="h-5 w-5 text-[#F44336]" />
            </div>
            <div>
              <h3 className="text-[#003366] text-lg font-semibold">Danh sách lý do hủy task</h3>
              <p className="text-sm text-gray-500">Dữ liệu phân trang từ task-cancel-reasons</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 sm:text-right">
            Tổng {cancelReasonMeta.total_items.toLocaleString('vi-VN')} mục · Trang {cancelReasonMeta.current_page || cancelReasonPage} /{' '}
            {cancelReasonTotalPages}
          </p>
        </div>
        {cancelReasonLoading && <p className="text-sm text-gray-500 mb-3">Đang tải...</p>}
        {!cancelReasonLoading && cancelReasonRows.length === 0 && (
          <p className="text-sm text-gray-500">Chưa có lý do hủy task nào.</p>
        )}
        {cancelReasonRows.length > 0 && (
          <>
            <div className="overflow-x-auto rounded-lg border border-gray-100">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-[#F5F7FA] text-left text-[#003366]">
                    <th className="px-3 py-2 font-semibold whitespace-nowrap">#</th>
                    <th className="px-3 py-2 font-semibold whitespace-nowrap">ID</th>
                    <th className="px-3 py-2 font-semibold">Lý do</th>
                    <th className="px-3 py-2 font-semibold">Mô tả</th>
                    <th className="px-3 py-2 font-semibold whitespace-nowrap">Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {cancelReasonRows.map((row, index) => (
                    <tr key={row.id || `row-${cancelReasonPage}-${index}`} className="border-t border-gray-100 hover:bg-gray-50/80">
                      <td className="px-3 py-2 text-gray-500 tabular-nums">
                        {(cancelReasonPage - 1) * cancelReasonPageSize + index + 1}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-gray-600 whitespace-nowrap">{row.id || '—'}</td>
                      <td className="px-3 py-2 text-gray-800">{row.title}</td>
                      <td className="px-3 py-2 text-gray-600 max-w-xs truncate" title={row.description}>
                        {row.description || '—'}
                      </td>
                      <td className="px-3 py-2 text-gray-600 whitespace-nowrap text-xs">
                        {row.createdAt
                          ? (() => {
                              const d = new Date(row.createdAt)
                              return Number.isNaN(d.getTime()) ? row.createdAt : d.toLocaleString('vi-VN')
                            })()
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={!canPrevCancelReason || cancelReasonLoading}
                onClick={() => setCancelReasonPage((p) => Math.max(1, p - 1))}
              >
                Trước
              </Button>
              <span className="text-xs text-gray-500">
                {cancelReasonMeta.total_items > 0
                  ? `Hiển thị ${((cancelReasonPage - 1) * cancelReasonPageSize + 1).toLocaleString('vi-VN')}–${Math.min(
                      cancelReasonPage * cancelReasonPageSize,
                      cancelReasonMeta.total_items
                    ).toLocaleString('vi-VN')} / ${cancelReasonMeta.total_items.toLocaleString('vi-VN')}`
                  : 'Không có dữ liệu'}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={!canNextCancelReason || cancelReasonLoading}
                onClick={() => setCancelReasonPage((p) => p + 1)}
              >
                Sau
              </Button>
            </div>
          </>
        )}
      </Card>

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

