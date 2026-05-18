import { apiPrivate, apiPublic } from '@/config/axios'
import type { ApiResponseStructure } from '@/types/api-response'
import type { ManagerInvoiceListQuery, ManagerInvoiceListResponse } from '../types/invoice-type'

function resolveInvoicesEndpoint() {
  const baseUrl = (apiPublic.defaults.baseURL ?? '').toLowerCase()
  if (baseUrl.includes('/api/v1')) return '/invoices/get'
  return '/api/v1/invoices/get'
}

/** GET /api/v1/invoices/{id}/export — trả file Excel (.xlsx), dùng Bearer qua apiPrivate */
function resolveInvoiceExportEndpoint(invoiceId: string) {
  const baseUrl = (apiPrivate.defaults.baseURL ?? '').toLowerCase()
  const id = encodeURIComponent(invoiceId)
  if (baseUrl.includes('/api/v1')) return `/invoices/${id}/export`
  return `/api/v1/invoices/${id}/export`
}

function resolveInvoiceRunEndpoint() {
  const baseUrl = (apiPrivate.defaults.baseURL ?? '').toLowerCase()
  if (baseUrl.includes('/api/v1')) return '/invoices/run'
  return '/api/v1/invoices/run'
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
  },

  exportInvoice: async (invoiceId: string): Promise<Blob> => {
    // Interceptor returns response.data; typings still describe AxiosResponse — narrow via unknown.
    const data = await apiPrivate.get(resolveInvoiceExportEndpoint(invoiceId), {
      responseType: 'blob'
    })
    return data as unknown as Blob
  },

  /** POST /api/v1/invoices/run — chạy giả lập/tổng hợp hóa đơn theo khoảng thời gian. */
  runInvoices: async (query?: { from?: string; to?: string }): Promise<string> => {
    const params: Record<string, string> = {}
    if (query?.from?.trim()) params.from = query.from.trim()
    if (query?.to?.trim()) params.to = query.to.trim()

    const body = (await apiPrivate.post(resolveInvoiceRunEndpoint(), null, {
      params: Object.keys(params).length > 0 ? params : undefined
    })) as unknown as ApiResponseStructure<unknown>

    if (body.is_success === false) {
      throw new Error(body.message || 'Không thể chạy giả lập hóa đơn.')
    }
    return body.message?.trim() ? body.message : 'Đã chạy giả lập hóa đơn thành công.'
  }
}
