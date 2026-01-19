export const getTimeHelper = (dateStr: string) => {
  const date = new Date(dateStr)
  const hour = date.getHours()
  const minute = date.getMinutes()
  const timeFormat = `${hour}:${minute.toString().padStart(2, '0')}`
  return timeFormat
}