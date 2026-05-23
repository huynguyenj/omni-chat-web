import { useCallback, useEffect, useMemo, useState } from 'react'
import Button from '@/components/ui/button/Button'
import Card from '@/components/ui/card/Card'
import AdminDashboardMetricCard from '../AdminDashboardMetricCard'
import { isAxiosError } from 'axios'
import { CheckCircle, Clock, FileX2, Milk, ShoppingCart, TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { toast } from 'react-toastify'
import { OrderApi } from '../../api/order-api'
import { ProductApi } from '../../api/product-api'
import { SupportTaskApi } from '../../api/support-task-api'
import type { OrderDashboardMonthRow } from '../../types/order-type'
import type { ProductType } from '../../types/product-type'
import type { TaskIntentMonthRow } from '../../types/support-task-type'

type InventorySummary = {
  totalProducts: number
  totalItems: number
}

function isApiSuccessLike(response: unknown): boolean {
  const r = response && typeof response === 'object' ? (response as Record<string, unknown>) : {}
  if (typeof r.is_success === 'boolean') return r.is_success
  if (typeof r.isSuccess === 'boolean') return r.isSuccess
  return Number(r.status_code ?? r.statusCode ?? 0) === 200
}

function summarizeInventoryFromProducts(products: ProductType[], totalItems: number): InventorySummary {
  const totalProducts = products.reduce((sum, item) => sum + Number(item.quantity ?? 0), 0)

  return {
    totalProducts,
    totalItems
  }
}

function extractArrayFromResponse(response: unknown): unknown[] {
  if (Array.isArray(response)) return response
  const r = response && typeof response === 'object' ? (response as Record<string, unknown>) : {}
  if (Array.isArray(r.items)) return r.items
  if (Array.isArray(r.data)) return r.data
  const data = r.data && typeof r.data === 'object' ? (r.data as Record<string, unknown>) : {}
  if (Array.isArray(data.items)) return data.items
  if (Array.isArray(data.data)) return data.data
  return []
}

function extractProductItems(response: unknown): ProductType[] {
  const items = extractArrayFromResponse(response)
  return items as ProductType[]
}

function extractProductTotalPages(response: unknown): number {
  const r = response && typeof response === 'object' ? (response as Record<string, unknown>) : {}
  const data = r.data && typeof r.data === 'object' ? (r.data as Record<string, unknown>) : {}
  const nestedData = data.data && typeof data.data === 'object' ? (data.data as Record<string, unknown>) : {}
  const metaCandidates = [
    data.meta,
    data.pagination,
    data.pageInfo,
    nestedData.meta,
    nestedData.pagination,
    nestedData.pageInfo,
    r.meta,
    r.pagination,
    r.pageInfo
  ]

  for (const meta of metaCandidates) {
    if (meta && typeof meta === 'object') {
      const m = meta as Record<string, unknown>
      const total = Number(m.total_pages ?? m.totalPages ?? 1)
      if (Number.isFinite(total) && total > 0) return total
    }
  }

  return 1
}

function extractProductTotalItems(response: unknown): number {
  const r = response && typeof response === 'object' ? (response as Record<string, unknown>) : {}
  const data = r.data && typeof r.data === 'object' ? (r.data as Record<string, unknown>) : {}
  const nestedData = data.data && typeof data.data === 'object' ? (data.data as Record<string, unknown>) : {}
  const metaCandidates = [
    data.meta,
    data.pagination,
    data.pageInfo,
    nestedData.meta,
    nestedData.pagination,
    nestedData.pageInfo,
    r.meta,
    r.pagination,
    r.pageInfo
  ]

  for (const meta of metaCandidates) {
    if (meta && typeof meta === 'object') {
      const m = meta as Record<string, unknown>
      const total = Number(m.total_items ?? m.totalItems ?? 0)
      if (Number.isFinite(total) && total >= 0) return total
    }
  }

  return 0
}

const INTENT_COLOR_BY_NAME: Record<string, string> = {
  PRE_SALE: '#3366CC',
  ORDER_CREATION: '#2ECC71',
  ORDER_STATUS: '#FF9800',
  PAYMENT: '#F44336',
  POST_SALE_CHANGE: '#9C27B0'
}

const OVERVIEW_INTENT_CARD_CONFIG = [
  { key: 'PRE_SALE', title: 'PRE_SALE', iconBg: 'bg-[#EBF1FF]', iconColor: 'text-[#3366CC]', borderColor: 'border-l-[#3366CC]', valueColor: 'text-[#3366CC]', Icon: ShoppingCart },
  { key: 'ORDER_CREATION', title: 'ORDER_CREATION', iconBg: 'bg-[#E8F8F0]', iconColor: 'text-[#2ECC71]', borderColor: 'border-l-[#2ECC71]', valueColor: 'text-[#2ECC71]', Icon: CheckCircle },
  { key: 'ORDER_STATUS', title: 'ORDER_STATUS', iconBg: 'bg-[#FFF3E0]', iconColor: 'text-[#FF9800]', borderColor: 'border-l-[#FF9800]', valueColor: 'text-[#FF9800]', Icon: Clock },
  { key: 'PAYMENT', title: 'PAYMENT', iconBg: 'bg-[#FFEBEE]', iconColor: 'text-[#F44336]', borderColor: 'border-l-[#F44336]', valueColor: 'text-[#F44336]', Icon: FileX2 },
  { key: 'POST_SALE_CHANGE', title: 'POST_SALE_CHANGE', iconBg: 'bg-[#F3E8FF]', iconColor: 'text-[#9C27B0]', borderColor: 'border-l-[#9C27B0]', valueColor: 'text-[#9C27B0]', Icon: TrendingUp }
] as const

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

function sumTaskIntentByName(rows: TaskIntentMonthRow[], intentName: string): number {
  return rows.reduce((sum, row) => {
    const byIntent = new Map((row.intents ?? []).map((item) => [item.intentName, Number(item.taskCount ?? 0)]))
    return sum + Number(byIntent.get(intentName) ?? 0)
  }, 0)
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
  const [intentSummaryPeriodInput, setIntentSummaryPeriodInput] = useState('2026')
  const [intentSummaryAppliedPeriod, setIntentSummaryAppliedPeriod] = useState('2026')
  const [intentCardAppliedByName, setIntentCardAppliedByName] = useState<Record<string, string>>(
    Object.fromEntries(OVERVIEW_INTENT_CARD_CONFIG.map((item) => [item.key, '2026']))
  )
  const [intentCardValueByName, setIntentCardValueByName] = useState<Record<string, number>>(
    Object.fromEntries(OVERVIEW_INTENT_CARD_CONFIG.map((item) => [item.key, 0]))
  )
  const [intentCardLoadingByName, setIntentCardLoadingByName] = useState<Record<string, boolean>>(
    Object.fromEntries(OVERVIEW_INTENT_CARD_CONFIG.map((item) => [item.key, false]))
  )
  const [inventoryDashboard, setInventoryDashboard] = useState<InventorySummary | null>(null)
  const [inventoryDashboardLoading, setInventoryDashboardLoading] = useState(false)
  const [taskDashboardRows, setTaskDashboardRows] = useState<TaskIntentMonthRow[]>([])
  const [taskDashboardLoading, setTaskDashboardLoading] = useState(false)
  const [taskDashboardPeriodInput, setTaskDashboardPeriodInput] = useState('2026')
  const [taskDashboardAppliedPeriod, setTaskDashboardAppliedPeriod] = useState('2026')
  const [orderDashboardRows, setOrderDashboardRows] = useState<OrderDashboardMonthRow[]>([])
  const [orderDashboardLoading, setOrderDashboardLoading] = useState(false)
  const [orderDashboardInput, setOrderDashboardInput] = useState('2026')
  const [orderDashboardAppliedInput, setOrderDashboardAppliedInput] = useState('2026')
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
        const pageSize = 100
        let page = 1
        let totalPages = 1
        let totalItems = 0
        const allProducts: ProductType[] = []

        while (page <= totalPages) {
          const response = await ProductApi.getAllProducts(page, pageSize)
          const items = extractProductItems(response)
          allProducts.push(...items)
          totalPages = extractProductTotalPages(response)
          if (page === 1) totalItems = extractProductTotalItems(response)
          page += 1
        }

        setInventoryDashboard(summarizeInventoryFromProducts(allProducts, totalItems))
      } catch {
        setInventoryDashboard(null)
        toast.error('Không tải được dữ liệu tồn kho.')
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
      const rows = extractArrayFromResponse(response) as TaskIntentMonthRow[]
      if (rows.length > 0 || isApiSuccessLike(response)) {
        setTaskDashboardRows(rows)
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
      setTaskDashboardRows([])
      toast.error('Không tải được task dashboard. Vui lòng thử lại.')
    } finally {
      setTaskDashboardLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchTaskDashboard('2026')
  }, [fetchTaskDashboard])

  const fetchIntentCardValue = useCallback(async (intentName: string, rawInput: string) => {
    const normalized = normalizeTaskPeriodInput(rawInput)
    if (!normalized) {
      toast.error('Định dạng không hợp lệ. Nhập yyyy hoặc mm/yyyy.')
      return
    }
    setIntentCardAppliedByName((prev) => ({ ...prev, [intentName]: normalized }))
    setIntentCardLoadingByName((prev) => ({ ...prev, [intentName]: true }))
    try {
      const response = await SupportTaskApi.getTaskIntentDashboard(normalized)
      const rows = extractArrayFromResponse(response) as TaskIntentMonthRow[]
      if (rows.length > 0 || isApiSuccessLike(response)) {
        setIntentCardValueByName((prev) => ({ ...prev, [intentName]: sumTaskIntentByName(rows, intentName) }))
      } else {
        setIntentCardValueByName((prev) => ({ ...prev, [intentName]: 0 }))
        toast.info(response.message || `Không có dữ liệu ${intentName} cho kỳ này.`)
      }
    } catch (error) {
      if (isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 400)) {
        setIntentCardValueByName((prev) => ({ ...prev, [intentName]: 0 }))
        toast.info(`Không có dữ liệu ${intentName} cho kỳ này.`)
        return
      }
      setIntentCardValueByName((prev) => ({ ...prev, [intentName]: 0 }))
      toast.error(`Không tải được dữ liệu ${intentName}. Vui lòng thử lại.`)
    } finally {
      setIntentCardLoadingByName((prev) => ({ ...prev, [intentName]: false }))
    }
  }, [])

  useEffect(() => {
    OVERVIEW_INTENT_CARD_CONFIG.forEach((item) => {
      void fetchIntentCardValue(item.key, '2026')
    })
  }, [fetchIntentCardValue])

  const applyIntentSummaryPeriod = useCallback((rawInput: string) => {
    const normalized = normalizeTaskPeriodInput(rawInput)
    if (!normalized) {
      toast.error('Định dạng không hợp lệ. Nhập yyyy hoặc mm/yyyy.')
      return
    }
    setIntentSummaryPeriodInput(normalized)
    setIntentSummaryAppliedPeriod(normalized)
    OVERVIEW_INTENT_CARD_CONFIG.forEach((item) => {
      void fetchIntentCardValue(item.key, normalized)
    })
  }, [fetchIntentCardValue])

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
      const rows = extractArrayFromResponse(response) as OrderDashboardMonthRow[]
      if (rows.length > 0 || isApiSuccessLike(response)) {
        setOrderDashboardRows(rows)
      } else {
        setOrderDashboardRows([])
        toast.info(response.message || 'Không có dữ liệu bảng tổng quan đơn hàng cho kỳ này.')
      }
    } catch (error) {
      if (isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 400)) {
        setOrderDashboardRows([])
        toast.info('Không có dữ liệu  cho kỳ này.')
        return
      }
      setOrderDashboardRows([])
      toast.error('Không tải được bảng tổng quan đơn hàng. Vui lòng thử lại.')
    } finally {
      setOrderDashboardLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchOrderDashboard('2026')
  }, [fetchOrderDashboard])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
        <div className="md:col-span-2 xl:col-span-6 flex justify-end">
          <div className="flex flex-wrap items-center justify-end gap-2">
            <p className="text-xs text-gray-500">
              Nhập yyyy để lấy 12 tháng, hoặc mm/yyyy để lọc theo tháng (UTC). Đang xem:{' '}
              <span className="font-medium text-[#003366]">{intentSummaryAppliedPeriod}</span>
            </p>
            <input
              value={intentSummaryPeriodInput}
              onChange={(e) => setIntentSummaryPeriodInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  applyIntentSummaryPeriod(intentSummaryPeriodInput)
                }
              }}
              placeholder="yyyy hoặc mm/yyyy"
              className="h-9 w-40 rounded-md border border-gray-200 px-3 text-sm outline-none focus:border-[#3366CC]"
            />
            <Button size="sm" onClick={() => applyIntentSummaryPeriod(intentSummaryPeriodInput)}>
              Lấy
            </Button>
          </div>
        </div>
        <AdminDashboardMetricCard
          className="xl:col-span-2"
          accentColor="#3366CC"
          iconBg="bg-[#EBF1FF]"
          iconColor="text-[#3366CC]"
          valueColor="text-[#3366CC]"
          Icon={Milk}
          topRightIcon={TrendingUp}
          topRightClassName="text-[#2ECC71]"
          title="Tổng tồn kho sản phẩm"
          value={
            inventoryDashboardLoading
              ? '...'
              : inventoryDashboard != null
                ? inventoryDashboard.totalProducts.toLocaleString('vi-VN')
                : '—'
          }
          unit="sản phẩm"
          footer={
            inventoryDashboardLoading
              ? 'Đang tải...'
              : inventoryDashboard
                ? `Loại sản phẩm: ${inventoryDashboard.totalItems.toLocaleString('vi-VN')}`
                : 'Chưa có dữ liệu kho'
          }
        />

        {OVERVIEW_INTENT_CARD_CONFIG.map((item) => {
          const CardIcon = item.Icon
          const currentApplied = intentCardAppliedByName[item.key] ?? '2026'
          const currentValue = intentCardValueByName[item.key] ?? 0
          const currentLoading = intentCardLoadingByName[item.key] ?? false
          const accent = INTENT_COLOR_BY_NAME[item.key] ?? '#3366CC'
          return (
            <AdminDashboardMetricCard
              key={item.key}
              className="xl:col-span-2"
              accentColor={accent}
              iconBg={item.iconBg}
              iconColor={item.iconColor}
              valueColor={item.valueColor}
              Icon={CardIcon}
              title={item.title}
              value={currentLoading ? '...' : currentValue.toLocaleString('vi-VN')}
              unit="nhiệm vụ"
              footer={`Kỳ lọc: ${currentApplied || intentSummaryAppliedPeriod}`}
            />
          )
        })}
      </div>

      <Card className="p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-[#003366] text-lg font-semibold">Bảng tổng quan nhiệm vụ</h3>
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
              <h3 className="text-[#003366] text-lg font-semibold">Bảng tổng quan đơn hàng</h3>
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
        {orderDashboardLoading && <p className="text-sm text-gray-500 mb-4">Đang tải bảng tổng quan đơn hàng...</p>}
        {!orderDashboardLoading && orderChartData.length === 0 && (
          <p className="text-sm text-gray-500 mb-4">Chưa có dữ liệu bảng tổng quan đơn hàng.</p>
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
    </div>
  )
}

