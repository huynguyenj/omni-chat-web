import useApiCall from '@/config/useApiCall'
import type { ProductDetailType } from '@/features/chat/types/product-type'
import type { PaginationStructure } from '@/types/api-response'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function useGetProductListManager() {
  const [searchText, setSearchText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [listProducts, setListProducts] = useState<PaginationStructure<ProductDetailType>>()
  const { execute, loading } = useApiCall<PaginationStructure<ProductDetailType>>()
  const [onRefresh, setOnRefresh] = useState(false)
  useEffect(() => {
    const fetchStaffList = async () => {
      const apiData = await execute({
        apiUrl: `/products/get?pageNumber=${currentPage}&pageSize=6&search=${searchText}&descending=false`,
        method: 'get',
        type: 'private'
      })
      const { data, error } = apiData
      if (error) {
        toast.error('Lấy danh sách sản phẩm thất bại')
        return
      }
      setListProducts(data)
    }
    fetchStaffList()
  }, [searchText, currentPage, onRefresh])
  return { setCurrentPage, setSearchText, listProducts, loading, currentPage, setOnRefresh }
}
