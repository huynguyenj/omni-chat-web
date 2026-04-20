import useApiCall from '@/config/useApiCall'
import { useEffect, useState } from 'react'
import { type BrandType } from '../types/product-type'
import { toast } from 'react-toastify'

export default function useGetAllBrand() {
  const { execute, loading } = useApiCall<BrandType[]>()
  const [listBrand, setListBrand] = useState<BrandType[]>([])
  useEffect(() => {
    const fetchBrand = async () => {
      const apiData = await execute({
        apiUrl: '/brands/get',
        method: 'get',
        type: 'private'
      })
      const { data, error } = apiData
      if (error) {
        toast.error('Lấy danh sách hãng sữa thất bại!')
        return
      }
      setListBrand(data)
    }
    fetchBrand()
  }, [])
  return { loading, listBrand }
}
