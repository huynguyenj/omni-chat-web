import type { CustomerType } from './customer-info-type'
import type { OrderType } from './order-type'
import type { ProductType } from './product-type'

export type Recommendation =
  | { recommendType: 'SearchOrderHistory'; data: OrderType }
  | { recommendType: 'SearchProduct'; data: ProductType }
  | { recommendType: 'SearchCustomerInfo'; data: CustomerType }
export type KeywordsRecommendation = {
  highlights: string[]
  recommends: Recommendation[]
}