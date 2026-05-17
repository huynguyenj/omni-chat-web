import { PackageMinus, PackagePlus, RotateCcw, type LucideIcon } from 'lucide-react'

type ListType = {
      label: string
      value: string
}

type ActionConfigType = {
      label: string
      icon: LucideIcon
}

export const LIST_FILTER_ACTION: ListType[] = [
  { label: 'Nhập kho', value: 'Enter' },
  { label: 'Xuất kho', value: 'Export' },
  { label: 'Loại bỏ', value: 'Remove' }
]

export const LIST_SORT_AUDIT_BY: ListType[] = [
  { label: 'Ngày', value: 'createDate' },
  { label: 'Giá trị mới', value: 'newValue' },
  { label: 'Giá trị cũ', value: 'oldValue' }
]

export const actionConfig: Record<string, ActionConfigType> = {
  Export: {
    label: 'Xuất kho',
    icon: PackageMinus
  },
  Enter: {
    label: 'Nhập kho',
    icon: PackagePlus
  },
  Adjust: {
    label: 'Xóa',
    icon: RotateCcw
  }
}