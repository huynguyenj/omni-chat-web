import useApiCall from '@/config/useApiCall'
import { useAuthStore } from '@/features/auth/store/auth-store'
import type { RefundOrderRequest } from '../types/order-type'
import { toast } from 'react-toastify'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

type UseRefundRequestProps = {
   orderId: string
}

const postRequestSchema = z.object({
  reason: z.string().min(1, 'Lí do không được để trống'),
  type: z.string().min(1, 'Hãy lựa kiểu hoàn trả')
})
type PostRequestFormType = z.infer<typeof postRequestSchema>
export default function useRefundRequest({ orderId }: UseRefundRequestProps) {
  const { execute, loading } = useApiCall<null>()
  const { control, register, reset, formState: { errors }, handleSubmit } = useForm<PostRequestFormType>({ resolver: zodResolver(postRequestSchema) })
  const staffId = useAuthStore((s) => s.staffId)
  const handleRefundOrder = async (listItems: Map<string, number>, customerId: string, formData: PostRequestFormType) => {
    if (!staffId) {
      // toast.error('Hãy đăng nhập lại để thực hiện hành động')
      return
    }
    const refundData: RefundOrderRequest = {
      customerId: customerId,
      orderId: orderId,
      reason: formData.reason,
      type: formData.type,
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
    if (apiData.error) toast.error(apiData.error)
    else toast.success('Hoàn trả thành công! Chờ quản lí xét duyệt')
  }

  return { handleRefundOrder, loading, control, errors, register, reset, handleSubmit }
}
