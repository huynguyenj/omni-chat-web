type OrderStatusType = {
   name: string
   tagVariant: 'default' | 'primary' | 'success' | 'danger' | 'warn' | 'gray'
}

export const ORDER_STATUS: Record<string, OrderStatusType> = {
  Draft: {
    name: 'Bản nháp',
    tagVariant: 'gray'
  },
  Pending: {
    name: 'Chờ xử lí',
    tagVariant: 'primary'
  },
  Cancelled: {
    name: 'Đã hủy',
    tagVariant: 'danger'
  },
  Shipped: {
    name: 'Đã giao hàng',
    tagVariant: 'default'
  },
  PendingReturned: {
    name: 'Chờ trả hàng',
    tagVariant: 'warn'
  },
  Returned: {
    name: 'Đã trả hàng',
    tagVariant: 'danger'
  },
  Completed: {
    name: 'Hoàn thành',
    tagVariant: 'success'
  },
  ReturnDefective: {
    name: 'Đã trả hàng do lỗi',
    tagVariant: 'danger'
  }
}

export const DELIVERY_STATUS: Record<string, OrderStatusType> = {
  Pending: {
    name: 'Đang vận chuyển',
    tagVariant: 'primary'
  },

  Completed: {
    name: 'Đã chuyển xong',
    tagVariant: 'success'
  }
}