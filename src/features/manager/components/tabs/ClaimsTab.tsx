import { useEffect, useState } from 'react'
import Card from '@/components/ui/card/Card'
import Button from '@/components/ui/button/Button'
import Tag from '@/components/ui/tag/Tag'
import PaginationBar from '@/components/ui/pagination/PaginationBar'
import { toast } from 'react-toastify'
import { ClaimApi } from '../../api/claim-api'
import type { ManagerClaimDashboardData, ManagerClaimItem, ManagerClaimStatus } from '../../types/claim-type'

function toClaimStatus(raw: unknown, mode: 'pending' | 'history'): ManagerClaimStatus {
  const value = String(raw ?? '').toLowerCase()
  if (value.includes('approve')) return 'approved'
  if (value.includes('reject')) return 'rejected'
  return mode === 'pending' ? 'pending' : 'approved'
}

function normalizeClaim(raw: unknown, mode: 'pending' | 'history'): ManagerClaimItem {
  const item = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  const description = String(item.description ?? item.claimName ?? item.name ?? item.title ?? item.note ?? 'Không có mô tả')
  return {
    id: String(item.id ?? item.claimId ?? ''),
    staff: String(item.staff ?? item.staffName ?? item.createdBy ?? description ?? 'Chưa rõ'),
    type: String(item.type ?? item.claimType ?? item.category ?? 'Claim'),
    submitDate: String(item.submitDate ?? item.createdAt ?? item.startDate ?? item.startAt ?? '-'),
    description,
    reason: String(item.reason ?? item.note ?? item.description ?? 'Không có lý do'),
    status: toClaimStatus(item.status ?? item.claimStatus, mode)
  }
}

function claimStatusTag(status: ManagerClaimStatus) {
  if (status === 'approved') return <Tag variant="success" size="sm" className="text-[10px] h-4 px-2">Đã duyệt</Tag>
  if (status === 'rejected') return <Tag variant="danger" size="sm" className="text-[10px] h-4 px-2">Từ chối</Tag>
  return <Tag variant="warn" size="sm" className="text-[10px] h-4 px-2">Chờ duyệt</Tag>
}

export default function ClaimsTab() {
  const pageSize = 9
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [claims, setClaims] = useState<ManagerClaimItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'pending' | 'history'>('pending')
  const [processingClaimId, setProcessingClaimId] = useState<string | null>(null)
  const [dashboard, setDashboard] = useState<ManagerClaimDashboardData>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  })
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false)
  const visibleClaims = claims.slice(0, pageSize)
  const totalClaims = dashboard.pending + dashboard.approved + dashboard.rejected

  useEffect(() => {
    const fetchClaims = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = mode === 'pending'
          ? await ClaimApi.getPendingClaims(page, pageSize)
          : await ClaimApi.getHistoryClaims(page, pageSize)

        const items = Array.isArray(response?.items) ? response.items.map(item => normalizeClaim(item, mode)).slice(0, pageSize) : []
        setClaims(items)
        setTotalPages(Math.max(1, Math.ceil((response?.meta?.total_items ?? items.length) / pageSize)))
      } catch {
        setError('Không thể tải danh sách claim. Vui lòng thử lại.')
        setClaims([])
        setTotalPages(1)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchClaims()
  }, [mode, page])

  useEffect(() => {
    setPage(1)
  }, [mode])

  const fetchDashboard = async () => {
    setIsLoadingDashboard(true)
    try {
      const data = await ClaimApi.getDashboard()
      setDashboard(data)
    } catch {
      // Keep UI usable even if dashboard endpoint fails.
    } finally {
      setIsLoadingDashboard(false)
    }
  }

  useEffect(() => {
    void fetchDashboard()
  }, [])

  const fetchClaims = async (nextMode: 'pending' | 'history', nextPage: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = nextMode === 'pending'
        ? await ClaimApi.getPendingClaims(nextPage, pageSize)
        : await ClaimApi.getHistoryClaims(nextPage, pageSize)

      const items = Array.isArray(response?.items) ? response.items.map(item => normalizeClaim(item, nextMode)).slice(0, pageSize) : []
      setClaims(items)
      setTotalPages(Math.max(1, Math.ceil((response?.meta?.total_items ?? items.length) / pageSize)))
    } catch {
      setError('Không thể tải danh sách claim. Vui lòng thử lại.')
      setClaims([])
      setTotalPages(1)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproveClaim = async (id: string) => {
    if (!id) return
    setProcessingClaimId(id)
    setError(null)
    try {
      await ClaimApi.approveClaim(id)
      await fetchClaims(mode, page)
      await fetchDashboard()
      toast.success('Đã duyệt claim thành công.')
    } catch {
      setError('Không thể duyệt claim. Vui lòng thử lại.')
      toast.error('Duyệt claim thất bại. Vui lòng thử lại.')
    } finally {
      setProcessingClaimId(null)
    }
  }

  const handleRejectClaim = async (id: string) => {
    if (!id) return
    setProcessingClaimId(id)
    setError(null)
    try {
      await ClaimApi.rejectClaim(id)
      await fetchClaims(mode, page)
      await fetchDashboard()
      toast.success('Đã từ chối claim thành công.')
    } catch {
      setError('Không thể từ chối claim. Vui lòng thử lại.')
      toast.error('Từ chối claim thất bại. Vui lòng thử lại.')
    } finally {
      setProcessingClaimId(null)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[#003366] text-xl font-semibold">Claims</h2>
            <p className="text-sm text-gray-500 mt-1">Yêu cầu của staff</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={mode === 'pending' ? 'default' : 'outline'}
              size="sm"
              className={mode === 'pending' ? 'bg-[#3366CC] hover:bg-[#2952A3]' : ''}
              onClick={() => setMode('pending')}
              disabled={isLoading}
            >
              Pending
            </Button>
            <Button
              variant={mode === 'history' ? 'default' : 'outline'}
              size="sm"
              className={mode === 'history' ? 'bg-[#3366CC] hover:bg-[#2952A3]' : ''}
              onClick={() => setMode('history')}
              disabled={isLoading}
            >
              History
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 border-l-4 border-l-[#3366CC] bg-blue-50">
            <p className="text-sm text-gray-600 mb-1">Tổng claim</p>
            <p className="text-3xl font-bold text-[#003366]">{isLoadingDashboard ? '...' : totalClaims}</p>
          </Card>
          <Card className="p-4 border-l-4 border-l-[#F59E0B] bg-amber-50">
            <p className="text-sm text-gray-600 mb-1">Chờ duyệt</p>
            <p className="text-3xl font-bold text-amber-700">{isLoadingDashboard ? '...' : dashboard.pending}</p>
          </Card>
          <Card className="p-4 border-l-4 border-l-[#2ECC71] bg-green-50">
            <p className="text-sm text-gray-600 mb-1">Đã duyệt</p>
            <p className="text-3xl font-bold text-green-700">{isLoadingDashboard ? '...' : dashboard.approved}</p>
          </Card>
          <Card className="p-4 border-l-4 border-l-[#EF4444] bg-red-50">
            <p className="text-sm text-gray-600 mb-1">Từ chối</p>
            <p className="text-3xl font-bold text-red-700">{isLoadingDashboard ? '...' : dashboard.rejected}</p>
          </Card>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
            Đang tải danh sách claim...
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {!isLoading && claims.length === 0 && (
            <div className="col-span-full rounded-md border border-gray-200 bg-gray-50 px-3 py-8 text-center text-sm text-gray-600">
              Chưa có dữ liệu claim.
            </div>
          )}

          {visibleClaims.map(claim => (
            <Card key={claim.id} className="p-4 hover:shadow-md transition-shadow flex flex-col justify-between h-full border-t-4 border-t-[#3366CC]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-[#3366CC] text-lg">{claim.staff}</p>
                  <p className="text-sm text-gray-500">{claim.type}</p>
                </div>
                {claimStatusTag(claim.status)}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Submit date</span>
                  <span>{claim.submitDate}</span>
                </div>
                <div className="bg-[#F5F7FA] p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Description</p>
                  <p className="text-sm font-semibold text-[#003366]">{claim.description}</p>
                </div>
                <div className="bg-[#F5F7FA] p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Reason</p>
                  <p className="text-sm font-semibold text-[#003366]">{claim.reason}</p>
                </div>
              </div>

              {mode === 'pending' ? (
                <div className="pt-3 border-t mt-4 grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    className="bg-[#2ECC71] hover:bg-[#27AE60] text-white"
                    onClick={() => handleApproveClaim(claim.id)}
                    disabled={!!processingClaimId || isLoading}
                  >
                    {processingClaimId === claim.id ? 'Đang xử lý...' : 'Duyệt'}
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#EF4444] hover:bg-[#DC2626] text-white"
                    onClick={() => handleRejectClaim(claim.id)}
                    disabled={!!processingClaimId || isLoading}
                  >
                    {processingClaimId === claim.id ? 'Đang xử lý...' : 'Từ chối'}
                  </Button>
                </div>
              ) : (
                <div className="pt-3 border-t mt-4">
                  <Button size="sm" className="w-full bg-[#93C5FD] text-white hover:bg-[#93C5FD]" disabled>
                    Đã xử lý
                  </Button>
                </div>
              )}
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
    </div>
  )
}

