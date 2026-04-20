type ProductType = {
   name: string
   style: string
}

export const PRODUCT_TYPE: Record<string, ProductType> = {
  Sugar: {
    name: 'Có đường',
    style: 'border-[#C27AFF] text-[#9810FA]'
  },
  NoSugar: {
    name: 'Không đường',
    style: 'border-[#00C950] text-green-accent'
  },
  Yogurt: {
    name: 'Sữa chua',
    style: 'border-[#FF8904] text-[#F54E06]'
  }
}