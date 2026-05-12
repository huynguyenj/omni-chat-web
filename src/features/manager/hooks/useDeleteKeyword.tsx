import useApiCall from '@/config/useApiCall'
import { useState, type Dispatch, type SetStateAction } from 'react'
import { toast } from 'react-toastify'

type UseDeleteKeywordProps = {
  onRefresh: Dispatch<SetStateAction<boolean>>
  onCloseModalDelete: Dispatch<SetStateAction<boolean>>
}

export default function useDeleteKeyword({ onRefresh, onCloseModalDelete }: UseDeleteKeywordProps) {
  const { execute, loading } = useApiCall<null>()
  const [keywordId, setKeywordId] = useState('')
  const handleDelete = async () => {
    const apiData = await execute({
      apiUrl:  `/keywords/delete/${keywordId}`,
      method: 'del',
      type: 'private'
    })
    const { error } = apiData
    if (error) {
      toast.error(error)
      return
    }
    toast.success('Xóa keyword thành công')
    onRefresh(prev => !prev)
    onCloseModalDelete(false)
  }
  return { loading, handleDelete, setKeywordId }
}
