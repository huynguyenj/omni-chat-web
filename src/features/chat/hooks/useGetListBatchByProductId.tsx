import useApiCall from '@/config/useApiCall'
import type { PaginationStructure } from '@/types/api-response'
import { useEffect, useState } from 'react'
import type { BatchType } from '../types/batch-type'

export default function useGetListBatchByProductId({ productId }: { productId?: string }) {
  const { execute, loading } = useApiCall<PaginationStructure<BatchType>>()
  const [listBatch, setListBatch] = useState<PaginationStructure<BatchType>>()
  const [newFilter, setNewFilter] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  useEffect(() => {
    if (!productId) return
    const fetchBatchList = async () => {
      const apiData = await execute({
        apiUrl: `/products/${productId}/batches?pageNumber=${currentPage}&pageSize=5&isNewest=${newFilter}`,
        method: 'get',
        type: 'private'
      })
      setListBatch(apiData.data)
    }
    fetchBatchList()
  }, [productId, currentPage, newFilter])
  return { loading, listBatch, setCurrentPage, currentPage, setNewFilter }
}
