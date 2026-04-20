export type ManagerInvoiceItem = {
  id: string
  customerId: string
  customerName: string
  customerPhoneNumber: string
  customerEmail: string
  customerAddress: string
  startedDate: string
  endedDate: string
  total: number
  invoiceStatus: string
  invoiceMethod: string
  completedDate: string | null
  paidAmount: number
  deductedAmount: number
}

export type ManagerInvoiceListMeta = {
  total_pages: number
  total_items: number
  current_page: number
  page_size: number
}

export type ManagerInvoiceListResponse = {
  items: ManagerInvoiceItem[]
  meta: ManagerInvoiceListMeta
}

export type ManagerInvoiceListQuery = {
  invoiceId?: string
  status?: string
  pageNumber?: number
  pageSize?: number
  sortBy?: string
  descending?: boolean
}
