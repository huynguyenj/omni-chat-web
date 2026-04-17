import { useAuthStore } from '@/features/auth/store/auth-store'
import { redirect } from 'react-router'
import { ERROR_PATH } from '../path'

export default function roleLoader(roleExpected: string) {
  return async () => {
    const { role } = useAuthStore.getState()
    if (role !== roleExpected) {
      throw redirect(ERROR_PATH.FORBIDDEN)
    }
    return null
  }
}
