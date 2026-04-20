import { apiPrivate } from '@/config/axios'
import type { ApiResponseStructure } from '@/types/api-response'
import type { PostSaleRequestItem, PostSaleRequestListQuery, PostSaleRequestListResponse } from '../types/post-sale-request-type'

function resolvePostSaleRequestsEndpoint() {
  const baseUrl = (apiPrivate.defaults.baseURL ?? '').toLowerCase()
  if (baseUrl.includes('/api/v1')) return '/post-sale-requests/get'
  return '/api/v1/post-sale-requests/get'
}

function resolvePostSaleActionEndpoint(id: string, action: 'approve' | 'reject') {
  const baseUrl = (apiPrivate.defaults.baseURL ?? '').toLowerCase()
  if (baseUrl.includes('/api/v1')) return `/post-sale-requests/${id}/${action}`
  return `/api/v1/post-sale-requests/${id}/${action}`
}

function readString(source: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = source[key]
    if (value == null) continue
    const normalized = String(value).trim()
    if (normalized) return normalized
  }
  return ''
}

function toPostSaleRequestItem(raw: unknown): PostSaleRequestItem {
  const row = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  const postSaleItemsRaw = Array.isArray(row.postSaleItems) ? row.postSaleItems : []
  const postSaleItems = postSaleItemsRaw
    .map((item) => {
      const entry = item && typeof item === 'object' ? (item as Record<string, unknown>) : {}
      return {
        productName: readString(entry, ['productName', 'product_name']) || 'Sản phẩm',
        quantity: Number(entry.quantity ?? 0)
      }
    })
    .filter((entry) => entry.quantity > 0)

  return {
    id: readString(row, ['id', 'postSaleRequestId', 'post_sale_request_id', 'requestId']),
    customerName: readString(row, ['customerName', 'customer_name']),
    presentByStaffName: readString(row, ['presentByStaffName', 'present_by_staff_name', 'staffName']),
    type: readString(row, ['type']) || 'Refund',
    status: readString(row, ['status']) || 'Pending',
    reason: readString(row, ['reason']),
    refundAmount: row.refundAmount == null ? null : Number(row.refundAmount),
    requestedTime: readString(row, ['requestedTime', 'requested_time', 'createdAt', 'created_at']),
    orderId: readString(row, ['orderId', 'order_id']),
    postSaleItems
  }
}

export const PostSaleRequestApi = {
  /** GET /api/v1/post-sale-requests/get */
  getPostSaleRequests: async (
    query: PostSaleRequestListQuery = {}
  ): Promise<ApiResponseStructure<PostSaleRequestListResponse>> => {
    const { pageNumber = 1, pageSize = 20, sortBy = 'requestedTime', descending } = query

    const params: Record<string, unknown> = {
      pageNumber,
      pageSize,
      sortBy
    }
    if (typeof descending === 'boolean') {
      params.descending = descending
    }

    const response = await apiPrivate.get<ApiResponseStructure<PostSaleRequestListResponse>>(
      resolvePostSaleRequestsEndpoint(),
      { params }
    )
    const body = response as unknown as ApiResponseStructure<PostSaleRequestListResponse>
    const rawItems = Array.isArray(body?.data?.items) ? body.data.items : []
    const normalizedItems = rawItems.map((item) => toPostSaleRequestItem(item))
    let normalizedData = body.data
    if (body.data) {
      normalizedData = {
        ...body.data,
        items: normalizedItems
      }
    }

    return {
      ...body,
      data: normalizedData
    } as ApiResponseStructure<PostSaleRequestListResponse>
  },

  /** POST /api/v1/post-sale-requests/{id}/approve */
  approvePostSaleRequest: async (id: string): Promise<string> => {
    const normalizedId = String(id ?? '').trim()
    if (!normalizedId) {
      throw new Error('Thiếu mã yêu cầu hoàn tiền (PSR id).')
    }
    const body = (await apiPrivate.post(resolvePostSaleActionEndpoint(normalizedId, 'approve'))) as unknown as ApiResponseStructure<unknown>
    if (body.is_success === false) {
      throw new Error(body.message || 'Không thể duyệt yêu cầu.')
    }
    return body.message?.trim() ? body.message : 'Đã duyệt yêu cầu.'
  },

  /** POST /api/v1/post-sale-requests/{id}/reject */
  rejectPostSaleRequest: async (id: string): Promise<string> => {
    const normalizedId = String(id ?? '').trim()
    if (!normalizedId) {
      throw new Error('Thiếu mã yêu cầu hoàn tiền (PSR id).')
    }
    const body = (await apiPrivate.post(resolvePostSaleActionEndpoint(normalizedId, 'reject'))) as unknown as ApiResponseStructure<unknown>
    if (body.is_success === false) {
      throw new Error(body.message || 'Không thể từ chối yêu cầu.')
    }
    return body.message?.trim() ? body.message : 'Đã từ chối yêu cầu.'
  }
}
