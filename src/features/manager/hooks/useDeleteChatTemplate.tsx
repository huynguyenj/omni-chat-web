import useApiCall from '@/config/useApiCall'
import { toast } from 'react-toastify'

type UseDeleteChatTemplateProps = {
   onRefresh: () => void
}

export default function useDeleteChatTemplate({ onRefresh }: UseDeleteChatTemplateProps) {
  const { execute, loading } = useApiCall<null>()
  const handleDelete = async (id: string) => {
    const apiData = await execute({
      apiUrl: `/chat-template/${id}`,
      method: 'del',
      type: 'private'
    })
    if (apiData.error) {
      toast.error('Xóa thất bại!')
      return
    }
    toast.success('Xóa thành công')
    onRefresh()
  }
  return { handleDelete, loading }
}
