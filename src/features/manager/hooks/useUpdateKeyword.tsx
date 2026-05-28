import useApiCall from '@/config/useApiCall'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, type Dispatch, type SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { type KeywordDetailType } from '../types/keyword-type'
import { toast } from 'react-toastify'

const updateKeywordInfoSchema = z.object({
  weight: z.number( { error: 'Độ ưu tiên không được để trống' })
    .refine((val) => !isNaN(val), {
      error: 'Đô ưu tiên không được để trống'
    })
})

type UpdateKeywordFormType = z.infer<typeof updateKeywordInfoSchema>

type UseUpdateKeywordProps = {
   onRefresh: Dispatch<SetStateAction<boolean>>
}

export default function useUpdateKeyword({ onRefresh }: UseUpdateKeywordProps) {
  const { execute, loading } = useApiCall<null>()
  const { handleSubmit, reset, register, formState: { errors } } = useForm<UpdateKeywordFormType>({ resolver: zodResolver(updateKeywordInfoSchema) })
  const [keywordSelected, setKeywordSelected] = useState<KeywordDetailType>()

  const onSubmit = async (formData: UpdateKeywordFormType) => {
    const apiData = await execute({
      apiUrl: `/keywords/update/${keywordSelected?.id}`,
      method: 'put',
      type: 'private',
      body: formData
    })
    const { error } = apiData
    if (error) {
      toast.error(error)
      return
    }
    toast.success('Cập nhật keyword thành công')
    onRefresh((prev) => !prev)
  }
  return { handleSubmit, register, onSubmit, setKeywordSelected, reset, loading, keywordSelected, errors }
}
