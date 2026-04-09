export type OrderStatus = 'Draft' | 'Confirmed' | 'Completed' | 'Cancelled'
export type DeliveryStatus = 'Pending' | 'Processing' | 'Delivered' | 'Cancelled'

export type AdminOrderItem = {
  id: string
  customerId: string
  orderDate: string
  name: string
  status: OrderStatus | string
  totalAmount: number
  deliveryStatus: DeliveryStatus | string
  code: string
}

export type OrderPaginationMeta = {
  total_pages: number
  total_items: number
  current_page: number
  page_size: number
}

export type OrderListResponse = {
  items: AdminOrderItem[]
  meta: OrderPaginationMeta
}

