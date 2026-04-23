import useApiCall from '@/config/useApiCall'
import { type ProductDetailType } from '@/features/chat/types/product-type'
import { type PaginationStructure } from '@/types/api-response'
import { useEffect, useState } from 'react'

export default function useGetProductForGuest() {
  const [productKind, setProductKind] = useState('All')
  const [volume, setVolume] = useState('All')
  const [packageType, setPackageType] = useState('All')
  const [searchText, setSearchText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('createdate')
  const [isDescending, setIsDescending] = useState(false)
  const [brandId, setBrandId] = useState('')
  const { execute, loading } = useApiCall<PaginationStructure<ProductDetailType>>()
  const [listProductData, setListProductData] = useState<PaginationStructure<ProductDetailType>>()
  useEffect(() => {
    const fetchProducts = async () => {
      const params = new URLSearchParams()
      params.append('pageNumber', currentPage.toString())
      params.append('pageSize', '6')
      params.append('sortBy', sortBy)
      params.append('descending', String(isDescending))
      if (productKind !== 'All') params.append('productKind', productKind)
      if (volume !== 'All') params.append('volumeMl', volume)
      if (brandId) params.append('brandId', brandId)
      if (packageType !== 'All') params.append('packageType', packageType)
      if (searchText) params.append('search', searchText)
      const apiUrl = `/products/get?${params.toString()}`
      const apiData = await execute({
        apiUrl: apiUrl,
        method: 'get',
        type: 'private'
      })
      setListProductData(apiData.data)
    }
    fetchProducts()
  }, [productKind, volume, packageType, searchText, currentPage, sortBy, isDescending, brandId])
  const handleSetDescending = () => {
    setIsDescending(prev => !prev)
  }
  return { currentPage, setCurrentPage, listProductData, loading, productKind, setProductKind, volume, setVolume, packageType, setPackageType, searchText, setSearchText, sortBy, setSortBy, isDescending, setIsDescending, brandId, setBrandId, handleSetDescending }
}
