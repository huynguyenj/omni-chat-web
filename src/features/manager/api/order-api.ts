import { apiPublic } from '@/config/axios'
import type { ApiResponseStructure } from '@/types/api-response'
import type { ManagerOrderDetail, ManagerOrderListQuery, ManagerOrderListResponse } from '../types/order-type'

function resolveOrderByIdEndpoint(id: string) {
  const baseUrl = (apiPublic.defaults.baseURL ?? '').toLowerCase()
  if (baseUrl.includes('/api/v1')) return `/orders/get/${id}`
  return `/api/v1/orders/get/${id}`
}

function resolveOrderActionEndpoint(id: string, action: 'cancel') {
  const baseUrl = (apiPublic.defaults.baseURL ?? '').toLowerCase()
  if (baseUrl.includes('/api/v1')) return `/orders/${id}/${action}`
  return `/api/v1/orders/${id}/${action}`
}

function resolveSubmitDraftEndpoint(id: string) {
  const baseUrl = (apiPublic.defaults.baseURL ?? '').toLowerCase()
  if (baseUrl.includes('/api/v1')) return `/orders/${id}/submit-draft`
  return `/api/v1/orders/${id}/submit-draft`
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
  },

  /** PATCH /api/v1/orders/{id}/cancel — hủy đơn (delivery pending), hoàn kho */
  cancelOrder: async (id: string): Promise<string> => {
    const body = (await apiPublic.patch(resolveOrderActionEndpoint(id, 'cancel'))) as unknown as ApiResponseStructure<unknown>
    if (body.is_success === false) {
      throw new Error(body.message || 'Không thể hủy đơn hàng.')
    }
    return body.message?.trim() ? body.message : 'Đã hủy đơn hàng thành công.'
  },

  /** POST /api/v1/orders/{id}/submit-draft — Draft → Pending */
  submitDraftOrder: async (id: string): Promise<string> => {
    const body = (await apiPublic.post(resolveSubmitDraftEndpoint(id))) as unknown as ApiResponseStructure<unknown>
    if (body.is_success === false) {
      throw new Error(body.message || 'Không thể gửi duyệt đơn nháp.')
    }
    return body.message?.trim() ? body.message : 'Đã gửi đơn nháp (chờ xử lý).'
  }
}
