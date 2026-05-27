import useApiCall from '@/config/useApiCall'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'

const chatTemplateSchema = z.object({
  code: z.string().min(1, { error: 'Code không được để trống' }),
  content: z.string().min(1, { error: 'Nội dung không được để trống' })
})

type CreateChatTemplateType = z.infer<typeof chatTemplateSchema>

type UseCreateChatTemplateProps = {
   onRefresh: () => void
}

export default function useCreateChatTemplate({ onRefresh }: UseCreateChatTemplateProps) {
  const { formState: { errors }, handleSubmit, register } = useForm<CreateChatTemplateType>({ resolver: zodResolver(chatTemplateSchema) })
  const { execute, loading } = useApiCall<null>()
  const onSubmit = async (formData: CreateChatTemplateType) => {
    const apiData = await execute({
      apiUrl: '/chat-templates',
      method: 'post',
      type: 'private',
      body: formData
    })
    if (apiData.error) {
      toast.error(apiData.error)
      return
    }
    toast.success('Tạo từ mẫu thành công')
    onRefresh()
  }
  return { errors, loading, onSubmit, handleSubmit, register }
}
