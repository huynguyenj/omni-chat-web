import { useEffect, useState } from 'react'
import type { ResolveMessageType } from '../types/message-type'
import { chatApi } from '../api/chat-api'
import { signalrConnection } from '../config/signalr'

export default function useGetResolveMessage(staffId: string) {
  const [resolveMessageTab, setResolveMessageTab] = useState<ResolveMessageType[]>([])
//   const [connection, setConnection] = useState<HubConnection>()
  useEffect(() => {
    const fetchResolveMessage = async () => {
      try {
        const apiData = await chatApi.getSidebarConversationList(staffId)
        setResolveMessageTab(apiData.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchResolveMessage()
  }, [staffId])

  //set up signalr
  useEffect(() => {
    const newConnection = signalrConnection('/supportConversationHub')
    if (newConnection) {
      newConnection.start().then(() => {
        console.log('connected')
        newConnection.on('SidebarUpdated', data => {
          console.log(data)
          setResolveMessageTab(prev => [...prev, data])
        })
      })
        .catch(err => console.log('Signalr connected fail', err))
    }
    return () => {
      if (newConnection) newConnection.stop()
    }
  }, [])
  return { resolveMessageTab }
}
