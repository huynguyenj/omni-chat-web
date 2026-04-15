const BASE_URL = import.meta.env.VITE_API_BASE_URL
import { useAuthStore } from '@/features/auth/store/auth-store'
import axios, { type AxiosInstance } from 'axios'
export const apiPrivate: AxiosInstance = axios.create({
  baseURL: BASE_URL
})
export const apiPublic: AxiosInstance = axios.create({
  baseURL: BASE_URL
})

apiPublic.interceptors.response.use((response) => {
  return response.data
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
})
