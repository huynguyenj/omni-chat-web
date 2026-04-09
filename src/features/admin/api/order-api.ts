import { apiPublic } from '@/config/axios'
import type { ApiResponseStructure } from '@/types/api-response'
import type { OrderListResponse } from '../types/order-type'

export const OrderApi = {
  getOrders: async (page = 1, pageSize = 20): Promise<ApiResponseStructure<OrderListResponse>> => {
    const response = await apiPublic.get<ApiResponseStructure<OrderListResponse>>(`/orders/get?page=${page}&pageSize=${pageSize}`)
    return response.data
  }
}

