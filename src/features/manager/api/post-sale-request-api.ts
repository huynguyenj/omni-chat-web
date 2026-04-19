import { apiPublic } from '@/config/axios'
import type { ApiResponseStructure } from '@/types/api-response'
import type { PostSaleRequestListQuery, PostSaleRequestListResponse } from '../types/post-sale-request-type'

function resolvePostSaleRequestsEndpoint() {
  const baseUrl = (apiPublic.defaults.baseURL ?? '').toLowerCase()
  if (baseUrl.includes('/api/v1')) return '/post-sale-requests/get'
  return '/api/v1/post-sale-requests/get'
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
  }
}
