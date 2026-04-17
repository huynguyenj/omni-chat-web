import { useAuthStore } from '@/features/auth/store/auth-store'
import { redirect } from 'react-router'
import { PUBLIC_PATH } from '../path'

export default function authLoader() {
  return async () => {
    const accessToken = useAuthStore.getState().accessToken
    if (!accessToken) {
      throw redirect(PUBLIC_PATH.LOGIN)
    }
    return null
  }
}
