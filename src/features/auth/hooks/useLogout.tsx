import { useAuthStore } from '../store/auth-store'
import useApiCall from '@/config/useApiCall'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { PUBLIC_PATH } from '@/router/path'

export default function useLogout() {
  const resetAuthStore = useAuthStore(s => s.removeAuthInfo)
  const { execute, loading } = useApiCall<null>()
  const navigate = useNavigate()
  const handleLogout = async () => {
    const apiData = await execute({
      apiUrl: '/auth/logout',
      method: 'post',
      type: 'private'
    })
    if (apiData.error) {
      toast.error('Đăng xuất thất bại!')
      return
    }
    resetAuthStore()
    navigate(PUBLIC_PATH.LOGIN, { replace: true })
  }
  return { handleLogout, loading }
}
