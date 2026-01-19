import * as signalr from '@microsoft/signalr'

export const signalrConnection = (hubPath: string) => {
  const connection = new signalr.HubConnectionBuilder()
    .withUrl(import.meta.env.VITE_API_BASE_URL+`/${hubPath}`,
      {
        accessTokenFactory: () => {
          return 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiYjVjZTM3MC02OTYzLTRiOWItOTFiOS02YzVlNjFkZTRhNWMiLCJzdWIiOiI2MmNkNTRmMC1kNDYwLTQ3YzYtYjRlNC0xMjE0MzI4YmExMGQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJPbW5pQ2hhdC5JbmZyYXN0cnVjdHVyZS5Nb2RlbHMuUm9sZSIsIlVzZXJJZCI6ImZlMzAyN2NkLTViYzEtNGFkNS1hYTQ1LWM0ZmM1ZWVkZmQ0NyIsIm5iZiI6MTc2ODg0MTg2OSwiZXhwIjoxNzY4ODQzNjY5LCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo3MTYxIiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzE2MSJ9.aKHdBhETcvUNaYmsun_RABo5Bdt9R9i5dn6yK72DSs8'
        }
      })
    .withAutomaticReconnect()
    .build()
  return connection
}