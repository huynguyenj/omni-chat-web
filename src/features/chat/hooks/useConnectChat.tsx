import { useContext, useEffect, useRef, useState } from 'react'
import * as signalr from '@microsoft/signalr'
import type { ConversationDetail, MessageType } from '../types/message-type'
import SelectionMessageContext from '../context/SelectionMessageProvider'
import { signalrConnection } from '../config/signalr'
import useApiCall from '@/config/useApiCall'
import { toast } from 'react-toastify'

export default function useConnectChat() {
  const connectionRef = useRef<signalr.HubConnection | null>(null)
  const [messages, setMessages] = useState<MessageType[]>([])
  const context = useContext(SelectionMessageContext)
  const [conversationDetail, setConversationDetail] = useState<ConversationDetail>()
  const { execute, loading } = useApiCall<ConversationDetail>()

  useEffect(() => {

    if (!context?.conversationId) return
    const prevConnection = connectionRef.current
    if (prevConnection) {
      prevConnection.off('CustomerReceiveMessage')
      prevConnection.stop()
      connectionRef.current = null
    }
    const connection = signalrConnection('supportConversationHub')
    connectionRef.current = connection
    const startConnection = async () => {
      try {
        await connection.start()
        // setIsConnected(true)

        // Join the conversation group
        await connection.invoke('JoinConversationGroup', context.conversationId)
        console.log(`Joined group: conversation:${context.conversationId}`)
        // Listen for incoming messages
        connection.on('CustomerReceiveMessage', (message: MessageType) => {
          console.log('Received message:', message)
          setMessages((prev) => [...prev, message])
        })
      } catch (err) {
        console.error('SignalR Connection Error:', err)
        // setIsConnected(false)
      }
    }

    startConnection()

    // Cleanup on unmount
    return () => {
      connection.off('CustomerReceiveMessage')
      connection.stop()
      connectionRef.current = null
      // setIsConnected(false)
    }
  }, [context?.conversationId])

  useEffect(() => {
    if (!context?.conversationId) return
    const fetchConversation = async () => {
      setConversationDetail(undefined)
      setMessages([])
      const apiData = await execute({
        apiUrl:  `/support-conversations/${context.conversationId}`,
        method: 'get',
        type: 'private'
      })
      const { data, error } = apiData
      if (error) {
        toast.error('Lấy dữ liệu tin nhắn thất bại!')
        return
      }
      context.handleSaveCustomerId(data.activeCustomerId)
      setConversationDetail(data)
      setMessages(data.messages)
    }
    fetchConversation()
  }, [context?.conversationId])

  return { conversationDetail, messages, connectionRef, setMessages, context, loading }
}
