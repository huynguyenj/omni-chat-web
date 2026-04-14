export type TaskCancelReasonPaginationMeta = {
  total_pages: number
  total_items: number
  current_page: number
  page_size: number
}

export type TaskCancelReasonListResponse = {
  items: unknown[]
  meta: TaskCancelReasonPaginationMeta
}
