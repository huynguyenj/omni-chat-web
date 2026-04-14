import useContextValid from '@/hooks/useContextValid'
import SelectionMessageContext from '../context/SelectionMessageProvider'
import useApiCall from '@/config/useApiCall'
import type { TaskType } from '@/features/tasks/types/task-type'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function useGetConversationTask() {
  const context = useContextValid(SelectionMessageContext)
  const [conversationTasks, setConversationTasks] = useState<TaskType[]>()
  const { execute, loading } = useApiCall<TaskType[]>()
  const [isReFetch, setIsRefetch] = useState(false)
  useEffect(() => {
    const fetchConversationTask = async () => {
      const apiData = await execute({
        apiUrl: `/support-task/conversation/${context.conversationId}`,
        method: 'get',
        type: 'private'
      })
      const { data } = apiData
      setConversationTasks(data)
    }
    fetchConversationTask()
  }, [context.conversationId, isReFetch])

  const handleUpdateTask = async (taskId: string) => {
    const apiData = await execute({
      apiUrl: `/support-task/${taskId}/complete-task`,
      method: 'patch',
      type: 'private'
    })
    const { error, success } = apiData
    if (success) {
      setIsRefetch((prevState) => !prevState)
      return
    }
    if (error) {
      toast.error('Cập nhật task bị lỗi!')
      return
    }
  }
  return { loading, conversationTasks, handleUpdateTask }
}
