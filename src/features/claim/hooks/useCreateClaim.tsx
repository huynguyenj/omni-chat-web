import { useAuthStore } from '@/features/auth/store/auth-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'
import type { ClaimCreation } from '../types/claim-type'
import { toast } from 'react-toastify'
import useApiCall from '@/config/useApiCall'
import { useState } from 'react'

const ClaimFormSchema = z.object({
  claimTypeId: z.string({ error: 'Loại đơn không được để trống' }),
  reason: z.string().min(1, { error: 'Xin hãy viết lí do mà bạn viết đơn' }),
  description: z.string().optional()
})

type ClaimFormType = z.infer<typeof ClaimFormSchema>

type UseCreateClaimProps = {
  onRefresh: () => void
}

export default function useCreateClaim({ onRefresh }: UseCreateClaimProps) {
  const { control, register, handleSubmit, formState: { errors } } = useForm<ClaimFormType>({ resolver: zodResolver(ClaimFormSchema) })
  const staffId = useAuthStore((s) => s.staffId)
  const { execute, loading } = useApiCall<null>()
  const [conversationId, setConversationId] = useState('')
  const onSubmit = async (formData: ClaimFormType) => {
    if (!staffId) {
      toast.error('Hãy đăng nhập trước khi tạo đơn!')
      return
    }
    const finalForm: ClaimCreation = {
      staffId: staffId,
      claimTypeId: formData.claimTypeId,
      description: formData.description ?? '',
      reason: formData.reason,
      supportConversationId: conversationId
    }

    const apiData = await execute({
      apiUrl: '/claims',
      method: 'post',
      type: 'private',
      body: finalForm
    })

    const { error } = apiData
    if (error) toast.error(error)
    else { 
      toast.success('Tạo đơn thành công')
      onRefresh()
    }
  }
  return { onSubmit, loading, register, handleSubmit, errors, control, setConversationId, conversationId }
}
