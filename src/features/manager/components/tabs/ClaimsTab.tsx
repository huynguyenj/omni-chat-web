import { useCallback, useEffect, useState } from 'react'
import { Loader2, Search, X } from 'lucide-react'
import Card from '@/components/ui/card/Card'
import Button from '@/components/ui/button/Button'
import Tag from '@/components/ui/tag/Tag'
import PaginationBar from '@/components/ui/pagination/PaginationBar'
import { toast } from 'react-toastify'
import { ClaimApi } from '../../api/claim-api'
import { ManagerStaffApi } from '../../api/manager-staff-api'
import type { StaffDetailType, StaffIntentType } from '../../types/staff-type'
import type { ManagerIntentType } from '../../api/manager-staff-api'
import type {
  ManagerChangeTaskClaimItem,
  ManagerClaimDashboardData,
  ManagerClaimItem,
  ManagerClaimStatus
} from '../../types/claim-type'

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

function parseStaffIntentTypesFromClaim(raw: unknown): StaffIntentType[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((entry) => {
      const o = entry && typeof entry === 'object' ? (entry as Record<string, unknown>) : {}
      const id = String(o.id ?? '')
      const intentTypeName = String(o.intentTypeName ?? o.intent_type_name ?? o.typeName ?? '')
      if (!id && !intentTypeName) return null
      return { id: id || intentTypeName, intentTypeName: intentTypeName || id }
    })
    .filter((x): x is StaffIntentType => x != null)
}

function normalizeChangeTaskClaim(raw: unknown): ManagerChangeTaskClaimItem {
  const item = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  return {
    id: String(item.id ?? ''),
    description: String(item.description ?? 'Không có mô tả'),
    reason: String(item.reason ?? 'Không có lý do'),
    submitDate: String(item.submitDate ?? item.createdAt ?? '-'),
    status: String(item.status ?? 'Pending'),
    staffId: String(item.staffId ?? item.staff_id ?? ''),
    staffName: String(item.staffName ?? item.staff ?? 'Chưa rõ'),
    conversationId: String(item.conversationId ?? item.conversation_id ?? ''),
    staffIntentTypes: parseStaffIntentTypesFromClaim(item.staffIntentTypes ?? item.staff_intent_types),
    claimTypeId: String(item.claimTypeId ?? item.claim_type_id ?? ''),
    claimTypeName: String(item.claimTypeName ?? item.claimType ?? 'CHANGETASK')
  }
}

async function enrichChangeTaskClaimsWithStaffIntents(
  items: ManagerChangeTaskClaimItem[]
): Promise<ManagerChangeTaskClaimItem[]> {
  const missing = items.filter((c) => c.staffIntentTypes.length === 0 && c.staffId)
  if (missing.length === 0) return items
  const ids = [...new Set(missing.map((c) => c.staffId))]
  const map = await ManagerStaffApi.resolveStaffIntentTypesByStaffIds(ids)
  return items.map((c) =>
    c.staffIntentTypes.length > 0 ? c : { ...c, staffIntentTypes: map.get(c.staffId) ?? [] }
  )
}

async function mapRawToChangeTaskClaimsWithIntents(rawItems: unknown[]): Promise<ManagerChangeTaskClaimItem[]> {
  const items = Array.isArray(rawItems) ? rawItems.map((item) => normalizeChangeTaskClaim(item)) : []
  return enrichChangeTaskClaimsWithStaffIntents(items)
}

function ChangeTaskStaffIntentChips({ intents }: { intents: StaffIntentType[] }) {
  if (!intents.length) {
    return <p className="text-xs text-gray-500">Chưa xác định IntentTypes cho staff.</p>
  }
  return (
    <div className="flex flex-wrap gap-1.5 mt-1">
      {intents.map((intent) => (
        <Tag
          key={`${intent.id}-${intent.intentTypeName}`}
          variant="gray"
          size="sm"
          className="text-[10px] h-5 !py-0 !px-2 font-semibold"
        >
          {intent.intentTypeName}
        </Tag>
      ))}
    </div>
  )
}

function formatDateTime(rawDate: string) {
  if (!rawDate) return '—'
  const d = new Date(rawDate)
  if (Number.isNaN(d.getTime())) return rawDate
  const date = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const time = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })
  return `${date} ${time}`
}

function claimStatusTag(status: ManagerClaimStatus) {
  if (status === 'approved') return <Tag variant="success" size="sm" className="text-[10px] h-4 px-2">Đã duyệt</Tag>
  if (status === 'rejected') return <Tag variant="danger" size="sm" className="text-[10px] h-4 px-2">Từ chối</Tag>
  return <Tag variant="warn" size="sm" className="text-[10px] h-4 px-2">Chờ duyệt</Tag>
}

function StaffPickerModal({
  open,
  onClose,
  onSelect
}: {
  open: boolean
  onClose: () => void
  onSelect: (staff: StaffDetailType) => void
}) {
  const pageSize = 10
  const [page, setPage] = useState(1)
  const [searchDraft, setSearchDraft] = useState('')
  const [search, setSearch] = useState('')
  const [items, setItems] = useState<StaffDetailType[]>([])
  const [intentTypes, setIntentTypes] = useState<ManagerIntentType[]>([])
  const [intentLoading, setIntentLoading] = useState(false)
  const [selectedIntentId, setSelectedIntentId] = useState<string>('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (!open) return
    const fetchStaffs = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await ManagerStaffApi.getStaffs({
          pageNumber: page,
          pageSize,
          search: search.trim() || undefined,
          descending: false
        })
        if (res.is_success === false || res.data == null) {
          throw new Error(res.message || 'Không tải được danh sách nhân viên.')
        }
        setItems(Array.isArray(res.data.items) ? res.data.items : [])
        setTotalPages(Math.max(1, Number(res.data.meta?.total_pages ?? 1)))
      } catch {
        setError('Không thể tải danh sách nhân viên.')
        setItems([])
        setTotalPages(1)
      } finally {
        setLoading(false)
      }
    }
    void fetchStaffs()
  }, [open, page, search])

  useEffect(() => {
    if (!open) return
    const fetchIntentTypes = async () => {
      setIntentLoading(true)
      try {
        const res = await ManagerStaffApi.getIntentTypes()
        if (res.is_success === false || !Array.isArray(res.data)) {
          throw new Error(res.message || 'Không tải được loại intent.')
        }
        setIntentTypes(res.data)
      } catch {
        setIntentTypes([])
      } finally {
        setIntentLoading(false)
      }
    }
    void fetchIntentTypes()
  }, [open])

  useEffect(() => {
    if (!open) {
      setPage(1)
      setSearchDraft('')
      setSearch('')
      setSelectedIntentId('all')
    }
  }, [open])

  const filteredItems = selectedIntentId === 'all'
    ? items
    : items.filter((staff) => Array.isArray(staff.staffIntentTypes) && staff.staffIntentTypes.some((intent) => intent.id === selectedIntentId))

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" onMouseDown={onClose}>
      <div
        className="w-[920px] max-w-[95vw] h-[720px] max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-amber-700 bg-amber-600 px-5 py-4 shrink-0">
          <div>
            <h3 className="text-lg font-semibold text-white">Thay nhân viên</h3>
            <p className="text-xs text-amber-50/90 mt-0.5">Chỉ hiển thị tên, số điện thoại và email</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 w-9 shrink-0 p-0 border-white/50 text-white hover:bg-white/15 hover:text-white"
            onClick={onClose}
            aria-label="Đóng"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="px-5 py-3 border-b border-gray-100 shrink-0">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchDraft}
                onChange={(e) => setSearchDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSearch(searchDraft)
                    setPage(1)
                  }
                }}
                placeholder="Tìm theo tên, email, số điện thoại..."
                className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-[#003366] outline-none focus:border-[#3366CC]"
              />
            </div>
            <Button
              type="button"
              size="sm"
              className="shrink-0 h-10 px-4 bg-[#3366CC] hover:bg-[#2952A3] text-white"
              onClick={() => {
                setSearch(searchDraft)
                setPage(1)
              }}
            >
              Tìm
            </Button>
          </div>
          <div className="mt-3">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Lọc theo staffIntentTypes</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors ${
                  selectedIntentId === 'all'
                    ? 'bg-[#3366CC] text-white border-[#3366CC]'
                    : 'bg-white text-[#003366] border-gray-200 hover:border-[#3366CC]/40'
                }`}
                onClick={() => setSelectedIntentId('all')}
              >
                Tất cả
              </button>
              {intentLoading && (
                <span className="text-xs text-gray-500">Đang tải intent...</span>
              )}
              {!intentLoading && intentTypes.map((intent) => (
                <button
                  key={intent.id}
                  type="button"
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors ${
                    selectedIntentId === intent.id
                      ? 'bg-[#3366CC] text-white border-[#3366CC]'
                      : 'bg-white text-[#003366] border-gray-200 hover:border-[#3366CC]/40'
                  }`}
                  onClick={() => setSelectedIntentId(intent.id)}
                >
                  {intent.typeName}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-5 mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 shrink-0">
            {error}
          </div>
        )}

        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-3">
          {loading && (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-600">
              <Loader2 className="h-5 w-5 animate-spin text-[#3366CC]" />
              Đang tải...
            </div>
          )}
          {!loading && filteredItems.length === 0 && (
            <p className="text-center text-sm text-gray-500 py-10">Không có nhân viên phù hợp.</p>
          )}
          {!loading && filteredItems.length > 0 && (
            <ul className="space-y-2">
              {filteredItems.map((staff) => (
                <li key={staff.id}>
                  <button
                    type="button"
                    className="w-full text-left rounded-xl border border-gray-200 bg-white px-4 py-3 hover:border-[#3366CC]/50 hover:bg-[#EAF3FF]/40 transition-colors"
                    onClick={() => onSelect(staff)}
                  >
                    <p className="font-semibold text-[#003366]">{staff.name || '—'}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{staff.phone || '—'}</p>
                    <p className="text-sm text-gray-600 break-all">{staff.email || '—'}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-gray-100 px-5 py-3 shrink-0">
          <PaginationBar currentPage={page} setPage={setPage} totalPage={totalPages} />
        </div>
      </div>
    </div>
  )
}

function ChangeTaskClaimDetailModal({
  claim,
  onClose,
  onReassignSuccess
}: {
  claim: ManagerChangeTaskClaimItem | null
  onClose: () => void
  onReassignSuccess: () => Promise<void>
}) {
  const [staffPickerOpen, setStaffPickerOpen] = useState(false)
  const [pickedStaffSummary, setPickedStaffSummary] = useState<string | null>(null)
  const [reassigning, setReassigning] = useState(false)

  if (!claim) return null
  const status = toClaimStatus(claim.status, 'pending')

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onMouseDown={onClose}>
        <div
          className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-gray-100 bg-white px-5 py-4">
            <div>
              <h3 className="text-lg font-semibold text-[#003366]">Chi tiết ChangeTask Claim</h3>
            </div>
            <Button type="button" variant="outline" size="sm" className="h-9 w-9 shrink-0 p-0" onClick={onClose} aria-label="Đóng">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3 p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="font-bold text-[#3366CC] text-lg">{claim.staffName || 'Chưa rõ'}</p>
                <p className="text-sm text-gray-500">{claim.claimTypeName || 'Claim'}</p>
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mt-2">IntentTypes (staff)</p>
                <ChangeTaskStaffIntentChips intents={claim.staffIntentTypes} />
              </div>
              {claimStatusTag(status)}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-[#F5F7FA] p-3">
                <p className="text-xs text-gray-500 mb-1">Submit date</p>
                <p className="font-medium text-[#003366]">{formatDateTime(claim.submitDate)}</p>
              </div>
              <div className="rounded-lg bg-[#F5F7FA] p-3">
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <p className="font-medium text-[#003366]">{claim.status || '—'}</p>
              </div>
            </div>

            <div className="rounded-lg bg-[#F5F7FA] p-3">
              <p className="text-xs text-gray-500 uppercase font-medium mb-1">Description</p>
              <p className="text-sm font-semibold text-[#003366]">{claim.description || '—'}</p>
            </div>

            <div className="rounded-lg bg-[#F5F7FA] p-3">
              <p className="text-xs text-gray-500 uppercase font-medium mb-1">Reason</p>
              <p className="text-sm font-semibold text-[#003366]">{claim.reason || '—'}</p>
            </div>

            <div className="rounded-lg border border-amber-200 overflow-hidden">
              <p className="bg-amber-600 px-4 py-2.5 text-xs font-semibold text-white uppercase tracking-wide">Thay nhân viên</p>
              <div className="space-y-2 bg-amber-50/50 p-4">
                {pickedStaffSummary ? (
                  <p className="text-sm text-gray-800">{pickedStaffSummary}</p>
                ) : (
                  <p className="text-xs text-gray-500">Chưa chọn nhân viên.</p>
                )}
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  className="w-full bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-60"
                  disabled={reassigning}
                  onClick={() => setStaffPickerOpen(true)}
                >
                  {reassigning ? 'Đang thay...' : 'Thay nhân viên'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <StaffPickerModal
        open={staffPickerOpen}
        onClose={() => setStaffPickerOpen(false)}
        onSelect={async (staff) => {
          if (!claim.conversationId) {
            toast.error('Thiếu conversationId, không thể thay nhân viên.')
            setStaffPickerOpen(false)
            return
          }
          setReassigning(true)
          try {
            const msg = await ClaimApi.reassignClaimConversation(claim.conversationId, staff.id)
            setPickedStaffSummary(`${staff.name} · ${staff.phone} · ${staff.email}`)
            toast.success(msg)
            await onReassignSuccess()
          } catch (e) {
            toast.error(e instanceof Error ? e.message : 'Thay nhân viên thất bại.')
          } finally {
            setReassigning(false)
            setStaffPickerOpen(false)
          }
        }}
      />
    </>
  )
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
  const [changeTaskPage, setChangeTaskPage] = useState(1)
  const [changeTaskTotalPages, setChangeTaskTotalPages] = useState(1)
  const [changeTaskClaims, setChangeTaskClaims] = useState<ManagerChangeTaskClaimItem[]>([])
  const [changeTaskLoading, setChangeTaskLoading] = useState(false)
  const [changeTaskError, setChangeTaskError] = useState<string | null>(null)
  const [selectedChangeTaskClaim, setSelectedChangeTaskClaim] = useState<ManagerChangeTaskClaimItem | null>(null)
  const changeTaskPageSize = 10
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

  const refreshChangeTaskClaims = useCallback(async () => {
    setChangeTaskLoading(true)
    setChangeTaskError(null)
    try {
      const response = await ClaimApi.getPendingChangeTaskClaims(changeTaskPage, changeTaskPageSize)
      const rawItems =
        Array.isArray((response as { items?: unknown[] })?.items)
          ? (response as { items: unknown[] }).items
          : []
      const enriched = await mapRawToChangeTaskClaimsWithIntents(rawItems)
      setChangeTaskClaims(enriched)
      const totalPages = Number((response as { meta?: { total_pages?: number } })?.meta?.total_pages ?? 1)
      setChangeTaskTotalPages(Math.max(1, Number.isFinite(totalPages) ? totalPages : 1))
    } catch {
      setChangeTaskError('Không thể tải danh sách ChangeTask claim.')
      setChangeTaskClaims([])
      setChangeTaskTotalPages(1)
    } finally {
      setChangeTaskLoading(false)
    }
  }, [changeTaskPage, changeTaskPageSize])

  useEffect(() => {
    void refreshChangeTaskClaims()
  }, [refreshChangeTaskClaims])

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
      await refreshChangeTaskClaims()
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
      await refreshChangeTaskClaims()
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
                    className="bg-[#6FDFA0] hover:bg-[#5BCB8C] text-white"
                    onClick={() => handleApproveClaim(claim.id)}
                    disabled={!!processingClaimId || isLoading}
                  >
                    {processingClaimId === claim.id ? 'Đang xử lý...' : 'Duyệt'}
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#F87171] hover:bg-[#F25F5F] text-white"
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

      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-[#003366] text-xl font-semibold">Danh sách ChangeTask Claim </h3>
        </div>

        {changeTaskError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {changeTaskError}
          </div>
        )}

        {changeTaskLoading && (
          <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
            Đang tải ChangeTask claim...
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {!changeTaskLoading && changeTaskClaims.length === 0 && (
            <div className="col-span-full rounded-md border border-gray-200 bg-gray-50 px-3 py-8 text-center text-sm text-gray-600">
              Chưa có dữ liệu ChangeTask claim.
            </div>
          )}

          {changeTaskClaims.map((item) => {
            const status = toClaimStatus(item.status, 'pending')
            return (
              <Card key={item.id} className="p-4 hover:shadow-md transition-shadow flex flex-col justify-between h-full border-t-2 border-t-[#3366CC]">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <p className="font-bold text-[#3366CC] text-lg">{item.staffName || 'Chưa rõ'}</p>
                    <p className="text-sm text-gray-500">{item.claimTypeName || 'Claim'}</p>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mt-2">IntentTypes</p>
                    <ChangeTaskStaffIntentChips intents={item.staffIntentTypes} />
                  </div>
                  {claimStatusTag(status)}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Submit date</span>
                    <span>{formatDateTime(item.submitDate)}</span>
                  </div>
                  <div className="bg-[#F5F7FA] p-3 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">Description</p>
                    <p className="text-sm font-semibold text-[#003366]">{item.description || '—'}</p>
                  </div>
                  <div className="bg-[#F5F7FA] p-3 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">Reason</p>
                    <p className="text-sm font-semibold text-[#003366]">{item.reason || '—'}</p>
                  </div>
                </div>

                <div className="pt-3 border-t mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-[#3366CC] text-[#3366CC] hover:bg-[#3366CC]/5"
                    disabled={changeTaskLoading}
                    onClick={() => setSelectedChangeTaskClaim(item)}
                  >
                    Xem chi tiết
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="mt-6">
          <PaginationBar
            currentPage={changeTaskPage}
            setPage={setChangeTaskPage}
            totalPage={changeTaskTotalPages}
          />
        </div>
      </Card>

      <ChangeTaskClaimDetailModal
        key={selectedChangeTaskClaim?.id ?? 'closed'}
        claim={selectedChangeTaskClaim}
        onClose={() => setSelectedChangeTaskClaim(null)}
        onReassignSuccess={refreshChangeTaskClaims}
      />
    </div>
  )
}

