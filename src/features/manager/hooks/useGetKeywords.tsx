import type { PaginationStructure } from '@/types/api-response'
import { useEffect, useState } from 'react'
import type { KeywordDetailType } from '../types/keyword-type'
import useApiCall from '@/config/useApiCall'
import { toast } from 'react-toastify'

export default function useGetKeywords() {
  const [searchText, setSearchText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [keyWordList, setKeyWordList] = useState<PaginationStructure<KeywordDetailType>>()
  const { execute, loading } = useApiCall<PaginationStructure<KeywordDetailType>>()
  const [onRefresh, setOnRefresh] = useState(false)
  useEffect(() => {
    const fetchStaffList = async () => {
      const apiData = await execute({
        apiUrl: `/keywords/get?pageNumber=${currentPage}&pageSize=6`,
        method: 'get',
        type: 'private'
      })
      const { data, error } = apiData
      if (error) {
        toast.error('Lấy danh sách keywords thất bại')
        return
      }
      setKeyWordList(data)
    }
    fetchStaffList()
  }, [searchText, currentPage, onRefresh])
  return { setCurrentPage, setSearchText, keyWordList, loading, currentPage, setOnRefresh }
}
