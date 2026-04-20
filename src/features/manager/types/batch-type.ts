export type BatchItemType = {
   manuFactureDate: Date
   quantity: number
}

export type BatchCreateType = {
  productId: string
  productBatch: BatchItemType[]
}