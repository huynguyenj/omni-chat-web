import type { PaginationStructure } from '@/types/api-response'
import { useEffect, useState } from 'react'
import type { KeywordDetailType } from '../types/keyword-type'
import useApiCall from '@/config/useApiCall'
import { toast } from 'react-toastify'

export default function useGetKeywords() {
  const [searchText, setSearchText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [keyWordList, setKeyWordList] = useState<PaginationStructure<KeywordDetailType>>()
  const [filterIntent, setFilterIntent] = useState('')
  const [sortBy, setSortBy] = useState('createdate')
  const [sortType, setSortType] = useState('false')
  const { execute, loading } = useApiCall<PaginationStructure<KeywordDetailType>>()
  const [onRefresh, setOnRefresh] = useState(false)
  useEffect(() => {
    const fetchKeywordList = async () => {
      const params = new URLSearchParams()
      params.append('pageNumber', currentPage.toString())
      params.append('pageSize', '6')
      params.append('sortBy', sortBy.toString())
      params.append('descending', sortType.toString())
      if (filterIntent || filterIntent !== 'all') params.append('intentTypeId', filterIntent.toString())
      if (searchText) params.append('search', searchText.toString())
      const apiUrl = `/keywords/get?${params.toString()}`
      const apiData = await execute({
        apiUrl: apiUrl,
        method: 'get',
        type: 'private'
      })
      const { data, error } = apiData
      if (error) {
        toast.error(error)
        return
      }
      setKeyWordList(data)
    }
    fetchKeywordList()
  }, [searchText, currentPage, onRefresh, sortType, filterIntent, sortBy])

  const handleSelectIntent = (intentValue: string) => {
    if (intentValue === 'all') {
      setFilterIntent('')
      return
    }
    setFilterIntent(intentValue)
  }
  return { setCurrentPage, setSearchText, keyWordList, loading, currentPage, setOnRefresh, setSortType, sortType, filterIntent, handleSelectIntent, setSortBy, sortBy }
}
