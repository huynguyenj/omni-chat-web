import { useAuthStore } from '@/features/auth/store/auth-store'
import { redirect } from 'react-router'
import { ERROR_PATH, PUBLIC_PATH } from '../path'

export default function protectedRole(role: string) {
  return async () => {
    const { accessToken, role: userRole } = useAuthStore.getState()
    if (!accessToken) throw redirect(PUBLIC_PATH.LOGIN)
    if (role && role!== userRole) throw redirect(ERROR_PATH.FORBIDDEN)
    return null
  }
}
