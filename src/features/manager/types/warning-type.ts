export type ManagerWarningItem = {
  id: string
  customerName: string
  staffName: string
  createAt: string
  warningType: string
  reason: string
  isReviewed?: boolean
}

export type ManagerWarningListResponse = {
  items: ManagerWarningItem[]
  meta: {
    total_pages: number
    total_items: number
    current_page: number
    page_size: number
  }
}

export type ManagerWarningDetailResponse = {
  id: string
  customerName: string
  staffName: string
  createAt: string
  warningType: string
  reason: string
  isReviewed: boolean
}
