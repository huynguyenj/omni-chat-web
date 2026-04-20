import useApiCall from '@/config/useApiCall'
import { type PaginationStructure } from '@/types/api-response'
import { useEffect, useState } from 'react'
import { type StaffDetailType } from '../types/staff-type'
import { toast } from 'react-toastify'

export default function useGetListStaff() {
  const [searchText, setSearchText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [listStaffs, setListStaffs] = useState<PaginationStructure<StaffDetailType>>()
  const { execute, loading } = useApiCall<PaginationStructure<StaffDetailType>>()
  const [onRefresh, setOnRefresh] = useState(false)
  useEffect(() => {
    const fetchStaffList = async () => {
      const apiData = await execute({
        apiUrl: `/staff/get?pageNumber=${currentPage}&pageSize=6&search=${searchText}&descending=false`,
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
  }, [searchText, currentPage, onRefresh])
  return { setCurrentPage, setSearchText, listStaffs, loading, currentPage, setOnRefresh }
}
