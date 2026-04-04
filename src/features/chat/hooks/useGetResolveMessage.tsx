import { useContext, useEffect, useRef, useState } from 'react'
import type { ResolveMessageType } from '../types/message-type'
import { chatApi } from '../api/chat-api'
import { signalrConnection } from '../config/signalr'
import SelectionMessageContext from '../context/SelectionMessageProvider'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'
import { PUBLIC_PATH } from '@/router/path'
import * as signalr from '@microsoft/signalr'

// import SelectionMessageContext from '../context/SelectionMessageProvider'

export default function useGetResolveMessage(staffId: string | null) {
  const [resolveMessageTab, setResolveMessageTab] = useState<ResolveMessageType[]>([])
  const context = useContext(SelectionMessageContext)
  const connectionRef = useRef<signalr.HubConnection | null>(null)
  const navigate = useNavigate()
  // const context = useContext(SelectionMessageContext)
  useEffect(() => {
    const fetchResolveMessage = async () => {
      if (!staffId) {
        toast.warning('Hãy đăng nhập để thực hiện chức năng')
        navigate(PUBLIC_PATH.LOGIN)
        return
      }
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
    const prevConnection = connectionRef.current
    if (prevConnection) {
      prevConnection.off('SidebarUpdated')
      prevConnection.stop()
      connectionRef.current = null
    }
    const newConnection = signalrConnection('supportConversationHub')
    connectionRef.current = newConnection
    if (newConnection) {
      newConnection.start().then(() => {
        console.log('connected')
        newConnection.on('SidebarUpdated', (data: ResolveMessageType) => {
          console.log(data)
          setResolveMessageTab(prev => {
            //Get the exited one that in previous awaited array
            const existingIndex = prev.findIndex((m) => m.conversationId === data.conversationId)
            if (existingIndex !=-1) {
              //List contain awaited messages
              const updatedExistingMessages = [...prev]
              //Update the old awaited message existed with new message and date
              updatedExistingMessages[existingIndex] = {
                ...updatedExistingMessages[existingIndex],
                lastMessage: data.lastMessage,
                updateDate: data.updateDate
              }
              // Get the updated object by splice method
              const [updatedItem] = updatedExistingMessages.splice(existingIndex, 1)
              // Put the updated message to top
              return [updatedItem, ...updatedExistingMessages]
            }
            return [data, ...prev]
          })
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
  return { resolveMessageTab }
}
