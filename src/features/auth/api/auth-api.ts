import type { ApiResponseStructure } from '@/types/api-response'
import type { LoginFormType } from '../hooks/useLogin'
import type { LoginResponseType } from '../types/login-types'
import { apiPublic } from '@/config/axios'

export const AuthApi = {
  login: async (loginData: LoginFormType): Promise<ApiResponseStructure<LoginResponseType>> => await apiPublic.post('/auth/login', loginData)
}