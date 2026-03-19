export function formatDateVi(date: Date | undefined) {
  if (!date) return 'Chọn ngày'
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

