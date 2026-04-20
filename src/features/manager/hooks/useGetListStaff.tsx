import useApiCall from '@/config/useApiCall'
import { type PaginationStructure } from '@/types/api-response'
import { useEffect, useState } from 'react'
import { type StaffDetailType } from '../types/staff-type'
import { toast } from 'react-toastify'

export default function useGetListStaff() {
  const [searchText, setSearchText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [listStaffs, setListStaffs] = useState<PaginationStructure<StaffDetailType>>()
  const [sortBy, setSortBy] = useState('createdate')
  const [sortType, setSortType] = useState('false')
  const { execute, loading } = useApiCall<PaginationStructure<StaffDetailType>>()
  const [onRefresh, setOnRefresh] = useState(false)
  useEffect(() => {
    const fetchStaffList = async () => {
      const params = new URLSearchParams()
      params.append('pageNumber', currentPage.toString())
      params.append('pageSize', '6')
      params.append('sortBy', sortBy.toString())
      params.append('descending', sortType.toString())
      if (searchText) params.append('search', searchText.toString())
      const apiUrl = `/staff/get?${params.toString()}`
      const apiData = await execute({
        apiUrl: apiUrl,
        method: 'get',
        type: 'private'
      })
      const { data, error } = apiData
      if (error) {
        toast.error('Lấy danh sách nhân viên thất bại')
        return
      }
      setListStaffs(data)
    }
    fetchStaffList()
  }, [searchText, currentPage, onRefresh, sortBy, sortType])
  return { setCurrentPage, setSearchText, listStaffs, loading, currentPage, setOnRefresh, setSortBy, setSortType, sortBy, sortType }
}
