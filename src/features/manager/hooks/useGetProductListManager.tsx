import useApiCall from '@/config/useApiCall'
import type { ProductDetailType } from '@/features/chat/types/product-type'
import type { PaginationStructure } from '@/types/api-response'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function useGetProductListManager() {
  const [searchText, setSearchText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('createdate')
  const [sortType, setSortType] = useState('false')
  const [listProducts, setListProducts] = useState<PaginationStructure<ProductDetailType>>()
  const { execute, loading } = useApiCall<PaginationStructure<ProductDetailType>>()
  const [onRefresh, setOnRefresh] = useState(false)
  useEffect(() => {
    const fetchStaffList = async () => {
      const params = new URLSearchParams()
      params.append('pageNumber', currentPage.toString())
      params.append('pageSize', '6')
      params.append('sortBy', sortBy.toString())
      params.append('descending', sortType.toString())
      if (searchText) params.append('search', searchText.toString())
      const apiUrl = `/products/get?${params.toString()}`
      const apiData = await execute({
        apiUrl: apiUrl,
        method: 'get',
        type: 'private'
      })
      const { data, error } = apiData
      if (error) {
        toast.error(error)
        return
      }
      setListProducts(data)
    }
    fetchStaffList()
  }, [searchText, currentPage, onRefresh, sortBy, sortType])
  return { setCurrentPage, setSearchText, listProducts, loading, currentPage, setOnRefresh, sortBy, sortType, setSortBy, setSortType }
}
