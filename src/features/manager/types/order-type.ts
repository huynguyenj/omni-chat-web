/**
 * Trạng thái đơn hàng (enum BE).
 * Draft | Pending | Cancelled | Shipped | PendingReturned | Returned | Completed |
 * ReturnDefective | ReturnRejected | RefundRejected | RefundApproved | ReturnApproved
 *
 * Cấu trúc đơn (GET /api/v1/orders/get, GET /api/v1/orders/get/{id}):
 * ```json
 * {
 *   "id": "uuid",
 *   "customerId": "uuid",
 *   "customerName": "string | null",
 *   "customerPhoneNumber": "string | null",
 *   "customerEmail": "string | null",
 *   "customerAddress": "string | null",
 *   "orderDate": "ISO datetime",
 *   "name": "string",
 *   "status": "Pending | Completed | ...",
 *   "totalAmount": 0,
 *   "deliveryStatus": 0,
 *   "code": "ORD-...",
 *   "orderItems": [
 *     { "id": "uuid", "productName": "string", "quantity": 1, "itemsPrice": 0, "unitPrice": 0 }
 *   ]
 * }
 * ```
 */
/** Giá trị query `orderStatuses` cho GET /orders/get (Swagger). */
export type ManagerOrderStatusFilter =
  | 'Draft'
  | 'Pending'
  | 'Cancelled'
  | 'Shipped'
  | 'PendingReturned'
  | 'Returned'
  | 'Completed'
  | 'ReturnDefective'
  | 'ReturnRejected'
  | 'RefundRejected'
  | 'RefundApproved'
  | 'ReturnApproved'

/** Trạng thái đơn hàng từ API (chuỗi trùng với filter khi backend trả về). */
export type ManagerOrderStatus = ManagerOrderStatusFilter | string

/**
 * Trạng thái vận chuyển (manager): số từ API.
 * Pending = 0 — đang vận chuyển
 * Completed = 1 — đã chuyển xong
 */
export const ManagerDeliveryStatus = {
  Pending: 0,
  Completed: 1
} as const

export type ManagerDeliveryStatus = (typeof ManagerDeliveryStatus)[keyof typeof ManagerDeliveryStatus]

export type ManagerOrderLineItem = {
  productName: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

export type ManagerOrderItem = {
  id: string
  customerId: string
  customerName?: string
  customerPhone?: string | null
  customerEmail?: string | null
  customerAddress?: string | null
  orderDate: string
  name: string
  status: ManagerOrderStatus
  totalAmount: number
  /** 0 = đang vận chuyển, 1 = đã chuyển xong (có thể nhận string từ JSON). */
  deliveryStatus: ManagerDeliveryStatus | string | number
  code: string
  /** Chi tiết dòng hàng (nếu API trả về). */
  orderItems?: ManagerOrderLineItem[]
}

/** Payload `data` từ GET /orders/get/{id}. */
export type ManagerOrderDetail = ManagerOrderItem

export type ManagerOrderPaginationMeta = {
  total_pages: number
  total_items: number
  current_page: number
  page_size: number
}

export type ManagerOrderListResponse = {
  items: ManagerOrderItem[]
  meta: ManagerOrderPaginationMeta
}

/** Tham số query GET /api/v1/orders/get */
export type ManagerOrderListQuery = {
  pageNumber?: number
  pageSize?: number
  orderStatuses?: ManagerOrderStatusFilter[]
  search?: string
  sortBy?: string
  descending?: boolean
}
