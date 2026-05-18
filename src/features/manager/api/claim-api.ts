import { apiPublic } from '@/config/axios'
import type { ApiResponseStructure } from '@/types/api-response'
import type {
  ManagerChangeTaskClaimListResponse,
  ManagerClaimDashboardData,
  ManagerClaimListResponse
} from '../types/claim-type'

function resolveClaimsEndpoint(mode: 'pending' | 'history') {
  const baseUrl = (apiPublic.defaults.baseURL ?? '').toLowerCase()
  if (baseUrl.includes('/api/v1')) return `/claims/${mode}`
  return `/api/v1/claims/${mode}`
}

function resolveClaimActionEndpoint(id: string, action: 'approve' | 'reject') {
  const baseUrl = (apiPublic.defaults.baseURL ?? '').toLowerCase()
  if (baseUrl.includes('/api/v1')) return `/claims/${id}/${action}`
  return `/api/v1/claims/${id}/${action}`
}

function resolveClaimDashboardEndpoint() {
  const baseUrl = (apiPublic.defaults.baseURL ?? '').toLowerCase()
  if (baseUrl.includes('/api/v1')) return '/claims/dashboard'
  return '/api/v1/claims/dashboard'
}

function resolvePendingChangeTasksEndpoint() {
  const baseUrl = (apiPublic.defaults.baseURL ?? '').toLowerCase()
  if (baseUrl.includes('/api/v1')) return '/claims/pending-change-tasks'
  return '/api/v1/claims/pending-change-tasks'
}

function resolveReassignApproveEndpoint(claimId: string, conversationId: string, newStaffId: string) {
  const c = encodeURIComponent(claimId)
  const conv = encodeURIComponent(conversationId)
  const staff = encodeURIComponent(newStaffId)
  const baseUrl = (apiPublic.defaults.baseURL ?? '').toLowerCase()
  if (baseUrl.includes('/api/v1')) return `/claims/${c}/reassign/${conv}/${staff}/approve`
  return `/api/v1/claims/${c}/reassign/${conv}/${staff}/approve`
}

function resolveChangeTaskRejectEndpoint(claimId: string, managerId: string) {
  const id = encodeURIComponent(claimId)
  const mgr = encodeURIComponent(managerId)
  const baseUrl = (apiPublic.defaults.baseURL ?? '').toLowerCase()
  if (baseUrl.includes('/api/v1')) return `/claims/${id}/reject/${mgr}`
  return `/api/v1/claims/${id}/reject/${mgr}`
}

function extractApiErrorMessage(err: unknown, fallback: string) {
  const e = err && typeof err === 'object' ? (err as Record<string, unknown>) : {}
  const response = e.response && typeof e.response === 'object' ? (e.response as Record<string, unknown>) : {}
  const data = response.data && typeof response.data === 'object' ? (response.data as Record<string, unknown>) : {}
  const innerData = data.data && typeof data.data === 'object' ? (data.data as Record<string, unknown>) : {}

  const reason = String(data.reason ?? '').trim()
  if (reason) return reason
  const exceptionMessage = String(innerData.exceptionMessage ?? '').trim()
  if (exceptionMessage) return exceptionMessage
  const message = String(data.message ?? '').trim()
  if (message) return message
  return fallback
}

export const ClaimApi = {
  getPendingClaims: async (page = 1, pageSize = 9): Promise<ManagerClaimListResponse> => {
    const response = await apiPublic.get<ApiResponseStructure<ManagerClaimListResponse>>(resolveClaimsEndpoint('pending'), {
      params: { pageIndex: page, pageNumber: page, pageSize, page_size: pageSize }
    })
    return (response as unknown as ApiResponseStructure<ManagerClaimListResponse>).data
  },
  getHistoryClaims: async (page = 1, pageSize = 9): Promise<ManagerClaimListResponse> => {
    const response = await apiPublic.get<ApiResponseStructure<ManagerClaimListResponse>>(resolveClaimsEndpoint('history'), {
      params: { pageIndex: page, pageNumber: page, pageSize, page_size: pageSize }
    })
    return (response as unknown as ApiResponseStructure<ManagerClaimListResponse>).data
  },
  getPendingChangeTaskClaims: async (page = 1, pageSize = 10): Promise<ManagerChangeTaskClaimListResponse> => {
    const response = await apiPublic.get<ApiResponseStructure<ManagerChangeTaskClaimListResponse>>(resolvePendingChangeTasksEndpoint(), {
      params: { pageIndex: page, pageNumber: page, pageSize, page_size: pageSize }
    })
    const payload = response as unknown as
      | ApiResponseStructure<ManagerChangeTaskClaimListResponse>
      | ManagerChangeTaskClaimListResponse
      | { data?: ManagerChangeTaskClaimListResponse }
    if ('items' in (payload as ManagerChangeTaskClaimListResponse)) {
      return payload as ManagerChangeTaskClaimListResponse
    }
    if ((payload as { data?: ManagerChangeTaskClaimListResponse }).data?.items) {
      return (payload as { data: ManagerChangeTaskClaimListResponse }).data
    }
    return { items: [], meta: { total_pages: 1, total_items: 0, current_page: page, page_size: pageSize } }
  },
  approveClaim: async (id: string): Promise<void> => {
    await apiPublic.patch(resolveClaimActionEndpoint(id, 'approve'))
  },
  rejectClaim: async (id: string): Promise<void> => {
    await apiPublic.patch(resolveClaimActionEndpoint(id, 'reject'))
  },
  approveReassignClaim: async (
    claimId: string,
    conversationId: string,
    newStaffId: string
  ): Promise<string> => {
    if (!claimId) throw new Error('Thiếu claimId để duyệt chuyển giao.')
    if (!conversationId) throw new Error('Thiếu conversationId để duyệt chuyển giao.')
    if (!newStaffId) throw new Error('Thiếu newStaffId để duyệt chuyển giao.')
    const endpoint = resolveReassignApproveEndpoint(claimId, conversationId, newStaffId)
    try {
      const response = await apiPublic.put<ApiResponseStructure<unknown>>(endpoint)
      const body = response as unknown as ApiResponseStructure<unknown>
      if (body.is_success === false) {
        throw new Error(body.reason || body.message || 'Không thể duyệt chuyển giao.')
      }
      return body.message || 'Duyệt chuyển giao thành công.'
    } catch (error) {
      throw new Error(extractApiErrorMessage(error, 'Không thể duyệt chuyển giao.'))
    }
  },
  rejectChangeTaskClaim: async (claimId: string, managerId: string): Promise<string> => {
    if (!claimId) throw new Error('Thiếu claimId để từ chối yêu cầu.')
    if (!managerId) throw new Error('Thiếu managerId để từ chối yêu cầu.')
    const endpoint = resolveChangeTaskRejectEndpoint(claimId, managerId)
    try {
      const response = await apiPublic.put<ApiResponseStructure<unknown>>(endpoint)
      const body = response as unknown as ApiResponseStructure<unknown>
      if (body.is_success === false) {
        throw new Error(body.reason || body.message || 'Không thể từ chối yêu cầu.')
      }
      return body.message || 'Đã từ chối yêu cầu chuyển giao.'
    } catch (error) {
      throw new Error(extractApiErrorMessage(error, 'Không thể từ chối yêu cầu.'))
    }
  },
  getDashboard: async (): Promise<ManagerClaimDashboardData> => {
    const response = await apiPublic.get<ApiResponseStructure<unknown>>(resolveClaimDashboardEndpoint())
    const payload = (response as unknown as ApiResponseStructure<unknown>).data as Record<string, unknown> | unknown[] | undefined

    if (Array.isArray(payload)) {
      const result: ManagerClaimDashboardData = { total: 0, pending: 0, approved: 0, rejected: 0 }
      payload.forEach((item) => {
        const row = item && typeof item === 'object' ? (item as Record<string, unknown>) : {}
        const status = String(row.status ?? '').toLowerCase()
        const count = Number(row.count ?? 0)
        if (status.includes('pending')) result.pending += count
        else if (status.includes('approve')) result.approved += count
        else if (status.includes('reject')) result.rejected += count
      })
      result.total = result.pending + result.approved + result.rejected
      return result
    }

    const obj = payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : {}
    const pending = Number(obj.pendingClaims ?? obj.pending ?? obj.pendingCount ?? obj.totalPending ?? 0)
    const approved = Number(obj.approvedClaims ?? obj.approved ?? obj.approvedCount ?? obj.totalApproved ?? 0)
    const rejected = Number(obj.rejectedClaims ?? obj.rejected ?? obj.rejectedCount ?? obj.totalRejected ?? 0)
    const total = Number(obj.total ?? obj.totalClaims ?? pending + approved + rejected)
    return { total, pending, approved, rejected }
  }
}
