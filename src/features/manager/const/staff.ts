import type { ListSortByType } from '../types/sort-type'

export const STAFF_LIST_SORT_BY: ListSortByType[] = [
  { name: 'Tên', value: 'name' },
  { name: 'email', value: 'email' },
  { name: 'Số điện thoại', value: 'phone' },
  { name: 'Trạng thái', value: 'status' },
  { name: 'Ngày tạo', value: 'createdate' }
]