import useApiCall from '@/config/useApiCall'
import { toast } from 'react-toastify'

export default function useCheckedConversationTask() {
  const { execute, loading } = useApiCall<null>()
  const handleCheckedTask = async (id: string) => {
    const apiData = await execute({
      apiUrl: `/support-task/${id}/complete-task`,
      method: 'patch',
      type: 'private'
    })
    if (!apiData.error) {
      toast.success('Hoàn thành task')
    } else {
      toast.error(apiData.error)
    }

  }
  return { handleCheckedTask, loading }
}
