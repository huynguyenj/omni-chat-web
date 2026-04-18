import type { PaginationStructure } from '@/types/api-response'

export type PostSaleRequestType = 'Refund' | 'Cancel' | 'Replacement' | 'Return'

export type PostSaleRequestStatus = 'Pending' | 'Approved' | 'Rejected' | string

export interface PostSaleItemRow {
  productName: string
  quantity: number
}

export interface PostSaleRequestItem {
  id: string
  customerName: string
  presentByStaffName: string
  type: PostSaleRequestType | string
  status: PostSaleRequestStatus
  reason: string
  refundAmount: number | null
  requestedTime: string
  orderId: string
  postSaleItems: PostSaleItemRow[]
}

export type PostSaleRequestListResponse = PaginationStructure<PostSaleRequestItem>

export interface PostSaleRequestListQuery {
  pageNumber?: number
  pageSize?: number
  sortBy?: string
  descending?: boolean
}
