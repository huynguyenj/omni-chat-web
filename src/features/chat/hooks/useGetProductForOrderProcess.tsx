import useApiCall from '@/config/useApiCall'
import { useEffect, useState } from 'react'
import { type ProductDetailType } from '../types/product-type'
import { toast } from 'react-toastify'

export default function useGetProductForOrderProcess() {
  const [productKind, setProductKind] = useState<'Sugar' | 'NoSugar' | 'Yogurt'>()
  const [productVolume, setProductVolume] = useState<number>()
  const [productBrand, setProductBrand] = useState('')
  const { execute, loading } = useApiCall<ProductDetailType[]>()
  const [productList, setProductList] = useState<ProductDetailType[]>()

  useEffect(() => {
    const fetchListProduct = async () => {
      const apiData = await execute({
        apiUrl: `/products/get/create-order?${productKind && `ProductKind=${productKind}`}&${productVolume && `VolumeMl=${productVolume}`}&${productBrand && `BrandId=${productBrand}`}`,
        method: 'get',
        type: 'private'
      })
      const { data, error } = apiData
      if (error) {
        toast.error(error)
        return
      }
      setProductList(data)
    }
    fetchListProduct()
  }, [productBrand, productKind, productVolume])
  return { setProductBrand, setProductKind, setProductVolume, loading, productList, productKind, productVolume }
}
