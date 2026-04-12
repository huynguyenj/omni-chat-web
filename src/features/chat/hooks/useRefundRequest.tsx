import useApiCall from '@/config/useApiCall'
import { useAuthStore } from '@/features/auth/store/auth-store'
import type { RefundOrderRequest } from '../types/order-type'
import { toast } from 'react-toastify'

type UseRefundRequestProps = {
   orderId: string
}

export default function useRefundRequest({ orderId }: UseRefundRequestProps) {
  const { execute, loading } = useApiCall<null>()
  const staffId = useAuthStore((s) => s.staffId)
  const handleRefundOrder = async (listItems: Map<string, number>, reason: string, customerId: string) => {
    if (!staffId) {
      toast.error('Hãy đăng nhập lại để thực hiện hành động')
      return
    }
    const refundData: RefundOrderRequest = {
      customerId: customerId,
      orderId: orderId,
      reason: reason,
      type: 'Refund',
      presentByStaffId: staffId,
      postSaleItems: Array.from(listItems).map(([orderItemId, quantity]) => ({
        orderItemId: orderItemId,
        quantity: quantity
      }))
    }
    const apiData = await execute({
      apiUrl: '/post-sale-requests/create',
      method: 'post',
      type: 'private',
      body: refundData
    })
    if (apiData.error) toast.error('Hoàn trả hàng thất bại!')
    else toast.success('Hoàn trả thành công! Chờ quản lí xét duyệt')
  }

  return { handleRefundOrder, loading }
}
