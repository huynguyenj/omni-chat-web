export type ApiResponseStructure<T> = {
  status_code: number
  message: string
  reason: string | null
  is_success: boolean
  data: T
}