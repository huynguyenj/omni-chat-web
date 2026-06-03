import { useContext, useEffect, useRef, useState } from 'react'
import type { ResolveMessageType } from '../types/message-type'
import { signalrSidebarConnection } from '../config/signalr'
import SelectionMessageContext from '../context/SelectionMessageProvider'
import { toast } from 'react-toastify'
import * as signalr from '@microsoft/signalr'
import useApiCall from '@/config/useApiCall'
import { useAuthStore } from '@/features/auth/store/auth-store'


export default function useGetResolveMessage(staffId: string | null) {
  const [resolveMessageTab, setResolveMessageTab] = useState<ResolveMessageType[]>([])
  const context = useContext(SelectionMessageContext)
  const connectionRef = useRef<signalr.HubConnection | null>(null)
  const accessToken = useAuthStore(s => s.accessToken)
  const { execute, loading } = useApiCall<ResolveMessageType[]>()
  useEffect(() => {
    const fetchResolveMessage = async () => {
      if (!staffId) {
        return
      }
      const apiData = await execute({
        apiUrl: `/support-conversations/staff/${staffId}/pending?providerName=${context?.providerName}`,
        method: 'get',
        type: 'private'
      })
      const { data, error } = apiData
      if (error) {
        toast.error(error)
        return
      }
      setResolveMessageTab(data)
    }
    fetchResolveMessage()
  }, [staffId, context?.providerName])
  console.log(context?.providerName)

  //set up signalr
  useEffect(() => {
    const prevConnection = connectionRef.current
    if (prevConnection) {
      prevConnection.off('SidebarUpdated')
      prevConnection.stop()
      connectionRef.current = null
    }
    const newConnection = signalrSidebarConnection(context?.providerName ?? '', accessToken ?? '')
    connectionRef.current = newConnection
    if (newConnection) {
      newConnection.start().then(() => {
        console.log('connected')
        newConnection.on('SidebarUpdated', (data: ResolveMessageType[]) => {
          console.log(data)
          if (data.length === 0) {
            setResolveMessageTab([])
            return
          }
          if (data[0].providerName === context?.providerName) {
            setResolveMessageTab(data)
          }
        })
      })
        .catch(err => console.log('Signalr connected fail', err))
    }
    return () => {
      newConnection.off('SidebarUpdated')
      newConnection.stop()
      connectionRef.current = null
    }
  }, [context?.providerName])
  return { resolveMessageTab, loading }
}
