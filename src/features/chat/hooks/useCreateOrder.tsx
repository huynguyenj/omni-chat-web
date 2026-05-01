import useApiCall from '@/config/useApiCall'
import type { OrderRequestType } from '../types/order-type'
import { toast } from 'react-toastify'

export default function useCreateOrder() {
  const { execute, loading } = useApiCall<null>()
  const handleOrder = async (orderData: OrderRequestType) => {
    const apiData = await execute({
      apiUrl: '/orders/create',
      method: 'post',
      type: 'private',
      body: orderData
    })
    const { error, success } = apiData
    if (success) {
      toast.success('Đặt hàng cho sản phẩm thành công')
      return
    }
    if (error) toast.error(error)
  }
  return { loading, handleOrder }
}
