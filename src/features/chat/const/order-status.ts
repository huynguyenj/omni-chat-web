type OrderStatusType = {
   name: string
   tagVariant: 'default' | 'primary' | 'success' | 'danger' | 'warn' | 'gray'
}

export const DELIVERY_STATUS: Record<string, OrderStatusType> = {
  Draft: {
    name: 'Bản mẫu',
    tagVariant: 'gray'
  },
  Pending: {
    name: 'Đang xét duyệt',
    tagVariant: 'primary'
  },
  Cancelled: {
    name: 'Bị hủy',
    tagVariant: 'danger'
  },
  Shipped: {
    name: 'Đang vận chuyển',
    tagVariant: 'warn'
  },
  Returned: {
    name: 'Trả hàng',
    tagVariant: 'default'
  },
  Completed: {
    name: 'Thành công',
    tagVariant: 'success'
  },
  ReturnDefective: {
    name: 'Hoàn trả lại hàng',
    tagVariant: 'danger'
  }
}