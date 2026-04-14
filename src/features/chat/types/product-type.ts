export type ProductType = {
  productId: string
  productName: string
  productCode: string
  productImageUrl: string
}

export interface ProductDetailType {
  id: string;
  imageUrl: string;
  name: string;
  productPackagingType: string
  volumeMl: number;
  description: string;
  brandId: string;
  brand: string;
  price: number;
  code: string;
  quantity: number;
  lifeSpan: number;
}