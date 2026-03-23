export function formatDateVi(date: Date | undefined) {
  if (!date) return 'Chọn ngày'
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function toDateInputValue(date: Date | undefined) {
  if (!date) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function fromDateInputValue(value: string) {
  if (!value) return undefined

  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d) 
}

