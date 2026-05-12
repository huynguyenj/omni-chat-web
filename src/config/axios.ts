const BASE_URL = import.meta.env.VITE_API_BASE_URL
import { useAuthStore } from '@/features/auth/store/auth-store'
import type { RefreshTokenType } from '@/features/auth/types/login-types'
import { PUBLIC_PATH } from '@/router/path'
import type { ApiResponseStructure } from '@/types/api-response'
import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { redirect } from 'react-router'
import { toast } from 'react-toastify'
export const apiPrivate: AxiosInstance = axios.create({
  baseURL: BASE_URL
})
export const apiPublic: AxiosInstance = axios.create({
  baseURL: BASE_URL
})

apiPublic.interceptors.response.use((response) => {
  return response.data
}, (error: AxiosError) => {
  const errorResponse = error.response?.data as ApiResponseStructure<null>
  return Promise.reject(errorResponse.reason)
})


apiPrivate.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
}, error => Promise.reject(error))

apiPrivate.interceptors.response.use((response) => {
  return response.data
}, async (error: AxiosError) => {
  // Get specific error to check whether it is TOKEN expired or not
  const apiPreviousConfig = error.config as AxiosRequestConfig
  const apiErrorResponse = error.response?.data as ApiResponseStructure<null>

  if (apiErrorResponse.status_code !== 401) return Promise.reject(apiErrorResponse.reason)

  // Logic refresh token
  const authStore = useAuthStore()
  try {
    const apiData: ApiResponseStructure<RefreshTokenType> = await apiPublic.post(BASE_URL + '/auth/refresh-token', { refreshToken: authStore.refreshToken })
    authStore.setAccessToken(apiData.data.accessToken)
    // Get previous header api and pass new access token
    apiPreviousConfig.headers = {
      ...apiPreviousConfig?.headers,
      Authorization: `Bearer ${apiData.data.accessToken}`
    }
    // Recall previous api again
    return apiPrivate(apiPreviousConfig)
  } catch (error) {
    toast.error(error as string)
    authStore.removeAuthInfo()
    redirect(PUBLIC_PATH.LOGIN)
  }
})
