import { useContext, useEffect, useRef, useState } from 'react'
import SelectionMessageContext from '../context/SelectionMessageProvider'
import Avatar from '@/assets/avatar-sample.jpg'
import ChatMessageBox from './ui/ChatMessageBox'
import { FiSend } from 'react-icons/fi'
import { signalrConnection } from '../config/signalr'
type MessageType = {
  message: string
  sender: boolean
  time: string
  conversationId: string
  customer?: string
}


const conversation1: MessageType[] = [
  { conversationId: '1', message: 'Cho minh hoi ve san pham Y', sender: false, time: '4:30', customer: 'Nguyen Van A' },
  { conversationId: '1', message: 'Chao ban minh giup gi duoc cho ban', sender: true, time: '4:35' },
  { conversationId: '1', message: 'San pham Y nay ben minh co nhe', sender: false, time: '4:36', customer: 'Nguyen Van A' }
]

const conversation2: MessageType[] = [
  { conversationId: '2', message: 'Cho minh hoi ve san pham X', sender: false, time: '4:30', customer: 'Nguyen Thi A' },
  { conversationId: '2', message: 'Chao ban minh giup gi duoc cho ban', sender: true, time: '4:35' },
  { conversationId: '2', message: 'San pham X nay ben minh co nhe', sender: false, time: '4:36', customer: 'Nguyen Van A' }
]

const conversation3: MessageType[] = [
  { conversationId: '3', message: 'Cho minh hoi ve san pham Z', sender: false, time: '4:30', customer: 'Nguyen A' },
  { conversationId: '3', message: 'Chao ban minh giup gi duoc cho ban', sender: true, time: '4:35' },
  { conversationId: '3', message: 'San pham Z nay ben minh co nhe', sender: false, time: '4:36', customer: 'Nguyen A' }
]

export default function MessageSection() {
  const context = useContext(SelectionMessageContext)
  const [customerInfo, setCustomerInfo] = useState<string | undefined>()
  const [messages, setMessages] = useState<Omit<MessageType, 'conversationId'>[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const messageEndRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (context?.conversationId === '1') {
      setCustomerInfo(conversation1[0].customer)
      setMessages(conversation1.map((data) => {
        return {
          message: data.message,
          sender: data.sender,
          time: data.time
        }
      }))
    }
    else if (context?.conversationId === '2') {
      setCustomerInfo(conversation2[0].customer)
      setMessages(conversation2.map((data) => {
        return {
          message: data.message,
          sender: data.sender,
          time: data.time
        }
      }))
    }
    else if (context?.conversationId === '3') {
      setCustomerInfo(conversation3[0].customer)
      setMessages(conversation3.map((data) => {
        return {
          message: data.message,
          sender: data.sender,
          time: data.time
        }
      }))
    }
  }, [context?.conversationId])

  const handleSend = () => {
    if (!inputRef.current) return
    const value = inputRef.current?.value
    const time = new Date()
    if (value) {
      const messageContent: Omit<MessageType, 'conversationId'> = {
        message: value,
        sender: true,
        time: time.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
      }
      inputRef.current.value = ''
      signalrConnection.invoke('send', messageContent)
      setMessages([...messages, messageContent])
    }
  }
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    signalrConnection.start()
    signalrConnection.on('receivedMessage', msg => {
      console.log(msg)
    })
  }, [])
  return (
    <div className='h-full'>
      <div className='flex items-center gap-3 border-b border-gray-200 py-4 px-5'>
        <img src={Avatar} alt="avatar" className='w-12 h-12 rounded-full'/>
        <div>
          <p className='text-sm-body-desktop'>{customerInfo}</p>
          <p className='text-[0.95rem]'>Đang hoạt động</p>
        </div>
      </div>
      <div className='bg-[#F5F7FA] overflow-y-auto h-[70%] py-7 px-5'>
        {messages.map((message) => (
          <div className={`mt-5 flex ${message.sender && 'justify-end'}`}>
            <ChatMessageBox message={message.message} sender={message.sender} time={message.time}/>
          </div>
        ))}
        <div ref={messageEndRef}></div>
      </div>
      <div className='mt-5 px-5 flex gap-5'>
        <input ref={inputRef} type="text" placeholder='Nhập tin nhắn...' className='rounded-[5px] py-2 px-3 w-full bg-[#F3F3F5]'/>
        <button className='bg-secondary px-3 rounded-lg hover:bg-primary cursor-pointer' onClick={handleSend}>
          {''}
          <FiSend className='text-white'/>
        </button>
      </div>
    </div>
  )
}
