import useApiCall from '@/config/useApiCall'
import useContextValid from '@/hooks/useContextValid'
import SelectionMessageContext from '../context/SelectionMessageProvider'
import { toast } from 'react-toastify'

export default function useCompleteConversationId() {
  const { execute, loading } = useApiCall<null>()
  const context = useContextValid(SelectionMessageContext)
  const handleCompleteConversation = async () => {
    if (!context.conversationId) {
      toast.error('Không có id của cuộc trò chuyện')
      return
    }
    const apiData = await execute({
      apiUrl: `/support-conversation/${context.conversationId}/complete`,
      method: 'patch',
      type: 'private'
    })
    const { error } = apiData
    if (error) toast.error('Hoàn thành cuộc trò chuyện thất bại!')
  }
  return { handleCompleteConversation, loading }
}
