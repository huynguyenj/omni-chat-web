import { apiPublic } from '@/config/axios'
import type { ApiResponseStructure } from '@/types/api-response'
import type { ManagerOrderDetail, ManagerOrderListQuery, ManagerOrderListResponse } from '../types/order-type'

function resolveOrderByIdEndpoint(id: string) {
  const baseUrl = (apiPublic.defaults.baseURL ?? '').toLowerCase()
  if (baseUrl.includes('/api/v1')) return `/orders/get/${id}`
  return `/api/v1/orders/get/${id}`
}

export const ManagerOrderApi = {
  getOrders: async (query: ManagerOrderListQuery = {}): Promise<ApiResponseStructure<ManagerOrderListResponse>> => {
    const {
      pageNumber = 1,
      pageSize = 6,
      orderStatuses,
      search,
      sortBy = 'orderdate',
      descending = true
    } = query

    const baseUrl = (apiPublic.defaults.baseURL ?? '').toLowerCase()
    const endpoint = baseUrl.includes('/api/v1') ? '/orders/get' : '/api/v1/orders/get'

    const params: Record<string, unknown> = {
      pageNumber,
      pageSize,
      sortBy,
      descending
    }
    if (typeof search === 'string' && search.trim() !== '') {
      params.search = search.trim()
    }
    if (orderStatuses && orderStatuses.length > 0) {
      params.orderStatuses = orderStatuses
    }

    const response = await apiPublic.get<ApiResponseStructure<ManagerOrderListResponse>>(endpoint, {
      params,
      paramsSerializer: (inputParams) => {
        const query = new URLSearchParams()
        Object.entries(inputParams).forEach(([key, value]) => {
          if (value == null) return
          if (Array.isArray(value)) {
            value.forEach((entry) => query.append(key, String(entry)))
            return
          }
          query.append(key, String(value))
        })
        return query.toString()
      }
    })
    return response as unknown as ApiResponseStructure<ManagerOrderListResponse>
  },

  /** GET /api/v1/orders/get/{id} — chi tiết đơn (interceptor axios trả body JSON). */
  getOrderById: async (id: string): Promise<ManagerOrderDetail> => {
    const response = await apiPublic.get<ApiResponseStructure<ManagerOrderDetail>>(resolveOrderByIdEndpoint(id))
    const body = response as unknown as ApiResponseStructure<ManagerOrderDetail>
    if (body.is_success === false || body.data == null) {
      throw new Error(body.message || 'Không tải được chi tiết đơn hàng')
    }
    return body.data
  }
}
