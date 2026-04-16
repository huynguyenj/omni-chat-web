import { apiPublic } from '@/config/axios'
import type { ApiResponseStructure } from '@/types/api-response'
import type { InventoryDashboardData } from '../types/inventory-type'
import type { ManagerProductListResponse } from '../types/product-type'

function resolveInventoryDashboardUrl(): string {
  const raw = apiPublic.defaults.baseURL?.trim() ?? ''
  if (/^https?:\/\//i.test(raw)) {
    try {
      return `${new URL(raw).origin}/dashboard`
    } catch {
      // Ignore invalid URL and fallback.
    }
  }
  return '/dashboard'
}

export const ManagerInventoryApi = {
  getDashboard: async (): Promise<InventoryDashboardData> => {
    const response = await apiPublic.get<ApiResponseStructure<InventoryDashboardData>>(resolveInventoryDashboardUrl())
    return (response as unknown as ApiResponseStructure<InventoryDashboardData>).data
  },
  getProducts: async (page = 1, pageSize = 6): Promise<ManagerProductListResponse> => {
    const baseUrl = (apiPublic.defaults.baseURL ?? '').toLowerCase()
    const endpoint = baseUrl.includes('/api/v1') ? '/products/get' : '/api/v1/products/get'
    const response = await apiPublic.get<ApiResponseStructure<ManagerProductListResponse>>(endpoint, {
      params: {
        pageNumber: page,
        pageSize
      }
    })
    return (response as unknown as ApiResponseStructure<ManagerProductListResponse>).data
  }
}
