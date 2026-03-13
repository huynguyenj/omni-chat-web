import { useContext, useEffect, useState } from 'react'
import type { ResolveMessageType } from '../types/message-type'
import { chatApi } from '../api/chat-api'
import { signalrConnection } from '../config/signalr'
import SelectionMessageContext from '../context/SelectionMessageProvider'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'
import { PUBLIC_PATH } from '@/router/path'
// import SelectionMessageContext from '../context/SelectionMessageProvider'

export default function useGetResolveMessage(staffId: string | null) {
  const [resolveMessageTab, setResolveMessageTab] = useState<ResolveMessageType[]>([])
  const context = useContext(SelectionMessageContext)
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
    const newConnection = signalrConnection('supportConversationHub')
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
              //Update the correct awaited message by index
              updatedExistingMessages[existingIndex] = {
                ...updatedExistingMessages[existingIndex],
                lastMessage: data.lastMessage,
                updateDate: data.updateDate
              }
              const [updatedItem] = updatedExistingMessages.splice(existingIndex, 1)
              return [updatedItem, ...updatedExistingMessages]
            }
            return [data, ...prev]
          })
        })
      })
        .catch(err => console.log('Signalr connected fail', err))
    }
    return () => {
      if (newConnection) newConnection.stop()
    }
  }, [context?.providerName])
  return { resolveMessageTab }
}
