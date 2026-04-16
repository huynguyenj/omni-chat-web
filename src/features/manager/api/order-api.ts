import { apiPublic } from '@/config/axios'
import type { ApiResponseStructure } from '@/types/api-response'
import type { ManagerOrderListResponse } from '../types/order-type'

export const ManagerOrderApi = {
  getOrders: async (page = 1, pageSize = 6): Promise<ApiResponseStructure<ManagerOrderListResponse>> => {
    const baseUrl = (apiPublic.defaults.baseURL ?? '').toLowerCase()
    const endpoint = baseUrl.includes('/api/v1') ? '/orders/get' : '/api/v1/orders/get'
    const response = await apiPublic.get<ApiResponseStructure<ManagerOrderListResponse>>(endpoint, {
      params: {
        pageNumber: page,
        pageSize
      }
    })
    return response as unknown as ApiResponseStructure<ManagerOrderListResponse>
  }
}
