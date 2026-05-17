import useApiCall from '@/config/useApiCall'
import { type BatchType } from '@/features/chat/types/batch-type'
import type { PaginationStructure } from '@/types/api-response'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function useGetProductBatchManager({ productId }: { productId: string }) {
  const { execute, loading } = useApiCall<PaginationStructure<BatchType>>()
  const [productBatchList, setProductBatchList] = useState<PaginationStructure<BatchType>>()
  const [batchCurrentPage, setBatchCurrentPage] = useState(1)
  const [refreshKey, setRefreshKey] = useState(1)
  useEffect(() => {
    if (!productId) return
    const fetchProductBatch = async () => {
      const apiData = await execute({
        apiUrl: `/products/${productId}/batches?pageNumber=${batchCurrentPage}&pageSize=5&isNewest=${true}`,
        method: 'get',
        type: 'private'
      })
      const { data, error } = apiData
      if (error) {
        toast.error(error)
        return
      }
      setProductBatchList(data)
    }
    fetchProductBatch()
  }, [batchCurrentPage, productId, refreshKey])

  const handleRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1)
  }
  return { productBatchList, setBatchCurrentPage, loading, batchCurrentPage, handleRefresh }
}
