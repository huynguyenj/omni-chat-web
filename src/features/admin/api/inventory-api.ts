import { apiPublic } from '@/config/axios'
import type { ApiResponseStructure } from '@/types/api-response'
import type { InventoryDashboardData } from '../types/inventory-type'

/** Swagger: GET /dashboard (host root), e.g. https://omnichat.click/dashboard — not under /api/v1. */
function resolveInventoryDashboardUrl(): string {
  const raw = apiPublic.defaults.baseURL?.trim() ?? ''
  if (/^https?:\/\//i.test(raw)) {
    try {
      return `${new URL(raw).origin}/dashboard`
    } catch {
      /* ignore */
    }
  }
  return '/dashboard'
}

export const InventoryApi = {
  getDashboard: async (): Promise<ApiResponseStructure<InventoryDashboardData>> => {
    const response = await apiPublic.get<ApiResponseStructure<InventoryDashboardData>>(resolveInventoryDashboardUrl())
    return response.data
  }
}
