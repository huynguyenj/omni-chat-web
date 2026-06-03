import useApiCall from '@/config/useApiCall'
import useContextValid from '@/hooks/useContextValid'
import SelectionMessageContext from '../context/SelectionMessageProvider'
import { toast } from 'react-toastify'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const autoOrderSchema = z.object({
  message: z.string().min(1, { error: 'Không được để trống ô nhập tin nhắn' })
})

type AutoOrderType = z.infer<typeof autoOrderSchema>

export default function useAutoCreateOrder() {
  const { execute, loading } = useApiCall<null>()
  const context = useContextValid(SelectionMessageContext)
  const { formState: { errors }, register, handleSubmit } = useForm<AutoOrderType>({ resolver: zodResolver(autoOrderSchema) })
  const handleAutoOrder = async () => {
    if (!context.conversationId) return
    const apiData = await execute({
      apiUrl: '/orders/auto-draft',
      method: 'post',
      type: 'private',
      body: {
        conversationId: context.conversationId
      }
    })
    if (apiData.error) {
      toast.error(apiData.error)
      return
    }
    toast.success('Tự động tạo đơn thành công')
  }

  // const onSubmit = async () => {
  //   if (!context.conversationId) return
  //   const apiData = await execute({
  //     apiUrl: '/orders/auto-draft',
  //     method: 'post',
  //     type: 'private',
  //     body: {
  //       conversationId: context.conversationId
  //     }
  //   })
  //   if (apiData.error) {
  //     toast.error(apiData.error)
  //     return
  //   }
  //   toast.success('Tự động tạo đơn thành công')
  // }

  return { handleAutoOrder, loading, handleSubmit, errors, register }
}
