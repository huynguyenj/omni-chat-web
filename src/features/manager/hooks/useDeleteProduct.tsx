import useApiCall from '@/config/useApiCall'
import { useState, type Dispatch, type SetStateAction } from 'react'
import { toast } from 'react-toastify'

type UseDeleteProductProps = {
  onRefresh: Dispatch<SetStateAction<boolean>>
}

export default function useDeleteProduct({ onRefresh }: UseDeleteProductProps) {
  const { execute, loading } = useApiCall<null>()
  const [productId, setProductId] = useState('')
  const handleDelete = async () => {
    const apiData = await execute({
      apiUrl:  `/product/delete/${productId}`,
      method: 'del',
      type: 'private'
    })
    const { error } = apiData
    if (error) {
      toast.error('Xóa sản phẩm thất bại')
      return
    }
    toast.success('Xóa sản phẩm thành công')
    onRefresh(prev => !prev)
  }
  return { loading, handleDelete, setProductId }
}
