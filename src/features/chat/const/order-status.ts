type OrderStatusType = {
   name: string
   tagVariant: 'default' | 'primary' | 'success' | 'danger' | 'warn' | 'gray'
}

export const ORDER_STATUS: Record<string, OrderStatusType> = {
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
    name: 'Đã vận chuyển',
    tagVariant: 'default'
  },
  Returned: {
    name: 'Trả hàng',
    tagVariant: 'warn'
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

export const DELIVERY_STATUS: Record<string, OrderStatusType> = {
  Pending: {
    name: 'Đang chờ giao',
    tagVariant: 'primary'
  },

  Completed: {
    name: 'Giao thành công',
    tagVariant: 'success'
  }
}