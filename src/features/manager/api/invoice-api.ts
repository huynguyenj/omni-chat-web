import { apiPublic } from '@/config/axios'
import type { ApiResponseStructure } from '@/types/api-response'
import type { ManagerInvoiceListQuery, ManagerInvoiceListResponse } from '../types/invoice-type'

function resolveInvoicesEndpoint() {
  const baseUrl = (apiPublic.defaults.baseURL ?? '').toLowerCase()
  if (baseUrl.includes('/api/v1')) return '/invoices/get'
  return '/api/v1/invoices/get'
}

export const ManagerInvoiceApi = {
  getInvoices: async (query: ManagerInvoiceListQuery = {}): Promise<ApiResponseStructure<ManagerInvoiceListResponse>> => {
    const {
      invoiceId,
      status,
      pageNumber = 1,
      pageSize = 10,
      sortBy = 'startedDate',
      descending = true
    } = query
    const endpoint = resolveInvoicesEndpoint()
    const params: Record<string, unknown> = {
      pageNumber,
      pageSize,
      sortBy,
      descending
    }
    if (invoiceId && invoiceId.trim()) params.invoiceId = invoiceId.trim()
    if (status && status.trim()) params.status = status.trim()

    const response = await apiPublic.get<ApiResponseStructure<ManagerInvoiceListResponse>>(endpoint, { params })
    return response as unknown as ApiResponseStructure<ManagerInvoiceListResponse>
  }
}
