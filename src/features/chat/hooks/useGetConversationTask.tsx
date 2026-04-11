import useContextValid from '@/hooks/useContextValid'
import SelectionMessageContext from '../context/SelectionMessageProvider'
import useApiCall from '@/config/useApiCall'
import type { TaskType } from '@/features/tasks/types/task-type'
import { useEffect, useState } from 'react'

export default function useGetConversationTask() {
  const context = useContextValid(SelectionMessageContext)
  const [conversationTasks, setConversationTasks] = useState<TaskType[]>()
  const { execute, loading } = useApiCall<TaskType[]>()
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
  }, [context.conversationId])
  return { loading, conversationTasks }
}
