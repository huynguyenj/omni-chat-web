import useApiCall from '@/config/useApiCall'
import { type BatchType } from '@/features/chat/types/batch-type'
import type { PaginationStructure } from '@/types/api-response'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function useGetProductBatchManager() {
  const [productForBatchId, setProductForBatchId] = useState('')
  const { execute, loading } = useApiCall<PaginationStructure<BatchType>>()
  const [productBatchList, setProductBatchList] = useState<PaginationStructure<BatchType>>()
  const [batchCurrentPage, setBatchCurrentPage] = useState(1)

  useEffect(() => {
    if (!productForBatchId) return
    const fetchProductBatch = async () => {
      const apiData = await execute({
        apiUrl: `/products/${productForBatchId}/batches?pageNumber=${batchCurrentPage}&pageSize=5`,
        method: 'get',
        type: 'private'
      })
      const { data, error } = apiData
      if (error) {
        toast.error('Lấy danh sách lô thất bại')
        return
      }
      setProductBatchList(data)
    }
    fetchProductBatch()
  }, [productForBatchId, batchCurrentPage])
  return { productBatchList, setBatchCurrentPage, setProductForBatchId, loading, productForBatchId, batchCurrentPage }
}
