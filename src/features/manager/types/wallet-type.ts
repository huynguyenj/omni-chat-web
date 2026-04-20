export type ManagerWalletTransaction = {
  id: string
  amount: number
  createDate: string
  transactionType: string
}

export type ManagerWalletInfo = {
  amount: number
  totalDebt: number
  netAmount: number
  transactions: ManagerWalletTransaction[]
}

export type ManagerCustomerWalletItem = {
  id: string
  customerName: string
  email: string | null
  phoneNumber: string | null
  avatarUrl: string | null
  zaloSenderId: string | null
  facebookSenderId: string | null
  instagramSenderId: string | null
  currentProviderName: string | null
  totalOrder: number
  customerDate: string
  totalPayment: number
  getWalletResponse: ManagerWalletInfo
}

export type ManagerCustomerWalletMeta = {
  total_pages: number
  total_items: number
  current_page: number
  page_size: number
}

export type ManagerCustomerWalletPagingResponse = {
  items: ManagerCustomerWalletItem[]
  meta: ManagerCustomerWalletMeta
}

export type ManagerCustomerWalletQuery = {
  customerName?: string
  pageNumber?: number
  pageSize?: number
}
