import { useEffect, useRef, useState } from 'react'
import Avatar from '@/assets/avatar-sample.jpg'
import ChatMessageBox from '../ui/ChatMessageBox'
import { FiSend } from 'react-icons/fi'
import type { MessageType, SenderMessage } from '../../types/message-type'
import { useAuthStore } from '@/features/auth/store/auth-store'
import CustomerInfo from '../customer/CustomerInfo'
import Button from '@/components/ui/button/Button'
import Input from '@/components/ui/input/Input'
import Logo from '@/assets/logo.jpg'
import { toast } from 'react-toastify'
import { TbLayoutSidebarRightExpandFilled } from 'react-icons/tb'
import { TbLayoutSidebarLeftExpandFilled } from 'react-icons/tb'
import { AnimatePresence, motion } from 'motion/react'
import useConnectChat from '../../hooks/useConnectChat'
import ChatContentSkeleton from '@/components/ui/skeleton/ChatContentSkeleton'

export default function MessageSection() {
  const { connectionRef, conversationDetail, messages, setMessages, context, loading } = useConnectChat()
  const staffId = useAuthStore((state) => state.staffId)
  const inputRef = useRef<HTMLInputElement>(null)
  const messageEndRef = useRef<HTMLDivElement>(null)
  // const [isConnected, setIsConnected] = useState(false)
  const [isCustomerOpen, setIsCustomerOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null)


  const handleSend = async () => {
    if (!inputRef.current) return
    const value = inputRef.current?.value
    const time = new Date().getTime()
    if (!staffId) return
    const connection = connectionRef.current
    if (connection === null) {
      toast.error('Lỗi kết nối hãy thử lại')
      return
    }
    if (value) {
      const newMessage: MessageType = {
        content: value,
        senderId: staffId,
        senderType: 'Staff',
        timestamp: time
      }
      inputRef.current.value = ''
      setMessages((prevMessage) => [...prevMessage, newMessage])
      try {
        const message: SenderMessage = {
          Content: value,
          StaffId: staffId,
          SupportConversationId: context?.conversationId
        }
        console.log(message)
        await connection.invoke('StaffSendMessage', context?.providerName, message)
      } catch (error) {
        console.log('Singlr connected fail', error)
      }
    }
  }
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!isCustomerOpen) return

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null
      if (!target) return

      const clickedPanel = panelRef.current?.contains(target)
      const clickedButton = toggleBtnRef.current?.contains(target)

      if (!clickedPanel && !clickedButton) {
        setIsCustomerOpen(false)
      }
    }

    document.addEventListener('pointerdown', onPointerDown, true)
    return () => document.removeEventListener('pointerdown', onPointerDown, true)
  }, [isCustomerOpen])

  const handleCustomerInfoOpen = () => {
    setIsCustomerOpen((prev) => !prev)
  }

  return (
    <div className='h-full flex overflow-x-hidden'>
      {context?.conversationId ?
        <>
          <div className='flex-2 border-r border-gray-200'>
            <div className='flex items-center justify-between gap-3 border-b border-gray-200 py-4 px-10'>
              <div className='flex gap-2 items-center'>
                <img src={conversationDetail?.avartarUrl ?? Avatar} alt="avatar" className='w-12 h-12 rounded-full'/>
                <div>
                  <p className='text-sm-body-desktop'>{conversationDetail?.customerName}</p>
                  <p className='text-[0.95rem]'>Đang hoạt động</p>
                </div>
              </div>
              <Button ref={toggleBtnRef} onClick={handleCustomerInfoOpen} className={`${isCustomerOpen ? 'bg-secondary text-white' : 'bg-white text-black'} hover:text-white`}>
                {isCustomerOpen ?
                  <TbLayoutSidebarLeftExpandFilled className='size-5'/>
                  :
                  <TbLayoutSidebarRightExpandFilled className='size-5'/>
                }
              </Button>
            </div>
            <div className='bg-[#F5F7FA] overflow-y-auto h-[70%] py-7 px-5'>
              { loading ?
                <ChatContentSkeleton count={3}/>
                :
                <>
                  {messages.map((message) => (
                    <div key={message.timestamp} className={`mt-5 flex ${message.senderType !== 'Customer' && 'justify-end'}`}>
                      <ChatMessageBox
                        message={message.content}
                        sender={message.senderType.toLocaleLowerCase()}
                        time={message.timestamp}
                        highlightWords={message.extractKeywordsResponses?.highlights}
                        recommends={message.extractKeywordsResponses?.recommends}
                      />
                    </div>
                  ))}

                </>
              }
              <div ref={messageEndRef}></div>
            </div>
            <div className='mt-5 px-5 flex gap-3'>
              <Input ref={inputRef} variant='gray' placeholder='Nhập tin nhắn...'/>
              <Button onClick={handleSend} variant='default' className='py-0.5 px-4'>
                <FiSend className='text-white'/>
              </Button>
            </div>
          </div>
          <AnimatePresence>
            { isCustomerOpen &&
            <motion.div
              ref={panelRef}
              initial={{ x:100 }}
              animate={{ x:0 }}
              className='md:flex-1 xl:flex-1.5 right-0 bg-white lg:block z-10'>
              <CustomerInfo
                customerName={conversationDetail?.customerName}
                activeCustomerId={conversationDetail?.activeCustomerId}
                avartarUrl={conversationDetail?.avartarUrl}
              />
            </motion.div>
            }
          </AnimatePresence>
        </>
        :
        <div className='w-full flex flex-col items-center justify-center'>
          <img src={Logo} alt="Logo" className='w-40 h-40'/>
          <p className='text-m-body-desktop font-medium text-gray-600'>Chào mừng đến với Omni chat!</p>
          <p className='text-sm-body-desktop text-gray-500 w-[30%] text-center'>Chọn tin nhắn để phản hồi nhu cầu và mong muốn của khách hàng về sản phẩm</p>
        </div>
      }
    </div>
  )
}
