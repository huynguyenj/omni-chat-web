import { useContext, useEffect, useState } from 'react'
import type { ResolveMessageType } from '../types/message-type'
import { chatApi } from '../api/chat-api'
import { signalrConnection } from '../config/signalr'
import SelectionMessageContext from '../context/SelectionMessageProvider'
// import SelectionMessageContext from '../context/SelectionMessageProvider'

export default function useGetResolveMessage(staffId: string | null) {
  const [resolveMessageTab, setResolveMessageTab] = useState<ResolveMessageType[]>([])
  const context = useContext(SelectionMessageContext)
  // const context = useContext(SelectionMessageContext)
  useEffect(() => {
    const fetchResolveMessage = async () => {
      if (!staffId) return
      try {
        const apiData = await chatApi.getSidebarConversationList(staffId, context?.providerName)
        console.log(apiData)
        setResolveMessageTab(apiData.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchResolveMessage()
  }, [staffId, context?.providerName])

  //set up signalr
  useEffect(() => {
    const newConnection = signalrConnection('supportConversationHub')
    if (newConnection) {
      newConnection.start().then(() => {
        console.log('connected')
        newConnection.on('SidebarUpdated', data => {
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
