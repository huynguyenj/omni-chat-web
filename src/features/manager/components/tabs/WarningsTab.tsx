import { useEffect, useState } from 'react'
import { AlertTriangle, Clock, X } from 'lucide-react'
import Card from '@/components/ui/card/Card'
import Button from '@/components/ui/button/Button'
import Tag from '@/components/ui/tag/Tag'
import PaginationBar from '@/components/ui/pagination/PaginationBar'
import { toast } from 'react-toastify'
import { WarningApi } from '../../api/warning-api'
import type { ManagerWarningDetailResponse, ManagerWarningItem } from '../../types/warning-type'

function warningSeverity(warning: ManagerWarningItem): 'high' | 'medium' {
  if (String(warning.warningType).toLowerCase().includes('notrespond')) return 'high'
  return 'medium'
}

function severityTag(warning: ManagerWarningItem) {
  if (warningSeverity(warning) === 'high') {
    return <Tag variant="danger" size="sm" className="text-[10px] h-4 px-2">Nghiêm trọng</Tag>
  }
  return <Tag variant="warn" size="sm" className="text-[10px] h-4 px-2">Cảnh báo</Tag>
}

export default function WarningsTab() {
  const pageSize = 9
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [warnings, setWarnings] = useState<ManagerWarningItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [viewingWarningId, setViewingWarningId] = useState<string | null>(null)
  const [selectedWarning, setSelectedWarning] = useState<ManagerWarningDetailResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWarnings = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await WarningApi.getWarnings(page, pageSize)
        const items = Array.isArray(response?.items) ? response.items : []
        setWarnings(
          items.slice(0, pageSize).map((item, index) => ({
            id: item.id || `${item.customerName}-${item.staffName}-${index}`,
            customerName: item.customerName ?? 'Chưa rõ',
            staffName: item.staffName ?? 'Chưa rõ',
            createAt: item.createAt ?? '',
            warningType: item.warningType ?? 'UnknownWarning',
            reason: item.reason ?? 'Không có mô tả',
            isReviewed: item.isReviewed
          }))
        )
        setTotalPages(Math.max(1, Math.ceil((response?.meta?.total_items ?? items.length) / pageSize)))
      } catch {
        setError('Không thể tải danh sách cảnh báo. Vui lòng thử lại.')
        setWarnings([])
        setTotalPages(1)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchWarnings()
  }, [page])

  const highCount = warnings.filter(w => warningSeverity(w) === 'high').length
  const mediumCount = warnings.filter(w => warningSeverity(w) === 'medium').length

  const handleViewContent = async (warningId: string) => {
    if (!warningId) return
    const currentWarning = warnings.find((item) => item.id === warningId)
    const previousReviewed = currentWarning?.isReviewed
    setViewingWarningId(warningId)
    setWarnings((prev) => prev.map((item) => (
      item.id === warningId ? { ...item, isReviewed: true } : item
    )))
    try {
      const warningDetail = await WarningApi.getWarningDetail(warningId)
      setSelectedWarning({
        ...warningDetail,
        isReviewed: true
      })
    } catch {
      setWarnings((prev) => prev.map((item) => (
        item.id === warningId ? { ...item, isReviewed: previousReviewed } : item
      )))
      toast.error('Không thể tải nội dung cảnh báo. Vui lòng thử lại.')
    } finally {
      setViewingWarningId(null)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[#003366] text-xl font-semibold">Cảnh báo hội thoại</h2>
            <p className="text-sm text-gray-500 mt-1">Giám sát các cuộc hội thoại có vấn đề</p>
          </div>
          <div className="flex items-center gap-2">
            <Tag variant="danger" size="sm" className="text-[10px] h-4 px-2">
              {highCount} Nghiêm trọng
            </Tag>
            <Tag variant="warn" size="sm" className="text-[10px] h-4 px-2">
              {mediumCount} Cảnh báo
            </Tag>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
            Đang tải danh sách cảnh báo...
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {!isLoading && warnings.length === 0 && (
            <div className="col-span-full rounded-md border border-gray-200 bg-gray-50 px-3 py-8 text-center text-sm text-gray-600">
              Chưa có dữ liệu cảnh báo.
            </div>
          )}

          {warnings.map(warning => (
            <Card
              key={warning.id}
              className="p-4 hover:shadow-md transition-shadow flex flex-col justify-between h-full border-t-4"
              style={{ borderTopColor: warningSeverity(warning) === 'high' ? '#FB2C36' : '#FF9800' }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`h-4 w-4 ${warningSeverity(warning) === 'high' ? 'text-red-600' : 'text-yellow-600'}`} />
                    <h3 className="font-bold text-[#003366] text-sm line-clamp-1">{warning.warningType}</h3>
                  </div>
                  {severityTag(warning)}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex flex-col">
                      <p className="text-gray-500 uppercase font-medium">Nhân viên</p>
                      <p className="text-[#003366] font-medium line-clamp-1">{warning.staffName}</p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-gray-500 uppercase font-medium">Khách hàng</p>
                      <p className="text-[#003366] font-medium line-clamp-1">{warning.customerName}</p>
                    </div>
                  </div>

                  <div className="p-2 bg-white rounded border border-gray-100 min-h-[4rem]">
                    <p className="text-xs text-gray-700 line-clamp-3">
                      <span className="font-bold">Chi tiết:</span> {warning.reason}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 items-center">
                    <Tag variant="warn" size="sm" className="text-[10px] h-4 px-2">
                      <Clock className="h-3 w-3 mr-1 inline" />
                      {warning.createAt ? new Date(warning.createAt).toLocaleString('vi-VN') : '-'}
                    </Tag>
                  </div>

                  <div className="flex items-center justify-end pt-2">
                    <Tag
                      variant={warning.isReviewed ? 'success' : 'danger'}
                      size="sm"
                      className={`h-5 px-2 text-[10px] font-semibold ${
                        warning.isReviewed
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-red-100 text-red-800 border border-red-200 animate-pulse'
                      }`}
                    >
                      {warning.isReviewed ? 'Đã xem' : 'Chưa xem'}
                    </Tag>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => void handleViewContent(warning.id)}
                  disabled={viewingWarningId === warning.id}
                >
                  {viewingWarningId === warning.id ? 'Đang tải...' : 'Xem nội dung'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6">
          <PaginationBar
            currentPage={page}
            setPage={setPage}
            totalPage={totalPages}
          />
        </div>
      </Card>

      {selectedWarning && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4" onMouseDown={() => setSelectedWarning(null)}>
          <Card className="w-full max-w-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto" onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h3 className="text-[#003366] text-lg font-semibold">Nội dung cảnh báo</h3>
              </div>
              <Button size="sm" variant="outline" className="shrink-0" onClick={() => setSelectedWarning(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <p className="text-xs text-gray-500 uppercase">Loại cảnh báo</p>
                <p className="text-sm font-semibold text-[#003366]">{selectedWarning.warningType}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg border border-gray-200 p-3">
                  <p className="text-xs text-gray-500 uppercase">Nhân viên</p>
                  <p className="text-sm font-medium text-[#003366]">{selectedWarning.staffName}</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-3">
                  <p className="text-xs text-gray-500 uppercase">Khách hàng</p>
                  <p className="text-sm font-medium text-[#003366]">{selectedWarning.customerName}</p>
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 p-3">
                <p className="text-xs text-gray-500 uppercase">Thời gian tạo</p>
                <p className="text-sm font-medium text-[#003366]">
                  {selectedWarning.createAt ? new Date(selectedWarning.createAt).toLocaleString('vi-VN') : '-'}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-3">
                <p className="text-xs text-gray-500 uppercase">Trạng thái</p>
                <Tag
                  variant={selectedWarning.isReviewed ? 'success' : 'danger'}
                  size="sm"
                  className={`h-5 px-2 text-[10px] font-semibold mt-1 ${
                    selectedWarning.isReviewed
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}
                >
                  {selectedWarning.isReviewed ? 'Đã xem' : 'Chưa xem'}
                </Tag>
              </div>
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-xs text-red-700 uppercase font-semibold">Nội dung cảnh báo</p>
                <p className="text-sm text-red-800 mt-1 whitespace-pre-wrap">{selectedWarning.reason}</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

