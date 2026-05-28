import useApiCall from '@/config/useApiCall'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'
import type { FormCustomerType } from '../types/form-type'

const customerFormSchema = z.object({
  address: z.string({ error: 'Địa chỉ không được để trống' }),
  phone: z.string({ error: 'Số điện thoại không được để trống' }).max(12, { error: 'Số điện thoại không được quá 12 số' }),
  email: z.email({ error: 'Hãy nhập đúng định dạng của email @gmail.com' })
})

type CustomerFormType = z.infer<typeof customerFormSchema>

export default function useCreateCustomerForm({ activeCustomerId }: { activeCustomerId?: string }) {
  const { formState: { errors }, handleSubmit, register, reset } = useForm<CustomerFormType>({ resolver: zodResolver(customerFormSchema) })
  const { execute, loading } = useApiCall<null>()
  const onSubmit = async (formData: CustomerFormType) => {
    if (!activeCustomerId) return
    const finalForm: FormCustomerType = {
      ...formData,
      activeCustomerId: activeCustomerId
    }
    const apiData = await execute({
      apiUrl: '/customer-profile/enrich',
      method: 'post',
      type: 'public',
      body: finalForm
    })
    if (apiData.error) {
      toast.error(apiData.error)
      return
    }
    toast.success('Gửi đơn thông tin thành công')
    reset()
  }
  return { errors, register, onSubmit, loading, handleSubmit }
}
