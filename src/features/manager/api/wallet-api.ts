import { apiPublic } from '@/config/axios'
import type { ApiResponseStructure } from '@/types/api-response'
import type { ManagerCustomerWalletPagingResponse, ManagerCustomerWalletQuery } from '../types/wallet-type'

function resolveCustomerProfilePagingEndpoint() {
  const baseUrl = (apiPublic.defaults.baseURL ?? '').toLowerCase()
  if (baseUrl.includes('/api/v1')) return '/customer-profile/paging'
  return '/api/v1/customer-profile/paging'
}

export const ManagerWalletApi = {
  getCustomerWalletPaging: async (query: ManagerCustomerWalletQuery = {}): Promise<ApiResponseStructure<ManagerCustomerWalletPagingResponse>> => {
    const {
      customerName,
      pageNumber = 1,
      pageSize = 20
    } = query

    const endpoint = resolveCustomerProfilePagingEndpoint()
    const params: Record<string, unknown> = { pageNumber, pageSize }
    if (customerName && customerName.trim()) params.customerName = customerName.trim()

    const response = await apiPublic.get<ApiResponseStructure<ManagerCustomerWalletPagingResponse>>(endpoint, { params })
    return response as unknown as ApiResponseStructure<ManagerCustomerWalletPagingResponse>
  }
}
