import useApiCall from '@/config/useApiCall'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Dispatch, type SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'

const keywordSchema = z.object({
  intentTypeId: z.string({ error: 'Hãy chọn chức năng' }),
  weight: z.number(),
  keywordText: z.string().min(1, { error: 'Hãy điền từ keyword' })
})

type KeywordFormType = z.infer<typeof keywordSchema>

type UseCreateKeywordProps = {
   onRefresh: Dispatch<SetStateAction<boolean>>
}

export default function useCreateKeyword({ onRefresh }: UseCreateKeywordProps) {
  const { control, formState: { errors }, register, handleSubmit, reset } = useForm<KeywordFormType>({ resolver: zodResolver(keywordSchema) })
  const { execute, loading } = useApiCall<null>()
  const onSubmit = async (formData: KeywordFormType) => {
    const apiData = await execute({
      apiUrl: '/keywords/create',
      method: 'post',
      type: 'private',
      body: formData
    })
    const { error } = apiData
    if (error) {
      toast.error(error)
      return
    }
    toast.success('Tạo keyword thành công')
    onRefresh(prev => !prev)
  }
  return { loading, control, errors, register, handleSubmit, onSubmit, reset }
}
