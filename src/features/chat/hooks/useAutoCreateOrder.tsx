import useApiCall from '@/config/useApiCall'
import useContextValid from '@/hooks/useContextValid'
import SelectionMessageContext from '../context/SelectionMessageProvider'
import { toast } from 'react-toastify'

export default function useAutoCreateOrder() {
  const { execute, loading } = useApiCall<null>()
  const context = useContextValid(SelectionMessageContext)
  const handleAutoOrder = async (message: string) => {
    if (!context.customerId) return
    const data: { customerId: string, message: string } = {
      customerId: context.customerId,
      message: message
    }
    const apiData = await execute({
      apiUrl: '/orders/auto-draft',
      method: 'post',
      type: 'private',
      body: data
    })
    if (apiData.error) {
      toast.error('Tự động tạo đơn thất bại')
      return
    }
    toast.success('Tự động tạo đơn thành công')
  }
  return { handleAutoOrder, loading }
}
