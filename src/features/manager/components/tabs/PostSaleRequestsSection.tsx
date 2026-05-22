import { useCallback, useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Eye, Loader2, XCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import Card from '@/components/ui/card/Card'
import Button from '@/components/ui/button/Button'
import PaginationBar from '@/components/ui/pagination/PaginationBar'
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
  if (s === 'Rejected') {
    return {
      label: 'Đã từ chối',
      badgeClass: 'bg-[#FB2C36] text-white',
      borderClass: 'border-t-[#FB2C36]'
    }
  }
  return {
    label: s || '—',
    badgeClass: 'bg-gray-400 text-white',
    borderClass: 'border-t-gray-400'
  }
}

function requestTypeUi(t: string): { label: string; badgeClass: string } {
  const key = String(t ?? '').trim()
  const label = requestTypeLabel(key)
  if (key === 'Refund') return { label, badgeClass: 'bg-[#2563EB] text-white' }
  if (key === 'Return') return { label, badgeClass: 'bg-[#7C3AED] text-white' }
  if (key === 'Cancel') return { label, badgeClass: 'bg-[#64748B] text-white' }
  if (key === 'Replacement') return { label, badgeClass: 'bg-[#0EA5E9] text-white' }
  return { label, badgeClass: 'bg-gray-500 text-white' }
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

/** Tiêu đề thẻ = mã đơn gốc (OD…), không sinh PSR001, PSR002… */
function postSaleOrderTitle(req: PostSaleRequestItem): string {
  const code = req.orderCode?.trim()
  if (code) return code
  return '—'
}

function totalRequestedQuantity(items: PostSaleRequestItem['postSaleItems']) {
  if (!items?.length) return 0
  return items.reduce((sum, item) => sum + Math.max(0, Number(item.quantity ?? 0)), 0)
}

type PostSaleRequestsSectionProps = {
  onViewOrder: (orderId: string, postSaleRequest: PostSaleRequestItem) => void
  listRefreshKey?: number
  onStatusActionSuccess?: () => void
}

type PostSaleFilterStatus = 'all' | 'Pending' | 'Approved' | 'Rejected'

const STATUS_FILTERS: Array<{ value: PostSaleFilterStatus; label: string }> = [
  { value: 'all', label: 'Tất cả' },
  { value: 'Pending', label: 'Chờ duyệt' },
  { value: 'Approved', label: 'Đã duyệt' },
  { value: 'Rejected', label: 'Đã từ chối' }
]

export default function PostSaleRequestsSection({
  onViewOrder,
  listRefreshKey = 0,
  onStatusActionSuccess
}: PostSaleRequestsSectionProps) {
  const [page, setPage] = useState(1)
  const [pageSize] = useState(9)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<PostSaleRequestItem[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState<PostSaleFilterStatus>('all')
  const [processingAction, setProcessingAction] = useState<{ id: string; type: 'approve' | 'reject' } | null>(null)

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

  const handleApprove = async (req: PostSaleRequestItem) => {
    if (!req.id) return
    setProcessingAction({ id: req.id, type: 'approve' })
    try {
      const msg = await PostSaleRequestApi.approvePostSaleRequest(req.id)
      toast.success(msg)
      await fetchList()
      onStatusActionSuccess?.()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Không thể duyệt yêu cầu.')
    } finally {
      setProcessingAction(null)
    }
  }

  const handleReject = async (req: PostSaleRequestItem) => {
    if (!req.id) return
    setProcessingAction({ id: req.id, type: 'reject' })
    try {
      const msg = await PostSaleRequestApi.rejectPostSaleRequest(req.id)
      toast.success(msg)
      await fetchList()
      onStatusActionSuccess?.()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Không thể từ chối yêu cầu.')
    } finally {
      setProcessingAction(null)
    }
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
        <div>
          <h2 className="text-[#003366] text-xl font-semibold">Yêu cầu hoàn tiền</h2>
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

        {filteredItems.map((req) => {
          const statusUi = requestStatusUi(String(req.status))
          const typeUi = requestTypeUi(String(req.type))
          const isPending = String(req.status) === 'Pending'
          const requestQty = totalRequestedQuantity(req.postSaleItems)
          const isProcessingCurrent = processingAction?.id === req.id
          const orderTitle = postSaleOrderTitle(req)
          return (
            <div
              key={req.id}
              className={`rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full border-t-4 ${statusUi.borderClass}`}
            >
              <div className="p-4 flex flex-col flex-1">
                <div className="mb-3 min-w-0">
                  <h3 className="text-lg font-bold text-[#003366] leading-tight font-mono">{orderTitle}</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap ${typeUi.badgeClass}`}
                    >
                      {typeUi.label}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap ${statusUi.badgeClass}`}
                    >
                      {statusUi.label}
                    </span>
                  </div>
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

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-0.5">Số lượng</p>
                    <p className="text-base font-semibold text-[#003366] tabular-nums">{requestQty.toLocaleString('vi-VN')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-0.5">Số tiền hoàn</p>
                    <p className="text-base font-bold text-[#003366] tabular-nums">{formatMoney(req.refundAmount)}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-xs text-gray-500">{formatDateTime(req.requestedTime)}</span>
                </div>

                <div className="pt-3 mt-auto border-t border-gray-100 space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full h-10 rounded-lg border-[#3366CC] text-[#3366CC] hover:bg-[#3366CC]/5 bg-transparent font-medium"
                    disabled={loading}
                    onClick={() => onViewOrder(req.orderId, req)}
                  >
                    <Eye className="h-4 w-4 mr-2 inline" />
                    Chi tiết đơn hàng
                  </Button>
                  {isPending && (
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        size="sm"
                        className="bg-[#F1B40E] hover:bg-[#e0a60d] text-white border-0 disabled:opacity-60"
                        disabled={loading || !!processingAction}
                        onClick={() => void handleReject(req)}
                      >
                        {isProcessingCurrent && processingAction?.type === 'reject' ? (
                          <Loader2 className="h-4 w-4 mr-1.5 inline animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4 mr-1.5 inline" />
                        )}
                        Từ chối
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        className="bg-[#26C271] hover:bg-[#22b366] text-white border-0 disabled:opacity-60"
                        disabled={loading || !!processingAction}
                        onClick={() => void handleApprove(req)}
                      >
                        {isProcessingCurrent && processingAction?.type === 'approve' ? (
                          <Loader2 className="h-4 w-4 mr-1.5 inline animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 mr-1.5 inline" />
                        )}
                        Duyệt
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6">
        <PaginationBar
          currentPage={page}
          setPage={setPage}
          totalPage={totalPages}
        />
      </div>
    </Card>
  )
}
