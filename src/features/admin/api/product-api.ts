import { apiPublic } from '@/config/axios'
import type { ApiResponseStructure } from '@/types/api-response'
import type { ProductListResponse } from '../types/product-type'

export const ProductApi = {
  getAllProducts: async (page = 1, pageSize = 10): Promise<ApiResponseStructure<ProductListResponse>> =>
    await apiPublic.get(`/products/get?page=${page}&pageSize=${pageSize}`)
}

