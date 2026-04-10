import { useAuthStore } from '@/features/auth/store/auth-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'
import type { ClaimCreation } from '../types/claim-type'
import { toast } from 'react-toastify'
import useApiCall from '@/config/useApiCall'

const ClaimFormSchema = z.object({
  claimTypeId: z.string({ error: 'Hãy chọn loại đơn bạn muốn tạo' }),
  reason: z.string({ error: 'Xin hãy viết lí do mà bạn viết đơn' }),
  description: z.string()
})

type ClaimFormType = z.infer<typeof ClaimFormSchema>

export default function useCreateClaim() {
  const { control, register, handleSubmit, formState: { errors } } = useForm<ClaimFormType>({ resolver: zodResolver(ClaimFormSchema) })
  const staffId = useAuthStore((s) => s.staffId)
  const { execute, loading } = useApiCall<null>()
  const onSubmit = async (formData: ClaimFormType) => {
    if (!staffId) {
      toast.error('Hãy đăng nhập trước khi tạo đơn!')
      return
    }
    const finalForm: ClaimCreation = {
      staffId: staffId,
      claimTypeId: formData.claimTypeId,
      description: formData.description,
      reason: formData.reason
    }

    const apiData = await execute({
      apiUrl: '/claims',
      method: 'post',
      type: 'private',
      body: finalForm
    })

    const { error } = apiData
    if (error) toast.error('Tạo đơn thất bại! Xin hãy thử lại')
  }
  return { onSubmit, loading, register, handleSubmit, errors, control }
}
