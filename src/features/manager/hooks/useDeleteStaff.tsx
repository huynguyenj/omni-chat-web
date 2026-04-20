import useApiCall from '@/config/useApiCall'
import { useState, type Dispatch, type SetStateAction } from 'react'
import { toast } from 'react-toastify'

type UseUpdateStaffProps = {
  onRefresh: Dispatch<SetStateAction<boolean>>
  onCloseModalUpdate: Dispatch<SetStateAction<boolean>>
}

export default function useDeleteStaff({ onRefresh, onCloseModalUpdate }: UseUpdateStaffProps) {
  const { execute, loading } = useApiCall<null>()
  const [staffId, setStaffId] = useState('')
  const handleDelete = async () => {
    const apiData = await execute({
      apiUrl:  `/staff/delete/${staffId}`,
      method: 'del',
      type: 'private'
    })
    const { error } = apiData
    if (error) {
      toast.error('Xóa nhân viên thất bại')
      return
    }
    toast.success('Xóa nhân viên thành công')
    onRefresh(prev => !prev)
    onCloseModalUpdate(false)
  }
  return { loading, handleDelete, setStaffId }
}
