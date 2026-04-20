import { apiPublic } from '@/config/axios'
import type { ApiResponseStructure } from '@/types/api-response'
import type { PostSaleRequestListQuery, PostSaleRequestListResponse } from '../types/post-sale-request-type'

function resolvePostSaleRequestsEndpoint() {
  const baseUrl = (apiPublic.defaults.baseURL ?? '').toLowerCase()
  if (baseUrl.includes('/api/v1')) return '/post-sale-requests/get'
  return '/api/v1/post-sale-requests/get'
}

function resolvePostSaleActionEndpoint(id: string, action: 'approve' | 'reject') {
  const baseUrl = (apiPublic.defaults.baseURL ?? '').toLowerCase()
  if (baseUrl.includes('/api/v1')) return `/post-sale-requests/${id}/${action}`
  return `/api/v1/post-sale-requests/${id}/${action}`
}

export const PostSaleRequestApi = {
  /** GET /api/v1/post-sale-requests/get */
  getPostSaleRequests: async (
    query: PostSaleRequestListQuery = {}
  ): Promise<ApiResponseStructure<PostSaleRequestListResponse>> => {
    const { pageNumber = 1, pageSize = 20, sortBy = 'requestedTime', descending } = query

    const params: Record<string, unknown> = {
      pageNumber,
      pageSize,
      sortBy
    }
    if (typeof descending === 'boolean') {
      params.descending = descending
    }

    const response = await apiPublic.get<ApiResponseStructure<PostSaleRequestListResponse>>(
      resolvePostSaleRequestsEndpoint(),
      { params }
    )
    return response as unknown as ApiResponseStructure<PostSaleRequestListResponse>
  },

  /** PATCH /api/v1/post-sale-requests/{id}/approve */
  approvePostSaleRequest: async (id: string): Promise<string> => {
    const body = (await apiPublic.patch(resolvePostSaleActionEndpoint(id, 'approve'))) as unknown as ApiResponseStructure<unknown>
    if (body.is_success === false) {
      throw new Error(body.message || 'Không thể duyệt yêu cầu.')
    }
    return body.message?.trim() ? body.message : 'Đã duyệt yêu cầu.'
  },

  /** PATCH /api/v1/post-sale-requests/{id}/reject */
  rejectPostSaleRequest: async (id: string): Promise<string> => {
    const body = (await apiPublic.patch(resolvePostSaleActionEndpoint(id, 'reject'))) as unknown as ApiResponseStructure<unknown>
    if (body.is_success === false) {
      throw new Error(body.message || 'Không thể từ chối yêu cầu.')
    }
    return body.message?.trim() ? body.message : 'Đã từ chối yêu cầu.'
  }
}
