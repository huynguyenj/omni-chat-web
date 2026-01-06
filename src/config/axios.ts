const BASE_URL = import.meta.env.VITE_API_BASE_URL
import axios, { type AxiosInstance } from 'axios'
const apiPrivate: AxiosInstance = axios.create({
  baseURL: BASE_URL
})

apiPrivate.interceptors.request.use((config) => {
  config.headers.Authorization = 'Bearer'
  return config
}, error => Promise.reject(error))

apiPrivate.interceptors.response.use((response) => {
  return response.data
})