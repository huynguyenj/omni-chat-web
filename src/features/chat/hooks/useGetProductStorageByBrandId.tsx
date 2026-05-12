import useApiCall from '@/config/useApiCall'
import { useEffect, useState } from 'react'
import type { ProductStorageType } from '../types/product-type'
import { toast } from 'react-toastify'

export default function useGetProductStorageByBrandId() {
  const { execute, loading } = useApiCall<ProductStorageType>()
  const [brandId, setBrandId] = useState('')
  const [productStorage, setProductStorage] = useState<ProductStorageType>()
  useEffect(() => {
    if (!brandId) return
    const fetchProductStorage = async () => {
      const apiData = await execute({
        apiUrl: `/brands/${brandId}/product`,
        method: 'get',
        type: 'private'
      })
      const { data, error } = apiData
      if (error) {
        toast.error(error)
        return
      }
      setProductStorage(data)
    }
    fetchProductStorage()
  }, [brandId])
  return { loading, productStorage, setBrandId }
}
