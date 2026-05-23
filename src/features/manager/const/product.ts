import type { ListSortByType } from '../types/sort-type'

export const PRODUCT_PACKAGE_TYPE: Record<string, string> = {
  Bottle: 'Chai',
  Carton: 'Hộp giấy'
}

export const PRODUCT_LIST_SORT_BY: ListSortByType[] = [
  { name: 'Tên', value: 'name' },
  { name: 'Code', value: 'code' },
  { name: 'Số lượng', value: 'quantity' },
  { name: 'Dung tích', value: 'volumeml' },
  { name: 'Giá', value: 'price' },
  { name: 'Hãng', value: 'brand' },
  { name: 'Ngày tạo', value: 'createdate' }
]

type ProductFilterAndSortType = {
   label: string
   value: string
}
export const LIST_PRODUCT_KIND_FILTER: ProductFilterAndSortType[] = [
  { label: 'Có đường', value: 'Sugar' },
  { label: 'Không đường', value: 'NoSugar' },
  { label: 'Sữa chua', value: 'Yogurt' }
]
export const LIST_PRODUCT_PACKAGE_TYPE: ProductFilterAndSortType[] = [
  { label: 'Chai', value: 'Bottle' },
  { label: 'Hộp giấy', value: 'Carton' }
]
export const LIST_PRODUCT_CAPACITY: ProductFilterAndSortType[] = [
  { label: '180ml', value: '180' },
  { label: '490ml', value: '490' },
  { label: '880ml', value: '880' },
  { label: '1760ml', value: '1760' }
]


// export const SORT_BY_NAME: Record<string, string> = {
//   name: ''
// }