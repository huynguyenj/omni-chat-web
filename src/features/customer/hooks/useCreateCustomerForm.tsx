import useApiCall from '@/config/useApiCall'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'

const customerFormSchema = z.object({
  name: z.string({ error: 'Tên không đươc để trống' }),
  phone: z.number({ error: 'Số điện thoại không được để trống' }).max(12, { error: 'Số điện thoại không được quá 12 số' }),
  email: z.email({ error: 'Hãy nhập đúng định dạng của email @gmail.com' })
})

type CustomerFormType = z.infer<typeof customerFormSchema>

export default function useCreateCustomerForm({ conversationId }: { conversationId?: string }) {
  const { formState: { errors }, handleSubmit, register } = useForm<CustomerFormType>({ resolver: zodResolver(customerFormSchema) })
  const { execute, loading } = useApiCall<null>()
  const onSubmit = async (formData: CustomerFormType) => {
    if (!conversationId) return
    const apiData = await execute({
      apiUrl: '',
      method: 'post',
      type: 'public',
      body: formData
    })
    if (apiData.error) toast.error('Tạo thông tin thất bại')
  }
  return { errors, register, onSubmit, loading, handleSubmit }
}
