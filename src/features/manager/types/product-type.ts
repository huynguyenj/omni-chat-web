export type ManagerProductItem = {
  id: string
  name: string
  code: string
  imageUrl: string
  productPackagingType: string
  volumeMl: number
  productKind: string
  description: string
  brand: string | null
  price: number
  quantity: number
  lifeSpan: number
  createDate?: string | null
}

export type ManagerProductListResponse = {
  items: ManagerProductItem[]
  meta: {
    total_pages: number
    total_items: number
    current_page: number
    page_size: number
  }
}
