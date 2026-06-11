import useApiCall from '@/config/useApiCall'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'

const updateTaskSchema = z.object({
  newIntentTypeId: z.string({ error: 'Không được để trống' })
})

type UpdateTaskInfoForm = z.infer<typeof updateTaskSchema>

type UseUpdateTaskProps = {
  onRefresh: () => void
}


export default function useUpdateTask({ onRefresh }: UseUpdateTaskProps) {
  const { execute, loading } = useApiCall<null>()
  const [taskId, setTaskId] = useState('')
  const { control, reset, register, handleSubmit, formState: { errors } } = useForm<UpdateTaskInfoForm>({ resolver: zodResolver(updateTaskSchema) })
  const onSubmit = async (formData: UpdateTaskInfoForm) => {
    const apiData = await execute({
      apiUrl: `/support-task/${taskId}/update-intent-type`,
      method: 'patch',
      type: 'private',
      body: formData
    })
    if (apiData.error) {
      toast.error(apiData.error)
      return
    }
    toast.success('Cập nhật thành công')
    onRefresh()
  }
  return { control, setTaskId, reset, onSubmit, handleSubmit, loading, errors, register }
}