import useApiCall from '@/config/useApiCall'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'


const chatTemplateSchema = z.object({
  code: z.string().min(1, { error: 'Code không được để trống' }),
  content: z.string().min(1, { error: 'Nội dung không được để trống' })
})

type UseUpdateChatTemplateProps = {
   onRefresh: () => void
   id: string
}


type UpdateChatTemplateType = z.infer<typeof chatTemplateSchema>

export default function useUpdateChatTemplate({ onRefresh, id }: UseUpdateChatTemplateProps) {
  const { formState: { errors }, handleSubmit, register, reset } = useForm<UpdateChatTemplateType>({ resolver: zodResolver(chatTemplateSchema) })
  const { execute, loading } = useApiCall<null>()
  const onSubmit = async (formData: UpdateChatTemplateType) => {
    const apiData = await execute({
      apiUrl: `/chat-templates/${id}`,
      method: 'put',
      type: 'private',
      body: formData
    })
    if (apiData.error) {
      toast.error(apiData.error)
      return
    }
    toast.success('Cập nhật từ mẫu thành công')
    onRefresh()
  }
  return { errors, loading, onSubmit, handleSubmit, register, reset }
}
