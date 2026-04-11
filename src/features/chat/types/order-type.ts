export type OrderItemType = {
  id: string
  quantity: number
  productName: string
  itemsPrice: number
}

export type OrderType = {
  id: string
  customerId: string
  customerName: string | null
  customerPhoneNumber: string | null
  customerEmail: string | null
  customerAddress: string | null
  orderDate: string
  name: string
  status: string
  totalAmount: number
  deliveryStatus: string
  code: string
  orderItems: OrderItemType[]
}