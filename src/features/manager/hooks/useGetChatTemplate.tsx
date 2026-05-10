import useApiCall from '@/config/useApiCall'
import { type PaginationStructure } from '@/types/api-response'
import { type ChatTemplateType } from '../types/chat-template-type'
import { useEffect, useState } from 'react'

export default function useGetChatTemplate() {
  const { execute, loading } = useApiCall<PaginationStructure<ChatTemplateType>>()
  const [listChatTemplate, setListChatTemplate] = useState<PaginationStructure<ChatTemplateType>>()
  const [searchText, setSearchText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isRefresh, setIsRefresh] = useState(false)
  useEffect(() => {
    const fetchChatTemplateList = async () => {
      const param = new URLSearchParams()
      param.append('pageNumber', currentPage.toString())
      param.append('pageSize', '6')
      if (searchText) param.append('search', searchText)
      const apiUrl = `/chat-templates?${param.toString()}`
      const apiData = await execute({
        apiUrl: apiUrl,
        method: 'get',
        type: 'private'
      })
      const { data, error } = apiData
      if (error) return
      setListChatTemplate(data)
    }
    fetchChatTemplateList()
  }, [currentPage, searchText, isRefresh])

  const handleRefresh = () => {
    setCurrentPage(1)
    setSearchText('')
    setIsRefresh(prev => !prev)
  }
  return { listChatTemplate, loading, setSearchText, setCurrentPage, handleRefresh, currentPage }
}
