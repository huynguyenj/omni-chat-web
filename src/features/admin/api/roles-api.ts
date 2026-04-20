import { apiPublic } from '@/config/axios'
import type { ApiResponseStructure } from '@/types/api-response'

export type RoleItem = {
  id: string
  name: string
}

function resolveRolesGetEndpoint() {
  const baseUrl = (apiPublic.defaults.baseURL ?? '').toLowerCase()
  if (baseUrl.includes('/api/v1')) return '/roles/get'
  return '/api/v1/roles/get'
}

export const RolesApi = {
  /** POST /api/v1/roles/get — body rỗng (Swagger); `data` là mảng { id, name } */
  getRoles: async (): Promise<RoleItem[]> => {
    const body = (await apiPublic.post<ApiResponseStructure<RoleItem[]>>(
      resolveRolesGetEndpoint(),
      {}
    )) as unknown as ApiResponseStructure<RoleItem[]>
    if (body.is_success === false || !Array.isArray(body.data)) {
      throw new Error(body.message || 'Không tải được danh sách vai trò')
    }
    return body.data
  }
}
