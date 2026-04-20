import { apiPublic } from '@/config/axios'
import type { ApiResponseStructure } from '@/types/api-response'
import type { ManagerWarningDetailResponse, ManagerWarningListResponse } from '../types/warning-type'

function resolveWarningsEndpoint() {
  const baseUrl = (apiPublic.defaults.baseURL ?? '').toLowerCase()
  if (baseUrl.includes('/api/v1')) return '/conversation-warnings/get'
  return '/api/v1/conversation-warnings/get'
}

function resolveWarningDetailEndpoint(id: string) {
  const baseUrl = (apiPublic.defaults.baseURL ?? '').toLowerCase()
  if (baseUrl.includes('/api/v1')) return `/conversation-warnings/${id}/warning`
  return `/api/v1/conversation-warnings/${id}/warning`
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
  },
  getWarningDetail: async (id: string): Promise<ManagerWarningDetailResponse> => {
    const endpoint = resolveWarningDetailEndpoint(id)
    const response = await apiPublic.get<ApiResponseStructure<ManagerWarningDetailResponse>>(endpoint)
    return (response as unknown as ApiResponseStructure<ManagerWarningDetailResponse>).data
  }
}
