import useApiCall from '@/config/useApiCall'
import { useState } from 'react'
import { toast } from 'react-toastify'

export default function useDeleteStaff() {
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
  }
  return { loading, handleDelete, setStaffId }
}
