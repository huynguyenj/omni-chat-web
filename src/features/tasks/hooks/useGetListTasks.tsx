import useApiCall from '@/config/useApiCall'
import { type PaginationStructure } from '@/types/api-response'
import { type SearchTaskType, type TaskListType } from '../types/task-type'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { useEffect, useState } from 'react'
import { RANGE_DATE_MAP } from '../const/filter'
import { startOfDay } from '@/utils/date-resolver'
import { toast } from 'react-toastify'


export default function useGetListTasks({ currentPage }: { currentPage: number }) {
  const { execute, loading } = useApiCall<PaginationStructure<TaskListType>>()
  const staffId = useAuthStore((s) => s.staffId)
  const [filters, setFilter] = useState<SearchTaskType>({ page: currentPage, pageSize: 10 })
  const [listTasks, setListTasks] = useState<PaginationStructure<TaskListType>>()
  function getDateRange(value: string): { fromDate: Date, toDate: Date } {
    const days = RANGE_DATE_MAP[value]
    if (!days) throw new Error('Invalid range value')

    const now = new Date()

    const toDate = startOfDay(now)

    const from = new Date(toDate)
    from.setDate(from.getDate() - days)

    return {
      fromDate: from,
      toDate
    }
  }
  const handleFilterByDate = (date: string) => {
    if (date === 'all') {
      const removeDateFilter = { ...filters }
      delete removeDateFilter.fromDate
      delete removeDateFilter.toDate
      setFilter(removeDateFilter)
      return
    }
    const { fromDate, toDate } = getDateRange(date)
    setFilter((prevVal) => {
      return { ...prevVal, fromDate: fromDate, toDate: toDate }
    })
  }

  const handleFilterByType = (intentTypeId: string) => {
    if (intentTypeId == 'all') {
      const removeIntentTypeFilter = { ...filters }
      delete removeIntentTypeFilter.intentTypeId
      setFilter(removeIntentTypeFilter)
      return
    }
    setFilter((prevVal) => {
      return { ...prevVal, intentTypeId: intentTypeId }
    })
  }


  useEffect(() => {
    if (!staffId) {
      toast.error('Hãy đăng nhập để thực hiện hành động!')
      return
    }
    const fetchTasks = async () => {
      const apiData = await execute({
        apiUrl: `/staff/${staffId}/tasks`,
        method: 'post',
        type: 'private',
        body: filters
      })
      const { data, error } = apiData
      if (error) {
        toast.error(error)
        return
      }
      setListTasks(data)
    }
    fetchTasks()
  }, [filters, staffId, currentPage])
  return { handleFilterByDate, handleFilterByType, loading, setFilter, listTasks }
}
