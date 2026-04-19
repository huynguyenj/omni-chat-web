import { apiPublic } from '@/config/axios'
import type { ApiResponseStructure } from '@/types/api-response'
import type { ManagerShipperListQuery, ManagerShipperListResponse } from '../types/shipper-type'

function resolveShippersEndpoint() {
  const baseUrl = (apiPublic.defaults.baseURL ?? '').toLowerCase()
  if (baseUrl.includes('/api/v1')) return '/shippers'
  return '/api/v1/shippers'
}

function resolveAssignOrderEndpoint(shipperId: string) {
  const baseUrl = (apiPublic.defaults.baseURL ?? '').toLowerCase()
  if (baseUrl.includes('/api/v1')) return `/shippers/${shipperId}/assign-order`
  return `/api/v1/shippers/${shipperId}/assign-order`
}

export const ManagerShipperApi = {
  getShippers: async (query: ManagerShipperListQuery = {}): Promise<ApiResponseStructure<ManagerShipperListResponse>> => {
    const pageIndex = query.pageIndex ?? 1
    const pageSize = query.pageSize ?? 10
    const endpoint = resolveShippersEndpoint()
    const response = await apiPublic.get<ApiResponseStructure<ManagerShipperListResponse>>(endpoint, {
      params: { pageIndex, pageSize }
    })
    const body = response as unknown as ApiResponseStructure<ManagerShipperListResponse>
    if (body.is_success === false || body.data == null) {
      throw new Error(body.message || 'Lấy danh sách shipper thất bại')
    }
    return body
  },

  assignOrderToShipper: async (shipperId: string, orderId: string): Promise<ApiResponseStructure<null>> => {
    const endpoint = resolveAssignOrderEndpoint(shipperId)
    const response = await apiPublic.post<ApiResponseStructure<null>>(endpoint, null, {
      params: { orderId }
    })
    const body = response as unknown as ApiResponseStructure<null>
    if (body.is_success === false) {
      throw new Error(body.message || 'Giao đơn cho shipper thất bại')
    }
    return body
  }
}
