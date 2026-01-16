import * as signalr from '@microsoft/signalr'

export const signalrConnection = new signalr.HubConnectionBuilder()
  .withUrl(import.meta.env.VITE_API_BASE_URL)
  .withAutomaticReconnect()
  .build()