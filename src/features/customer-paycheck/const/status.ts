export const payCheckStatus = (status: string) => {
  switch (status) {
  case 'Pending': return 'Đang chờ thanh toán'
  case 'Refunded': return 'Hoàn tiền'
  case 'Completed': return 'Hoàn thành'
  case 'Cancelled': return 'Hủy'
  default: return status
  }
}