import { useAuthStore } from '@/features/auth/store/auth-store'
import { redirect } from 'react-router'
import { ROLE_HOME } from '../const/role-route'

export function guestLoader() {
  return async () => {
    const { accessToken, role } = useAuthStore.getState()

    if (accessToken && role) {
      throw redirect(ROLE_HOME[role])
    }

    return null
  }
}