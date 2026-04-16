import { apiPublic } from '@/config/axios'
import type { ApiResponseStructure } from '@/types/api-response'
import type { ManagerClaimDashboardData, ManagerClaimListResponse } from '../types/claim-type'

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
  approveClaim: async (id: string): Promise<void> => {
    await apiPublic.patch(resolveClaimActionEndpoint(id, 'approve'))
  },
  rejectClaim: async (id: string): Promise<void> => {
    await apiPublic.patch(resolveClaimActionEndpoint(id, 'reject'))
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
