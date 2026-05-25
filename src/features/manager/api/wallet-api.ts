import { apiPrivate, apiPublic } from '@/config/axios'
import type { ApiResponseStructure } from '@/types/api-response'
import type {
  ManagerCustomerWalletPagingResponse,
  ManagerCustomerWalletQuery,
  ManagerWalletInfo,
  ManagerWalletPaymentPayload
} from '../types/wallet-type'

function resolveCustomerProfilePagingEndpoint() {
  const baseUrl = (apiPublic.defaults.baseURL ?? '').toLowerCase()
  if (baseUrl.includes('/api/v1')) return '/customer-profile/paging'
  return '/api/v1/customer-profile/paging'
}

function resolveWalletByCustomerIdEndpoint(customerId: string) {
  const id = encodeURIComponent(customerId)
  const baseUrl = (apiPublic.defaults.baseURL ?? '').toLowerCase()
  if (baseUrl.includes('/api/v1')) return `/wallets/${id}`
  return `/api/v1/wallets/${id}`
}

function resolveWalletPaymentEndpoint() {
  const baseUrl = (apiPrivate.defaults.baseURL ?? '').toLowerCase()
  if (baseUrl.includes('/api/v1')) return '/wallets/payment'
  return '/api/v1/wallets/payment'
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
  },

  getWalletByCustomerId: async (customerId: string): Promise<ApiResponseStructure<ManagerWalletInfo>> => {
    const endpoint = resolveWalletByCustomerIdEndpoint(customerId)
    const response = await apiPublic.get<ApiResponseStructure<ManagerWalletInfo>>(endpoint)
    return response as unknown as ApiResponseStructure<ManagerWalletInfo>
  },

  payCash: async (payload: ManagerWalletPaymentPayload): Promise<ApiResponseStructure<unknown>> => {
    const endpoint = resolveWalletPaymentEndpoint()
    const response = await apiPrivate.post<ApiResponseStructure<unknown>>(endpoint, {
      customerId: payload.customerId,
      amount: payload.amount
    })
    return response as unknown as ApiResponseStructure<unknown>
  }
}
