import { apiPrivate } from '@/config/axios'
import type { ApiResponseStructure } from '@/types/api-response'
import { ManagerOrderApi } from './order-api'
import type { PostSaleRequestItem, PostSaleRequestListQuery, PostSaleRequestListResponse } from '../types/post-sale-request-type'

const orderCodeByIdCache = new Map<string, string>()

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

function flattenPostSaleRow(raw: unknown): Record<string, unknown> {
  const row = raw && typeof raw === 'object' && !Array.isArray(raw) ? { ...(raw as Record<string, unknown>) } : {}
  const nestedKeys = ['order', 'Order', 'orderInfo', 'OrderInfo', 'order_info', 'orderDetail', 'OrderDetail']
  let nested: Record<string, unknown> = {}
  for (const key of nestedKeys) {
    const inner = row[key]
    if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
      nested = { ...nested, ...(inner as Record<string, unknown>) }
    }
  }
  return { ...nested, ...row }
}

function toPostSaleRequestItem(raw: unknown): PostSaleRequestItem {
  const row = flattenPostSaleRow(raw)
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
    orderCode: readString(row, [
      'orderCode',
      'order_code',
      'OrderCode',
      'code',
      'Code',
      'orderNumber',
      'order_number'
    ]),
    postSaleItems
  }
}

async function enrichPostSaleRequestsWithOrderCodes(items: PostSaleRequestItem[]): Promise<PostSaleRequestItem[]> {
  const needsFetch = items.filter((item) => item.orderId && !item.orderCode?.trim())
  if (needsFetch.length === 0) return items

  await Promise.all(
    needsFetch.map(async (item) => {
      const cached = orderCodeByIdCache.get(item.orderId)
      if (cached) return
      try {
        const order = await ManagerOrderApi.getOrderById(item.orderId)
        const code = String(order.code ?? '').trim()
        if (code) orderCodeByIdCache.set(item.orderId, code)
      } catch {
        /* ignore — card will show fallback */
      }
    })
  )

  return items.map((item) => {
    if (item.orderCode?.trim()) return item
    const code = orderCodeByIdCache.get(item.orderId)
    return code ? { ...item, orderCode: code } : item
  })
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
    const normalizedItems = await enrichPostSaleRequestsWithOrderCodes(
      rawItems.map((item) => toPostSaleRequestItem(item))
    )
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
