import { apiPublic } from '@/config/axios'
import type { ApiResponseStructure, PaginationStructure } from '@/types/api-response'
import type { StaffDetailType, StaffIntentType } from '../types/staff-type'

function resolveStaffGetEndpoint() {
  const baseUrl = (apiPublic.defaults.baseURL ?? '').toLowerCase()
  if (baseUrl.includes('/api/v1')) return '/staff/get'
  return '/api/v1/staff/get'
}

export type ManagerStaffListQuery = {
  departmentIds?: string[]
  search?: string
  pageNumber?: number
  pageSize?: number
  sortBy?: string
  descending?: boolean
}

export type ManagerIntentType = {
  id: string
  typeName: string
  description: string
}

function resolveIntentTypesEndpoint() {
  const baseUrl = (apiPublic.defaults.baseURL ?? '').toLowerCase()
  if (baseUrl.includes('/api/v1')) return '/intent-type/gets'
  return '/api/v1/intent-type/gets'
}

export const ManagerStaffApi = {
  getStaffs: async (
    query: ManagerStaffListQuery = {}
  ): Promise<ApiResponseStructure<PaginationStructure<StaffDetailType>>> => {
    const {
      departmentIds,
      search,
      pageNumber = 1,
      pageSize = 20,
      sortBy,
      descending = false
    } = query

    const endpoint = resolveStaffGetEndpoint()
    const params: Record<string, unknown> = { pageNumber, pageSize, descending }
    if (search?.trim()) params.search = search.trim()
    if (sortBy) params.sortBy = sortBy
    if (departmentIds?.length) params.departmentIds = departmentIds

    const response = await apiPublic.get<ApiResponseStructure<PaginationStructure<StaffDetailType>>>(endpoint, {
      params
    })
    return response as unknown as ApiResponseStructure<PaginationStructure<StaffDetailType>>
  },
  getIntentTypes: async (): Promise<ApiResponseStructure<ManagerIntentType[]>> => {
    const endpoint = resolveIntentTypesEndpoint()
    const response = await apiPublic.get<ApiResponseStructure<ManagerIntentType[]>>(endpoint)
    return response as unknown as ApiResponseStructure<ManagerIntentType[]>
  },

  /**
   * Lấy staffIntentTypes theo staffId bằng cách duyệt paging `/staff/get`
   * (dùng khi API pending-change-tasks không kèm staffIntentTypes).
   */
  resolveStaffIntentTypesByStaffIds: async (staffIds: string[]): Promise<Map<string, StaffIntentType[]>> => {
    const want = new Set(staffIds.filter((id) => id && String(id).trim() !== ''))
    const map = new Map<string, StaffIntentType[]>()
    if (want.size === 0) return map

    let page = 1
    let totalPages = 1
    const pageSize = 100

    while (map.size < want.size && page <= totalPages && page <= 30) {
      const res = await ManagerStaffApi.getStaffs({ pageNumber: page, pageSize, descending: false })
      if (res.is_success === false || res.data == null) break
      const items = Array.isArray(res.data.items) ? res.data.items : []
      for (const s of items) {
        if (want.has(s.id)) {
          map.set(s.id, Array.isArray(s.staffIntentTypes) ? s.staffIntentTypes : [])
        }
      }
      totalPages = Math.max(1, Number(res.data.meta?.total_pages ?? 1))
      page += 1
      if (items.length === 0) break
    }

    return map
  }
}
