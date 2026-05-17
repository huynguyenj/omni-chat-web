import { ORDER_STATUS } from '@/features/chat/const/order-status'
import type { ManagerOrderStatusFilter } from '../types/order-type'

/** Map tên status cũ từ API → key trong ORDER_STATUS. */
const STATUS_API_ALIASES: Record<string, string> = {
  PendingReturn: 'PendingReturned',
  ReturnedDefective: 'ReturnDefective'
}

export function resolveOrderStatusKey(status: string): string {
  const raw = String(status ?? '').trim()
  if (!raw) return ''
  if (ORDER_STATUS[raw]) return raw
  if (STATUS_API_ALIASES[raw]) return STATUS_API_ALIASES[raw]
  return raw
}

/** Màu pill riêng cho từng status (manager dashboard). */
const STATUS_PILL_CLASS: Record<string, string> = {
  Draft: 'bg-slate-500 text-white',
  Pending: 'bg-[#3366CC] text-white',
  Cancelled: 'bg-[#FB2C36] text-white',
  Shipped: 'bg-[#0ea5e9] text-white',
  PendingReturned: 'bg-[#FF9800] text-white',
  Returned: 'bg-slate-600 text-white',
  Completed: 'bg-[#26C271] text-white',
  ReturnDefective: 'bg-amber-800 text-white',
  ReturnRejected: 'bg-rose-600 text-white',
  RefundRejected: 'bg-red-800 text-white',
  RefundApproved: 'bg-emerald-600 text-white',
  ReturnApproved: 'bg-teal-600 text-white'
}

const STATUS_CARD_BORDER_CLASS: Record<string, string> = {
  Draft: 'border-t-slate-500',
  Pending: 'border-t-[#3366CC]',
  Cancelled: 'border-t-[#FB2C36]',
  Shipped: 'border-t-[#0ea5e9]',
  PendingReturned: 'border-t-[#FF9800]',
  Returned: 'border-t-slate-600',
  Completed: 'border-t-[#26C271]',
  ReturnDefective: 'border-t-amber-800',
  ReturnRejected: 'border-t-rose-600',
  RefundRejected: 'border-t-red-800',
  RefundApproved: 'border-t-emerald-600',
  ReturnApproved: 'border-t-teal-600'
}

const PILL_CLASS_BY_VARIANT: Record<string, string> = {
  gray: 'bg-gray-500 text-white',
  primary: 'bg-[#3366CC] text-white',
  default: 'bg-[#0ea5e9] text-white',
  success: 'bg-[#26C271] text-white',
  danger: 'bg-[#FB2C36] text-white',
  warn: 'bg-[#FF9800] text-white'
}

export function getOrderStatusLabel(status: string): string {
  const key = resolveOrderStatusKey(status)
  return ORDER_STATUS[key]?.name ?? (key || '—')
}

export function getOrderStatusPill(status: string): { label: string; className: string } {
  const key = resolveOrderStatusKey(status)
  const meta = ORDER_STATUS[key]
  if (meta) {
    return {
      label: meta.name,
      className: STATUS_PILL_CLASS[key] ?? PILL_CLASS_BY_VARIANT[meta.tagVariant] ?? 'bg-gray-400 text-white'
    }
  }
  return { label: key || '—', className: 'bg-gray-400 text-white' }
}

export function getOrderStatusCardBorder(status: string): string {
  const key = resolveOrderStatusKey(status)
  return STATUS_CARD_BORDER_CLASS[key] ?? 'border-t-slate-400'
}

export function getOrderStatusUi(status: string): {
  labelVi: string
  pillClass: string
  cardBorderClass: string
} {
  const pill = getOrderStatusPill(status)
  return {
    labelVi: pill.label,
    pillClass: pill.className,
    cardBorderClass: getOrderStatusCardBorder(status)
  }
}

/** Giá trị gửi query `orderStatuses` — khớp enum BE mới. */
export const MANAGER_ORDER_STATUS_FILTER_VALUES: ManagerOrderStatusFilter[] = [
  'Draft',
  'Pending',
  'Cancelled',
  'Shipped',
  'PendingReturned',
  'Returned',
  'Completed',
  'ReturnDefective',
  'ReturnRejected',
  'RefundRejected',
  'RefundApproved',
  'ReturnApproved'
]

export const MANAGER_ORDER_STATUS_FILTERS: Array<{ value: 'all' | ManagerOrderStatusFilter; label: string }> = [
  { value: 'all', label: 'Tất cả' },
  ...MANAGER_ORDER_STATUS_FILTER_VALUES.map((value) => ({
    value,
    label: ORDER_STATUS[value]?.name ?? value
  }))
]
