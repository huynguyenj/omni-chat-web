export type ManagerShipperApiItem = {
  id: string
  shipperName: string
  shipperStatus: string
  shipperPhone: string
  totalPendingOrders: number
  totalOrderShipNow: number
  totalOrderShipped: number
}

export type ManagerShipperListMeta = {
  total_pages: number
  total_items: number
  current_page: number
  page_size: number
}

export type ManagerShipperListResponse = {
  items: ManagerShipperApiItem[]
  meta: ManagerShipperListMeta
}

export type ManagerShipperListQuery = {
  pageIndex?: number
  pageSize?: number
}
