import { useCallback, useEffect, useMemo, useState } from 'react'
import { Eye, Loader2 } from 'lucide-react'
import Card from '@/components/ui/card/Card'
import Button from '@/components/ui/button/Button'
import { PostSaleRequestApi } from '../../api/post-sale-request-api'
import type { PostSaleRequestItem } from '../../types/post-sale-request-type'

function formatMoney(n: number | null | undefined) {
  if (n == null || Number.isNaN(Number(n))) return '—'
  return `${Number(n).toLocaleString('vi-VN')}đ`
}

function formatDateTime(iso: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const date = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const time = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })
  return `${date} ${time}`
}

function requestStatusUi(status: string): { label: string; badgeClass: string; borderClass: string } {
  const s = String(status)
  if (s === 'Pending') {
    return {
      label: 'Chờ duyệt',
      badgeClass: 'bg-[#FF9800] text-white',
      borderClass: 'border-t-[#FF9800]'
    }
  }
  if (s === 'Approved') {
    return {
      label: 'Đã duyệt',
      badgeClass: 'bg-[#26C271] text-white',
      borderClass: 'border-t-[#26C271]'
    }
  }
  return {
    label: s || '—',
    badgeClass: 'bg-gray-400 text-white',
    borderClass: 'border-t-gray-400'
  }
}

function productSummary(items: PostSaleRequestItem['postSaleItems']) {
  if (!items?.length) return '—'
  const first = items[0]?.productName?.trim() || 'Sản phẩm'
  if (items.length === 1) return first
  return `${first} + ${items.length - 1} sản phẩm khác`
}

function requestTypeLabel(t: string) {
  const map: Record<string, string> = {
    Refund: 'Hoàn tiền',
    Cancel: 'Hủy đơn',
    Replacement: 'Đổi hàng',
    Return: 'Trả hàng'
  }
  return map[t] ?? t ?? '—'
}

type PostSaleRequestsSectionProps = {
  onViewOrder: (orderId: string, postSaleRequest: PostSaleRequestItem) => void
  listRefreshKey?: number
}

type PostSaleFilterStatus = 'all' | 'Pending' | 'Approved' | 'Rejected'

const STATUS_FILTERS: Array<{ value: PostSaleFilterStatus; label: string }> = [
  { value: 'all', label: 'Tất cả' },
  { value: 'Pending', label: 'Chờ duyệt' },
  { value: 'Approved', label: 'Đã duyệt' },
  { value: 'Rejected', label: 'Đã từ chối' }
]

export default function PostSaleRequestsSection({ onViewOrder, listRefreshKey = 0 }: PostSaleRequestsSectionProps) {
  const [page, setPage] = useState(1)
  const [pageSize] = useState(9)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<PostSaleRequestItem[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState<PostSaleFilterStatus>('all')

  const fetchList = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params: Parameters<typeof PostSaleRequestApi.getPostSaleRequests>[0] = {
        pageNumber: page,
        pageSize
      }
      const res = await PostSaleRequestApi.getPostSaleRequests(params)
      if (res.is_success === false || res.data == null) {
        throw new Error(res.message || 'Không tải được danh sách yêu cầu.')
      }
      const list = res.data.items ?? []
      const pages = res.data.meta?.total_pages ?? 1
      setItems(list)
      setTotalPages(Math.max(1, pages))
    } catch {
      setError('Không thể tải yêu cầu sau bán hàng. Vui lòng thử lại.')
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [page, pageSize])

  useEffect(() => {
    void fetchList()
  }, [fetchList, listRefreshKey])

  const filteredItems = useMemo(() => {
    if (statusFilter === 'all') return items
    return items.filter((r) => String(r.status) === statusFilter)
  }, [items, statusFilter])

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
        <div>
          <h2 className="text-[#003366] text-xl font-semibold">Yêu cầu hoàn tiền (Refund)</h2>
          <p className="text-sm text-gray-500 mt-1">Các yêu cầu hoàn tiền từ nhân viên cần xử lý</p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          {STATUS_FILTERS.map((option) => {
            const active = statusFilter === option.value
            return (
              <Button
                key={option.value}
                size="sm"
                variant={active ? 'default' : 'outline'}
                className={active ? 'bg-[#3366CC] hover:bg-[#2952A3]' : ''}
                onClick={() => setStatusFilter(option.value)}
                disabled={loading}
              >
                {option.label}
              </Button>
            )
          })}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      {loading && (
        <div className="mb-4 flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
          Đang tải yêu cầu...
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {!loading && filteredItems.length === 0 && (
          <div className="col-span-full rounded-md border border-gray-200 bg-gray-50 px-3 py-8 text-center text-sm text-gray-600">
            Không có yêu cầu phù hợp với bộ lọc.
          </div>
        )}

        {filteredItems.map((req, idx) => {
          const ui = requestStatusUi(String(req.status))
          const displayId = `PSR${String((page - 1) * pageSize + idx + 1).padStart(3, '0')}`
          return (
            <div
              key={req.id}
              className={`rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full border-t-4 ${ui.borderClass}`}
            >
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-[#003366] leading-tight font-mono">{displayId}</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">{requestTypeLabel(String(req.type))}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap ${ui.badgeClass}`}
                  >
                    {ui.label}
                  </span>
                </div>

                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">Sản phẩm</p>
                <p className="text-sm font-medium text-[#003366] mb-4 line-clamp-3">{productSummary(req.postSaleItems)}</p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-0.5">Khách hàng</p>
                    <p className="text-sm font-semibold text-[#3366CC] line-clamp-2">{req.customerName || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-0.5">Nhân viên</p>
                    <p className="text-sm font-semibold text-[#3366CC] line-clamp-2">{req.presentByStaffName || '—'}</p>
                  </div>
                </div>

                <div className="mb-4 flex-1">
                  <p className="text-[10px] font-semibold text-[#FF9800] uppercase tracking-wide mb-1">Lý do</p>
                  <div className="rounded-lg bg-[#FFF8E6] px-3 py-2 border border-amber-100">
                    <p className="text-sm text-gray-800 italic line-clamp-4">{req.reason?.trim() || '—'}</p>
                  </div>
                </div>

                <div className="flex items-end justify-between gap-2 mb-4">
                  <span className="text-xs text-gray-500">{formatDateTime(req.requestedTime)}</span>
                  <span className="text-xl font-bold text-[#003366] tabular-nums">{formatMoney(req.refundAmount)}</span>
                </div>

                <div className="pt-3 mt-auto border-t border-gray-100">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full h-10 rounded-lg border-[#3366CC] text-[#3366CC] hover:bg-[#3366CC]/5 bg-transparent font-medium"
                    disabled={loading}
                    onClick={() => onViewOrder(req.orderId, req)}
                  >
                    <Eye className="h-4 w-4 mr-2 inline" />
                    Xem &amp; Xử lý
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between mt-6">
        <Button variant="outline" size="sm" disabled={page <= 1 || loading} onClick={() => setPage((p) => Math.max(1, p - 1))}>
          Prev
        </Button>
        <span className="text-sm text-gray-600">
          Page {page}/{totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages || loading}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </Button>
      </div>
    </Card>
  )
}
