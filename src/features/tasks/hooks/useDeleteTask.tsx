import useApiCall from '@/config/useApiCall'
import { useState } from 'react'
import { toast } from 'react-toastify'

type UseDeleteTaskProps = {
  onRefresh: () => void
}

export default function useDeleteTask({ onRefresh }: UseDeleteTaskProps) {
  const { execute, loading } = useApiCall<null>()
  const [taskId, setTaskId] = useState('')
  const handleDelete = async () => {
    const apiData = await execute({
      apiUrl: `/support-task/${taskId}/delete`,
      method: 'del',
      type: 'private'
    })
    if (apiData.error) {
      toast.error(apiData.error)
      return
    }
    toast.success('Xóa nhiệm vụ thành công')
    onRefresh()
  }
  return { loading, handleDelete, setTaskId }
}