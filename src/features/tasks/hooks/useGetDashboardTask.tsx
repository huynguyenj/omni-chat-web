import { useAuthStore } from '@/features/auth/store/auth-store'
import { useEffect, useState } from 'react'
import type { AnalysisTaskType } from '../types/task-type'
import useApiCall from '@/config/useApiCall'
import { toast } from 'react-toastify'
export default function useGetDashboardTask() {
  const staffId = useAuthStore((s) => s.staffId)
  const [dashboardTask, setDashBoardTask] = useState<AnalysisTaskType>()
  const { execute, loading } = useApiCall<AnalysisTaskType>()

  useEffect(() => {
    if (!staffId) {
      toast.error('Hãy đăng nhập để lấy thống kê task!')
      return
    }
    const fetchDashboardTask = async () => {
      const apiData = await execute({
        apiUrl: `/staff/${staffId}/dashboard`,
        method: 'get',
        type: 'private'
      })
      const { data, error } = apiData
      if (error) {
        toast.error('Lấy thống kê task thất bại!')
        return
      }
      setDashBoardTask(data)
    }
    fetchDashboardTask()
  }, [])
  return { dashboardTask, loading }
}
