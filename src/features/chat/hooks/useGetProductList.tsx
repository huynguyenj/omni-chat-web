import useApiCall from '@/config/useApiCall'
import { type PaginationStructure } from '@/types/api-response'
import { useEffect, useState } from 'react'
import { type Product } from '../types/product-type'

export default function useGetProductList() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchName, setSearchName] = useState('')
  const { execute, loading } = useApiCall<PaginationStructure<Product>>()
  const [listProducts, setListProducts] = useState<PaginationStructure<Product>>()
  useEffect(() => {
    const fetchProduct = async () => {
      const apiData = await execute({
        apiUrl: `/products/get?search=${searchName}&pageNumber=${currentPage}&pageSize=10`,
        method: 'get',
        type: 'private'
      })
      const { data } = apiData
      setListProducts(data)
    }
    fetchProduct()
  }, [searchName, currentPage])
  return { setCurrentPage, currentPage, setSearchName, loading, listProducts }
}
