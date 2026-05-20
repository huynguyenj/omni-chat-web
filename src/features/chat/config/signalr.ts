import { useAuthStore } from '@/features/auth/store/auth-store'
import * as signalr from '@microsoft/signalr'

export const signalrConnection = (hubPath: string) => {
  const accessToken = useAuthStore.getState().accessToken
  const connection = new signalr.HubConnectionBuilder()
    .withUrl(import.meta.env.VITE_API_BASE_URL+`/${hubPath}`,
      {
        accessTokenFactory: () => accessToken as string
      })
    .withAutomaticReconnect()
    .build()
  return connection
}

export const signalrSidebarConnection = (providerName: string, accessToken: string) => {
  const connection = new signalr.HubConnectionBuilder()
    .withUrl(import.meta.env.VITE_API_BASE_URL+`/SidebarHub?providerName=${providerName}`,
      {
        accessTokenFactory: () => accessToken as string
      })
    .withAutomaticReconnect()
    .build()
  return connection
}