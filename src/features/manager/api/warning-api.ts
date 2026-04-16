import { apiPublic } from '@/config/axios'
import type { ApiResponseStructure } from '@/types/api-response'
import type { ManagerWarningListResponse } from '../types/warning-type'

function resolveWarningsEndpoint() {
  const baseUrl = (apiPublic.defaults.baseURL ?? '').toLowerCase()
  if (baseUrl.includes('/api/v1')) return '/conversation-warnings/get'
  return '/api/v1/conversation-warnings/get'
}

export const WarningApi = {
  getWarnings: async (page = 1, pageSize = 9, isReviewed?: boolean): Promise<ManagerWarningListResponse> => {
    const params: { pageNumber: number; pageSize: number; isReviewed?: boolean } = {
      pageNumber: page,
      pageSize
    }
    if (typeof isReviewed === 'boolean') params.isReviewed = isReviewed

    const response = await apiPublic.get<ApiResponseStructure<ManagerWarningListResponse>>(resolveWarningsEndpoint(), { params })
    return (response as unknown as ApiResponseStructure<ManagerWarningListResponse>).data
  }
}
