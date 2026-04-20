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

// export const SORT_BY_NAME: Record<string, string> = {
//   name: ''
// }