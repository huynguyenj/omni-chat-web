export type ManagerOrderStatus = 'Draft' | 'Confirmed' | 'Completed' | 'Cancelled' | string
export type ManagerDeliveryStatus = 'Pending' | 'Processing' | 'Delivered' | 'Cancelled' | string

export type ManagerOrderItem = {
  id: string
  customerId: string
  customerName?: string
  orderDate: string
  name: string
  status: ManagerOrderStatus
  totalAmount: number
  deliveryStatus: ManagerDeliveryStatus
  code: string
}

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
